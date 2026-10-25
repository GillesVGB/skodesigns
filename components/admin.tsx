"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  dictionaries,
  money,
  route,
  type Language,
  type Project,
} from "@/lib/content";
import { pricingTitle, type PricingItem } from "@/lib/pricing-catalog";
import { managementCopy } from "@/lib/management-copy";
import { adminPricingCopy } from "@/lib/admin-pricing-copy";
import PricingEditor from "./pricing-editor";
import "@/app/management.css";
type Review = { id: string; name: string; body: string; rating: number };
type User = { id: string; name: string; avatar: string | null };
type Collection = "portfolio" | "store" | "reviews";
type Content = {
  portfolio: Project[];
  store: PricingItem[];
  reviews: Review[];
};
export default function Admin({ lang }: { lang: Language }) {
  const t = managementCopy[lang],
    p = adminPricingCopy[lang],
    uid = useId();
  const [user, setUser] = useState<User | null>(null),
    [configured, setConfigured] = useState(true),
    [loading, setLoading] = useState(true),
    [tab, setTab] = useState<Collection>("portfolio"),
    [content, setContent] = useState<Content>({
      portfolio: [],
      store: [],
      reviews: [],
    }),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState(""),
    [error, setError] = useState(""),
    [pending, setPending] = useState<{
      collection: Collection;
      id: string;
      title: string;
    } | null>(null),
    [preview, setPreview] = useState(""),
    [editing, setEditing] = useState<PricingItem | null>(null),
    [attempt, setAttempt] = useState(0);
  const [undo, setUndo] = useState<{
    collection: "portfolio" | "store";
    id: string;
  } | null>(null);
  const confirmDialog = useRef<HTMLDialogElement>(null),
    deleteTrigger = useRef<HTMLButtonElement | null>(null);
  function failure(reason: string) {
    setError(
      reason === "setup"
        ? t.setup
        : ["unauthorized", "forbidden"].includes(reason)
          ? t.sessionExpired
          : reason === "tooLarge"
            ? t.tooLarge
            : reason === "invalidImage"
              ? t.invalidImage
              : reason === "invalid"
                ? t.invalid
                : t.error,
    );
    if (["unauthorized", "forbidden"].includes(reason)) setUser(null);
  }
  async function loadContent() {
    const response = await fetch("/api/admin/content/", { cache: "no-store" });
    const data = (await response.json()) as Content & { error?: string };
    if (!response.ok) throw new Error(data.error);
    setContent(data);
  }
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/admin/session/", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as {
          configured?: boolean;
          user?: User | null;
          error?: string;
        };
        if (!active) return;
        setConfigured(data.configured !== false);
        if (response.status === 401 || response.status === 403) {
          setUser(null);
          if (response.status === 403) setError(t.denied);
          return;
        }
        if (!response.ok) throw new Error(data.error);
        setUser(data.user || null);
        if (data.user) await loadContent();
        const result = new URLSearchParams(location.search).get("login");
        if (result === "denied") setError(t.denied);
        if (result === "error") setError(t.loginError);
      })
      .catch((e) => {
        if (active) failure(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt, lang]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  async function logout() {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/logout/", { method: "POST" });
      if (!response.ok) throw new Error();
      setUser(null);
      setContent({ portfolio: [], store: [], reviews: [] });
      setStatus("");
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  }
  async function savePortfolio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setStatus("");
    if (!form.checkValidity()) {
      form.reportValidity();
      setError(t.invalid);
      return;
    }
    const fields = new FormData(form),
      file = fields.get("file") as File | null;
    if (!file?.size) {
      setError(t.requiredImage);
      return;
    }
    if (file.size > 8_000_000) {
      setError(t.tooLarge);
      return;
    }
    setBusy(true);
    try {
      const upload = new FormData();
      upload.set("file", file);
      const uploaded = await fetch("/api/admin/upload/", {
        method: "POST",
        body: upload,
      });
      const image = (await uploaded.json()) as {
        error?: string;
        image: string;
        width: number;
        height: number;
      };
      if (!uploaded.ok) throw new Error(image.error);
      const response = await fetch("/api/admin/portfolio/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...image,
          title: fields.get("title"),
          category: fields.get("category"),
          featured: fields.get("featured") === "on",
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error);
      form.reset();
      setPreview("");
      setStatus(t.saved);
      loadContent().catch(() => setError(t.error));
    } catch (e) {
      failure(e instanceof Error ? e.message : "");
    } finally {
      setBusy(false);
    }
  }
  function closeConfirmation() {
    confirmDialog.current?.close();
    setPending(null);
    deleteTrigger.current?.focus();
  }
  async function remove() {
    if (!pending) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const response = await fetch(
        `/api/admin/${pending.collection}/${encodeURIComponent(pending.id)}/`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error);
      }
      closeConfirmation();
      setEditing(null);
      setStatus(t.deleted);
      setUndo(
        pending.collection === "reviews"
          ? null
          : { collection: pending.collection, id: pending.id },
      );
      loadContent().catch(() => setError(t.error));
    } catch (e) {
      failure(e instanceof Error ? e.message : "");
    } finally {
      setBusy(false);
    }
  }
  async function restore() {
    if (!undo) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/restore/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(undo),
      });
      if (!response.ok) throw new Error();
      setUndo(null);
      setStatus(p.restored);
      await loadContent();
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  }
  const labels = { portfolio: t.portfolio, store: p.store, reviews: t.reviews };
  return (
    <section className="admin-page container">
      <header className="management-heading">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.intro.replace(t.store, p.store)}</p>
      </header>
      {loading ? (
        <p role="status">{t.loading}</p>
      ) : !user ? (
        <div className="admin-login">
          <img src="/assets/sko-icon.webp" alt="" width="64" height="64" />
          <h2>{t.loginTitle}</h2>
          <p>{t.loginDescription}</p>
          {!configured && (
            <p className="admin-setup" role="status">
              {t.setup}
            </p>
          )}
          {error && (
            <p className="management-error" role="alert">
              {error}
            </p>
          )}
          {configured && (
            <a className="button" href={`/api/auth/discord/?lang=${lang}`}>
              {t.login}
              <span aria-hidden="true">↗</span>
            </a>
          )}
          <a className="text-link" href={route(lang)}>
            {t.back}
          </a>
        </div>
      ) : (
        <>
          <div className="admin-account">
            <span>
              {user.avatar && (
                <img src={user.avatar} alt="" width="34" height="34" />
              )}
              {t.staffAccount} <strong>{user.name}</strong>
            </span>
            <button className="text-link" onClick={logout} disabled={busy}>
              {t.logout}
            </button>
          </div>
          <div className="admin-tabs" role="group" aria-label={t.admin}>
            {Object.entries(labels).map(([key, label]) => (
              <button
                key={key}
                aria-pressed={tab === key}
                onClick={() => {
                  setTab(key as Collection);
                  setUndo(null);
                  setStatus("");
                  setError("");
                  setPreview("");
                  setEditing(null);
                }}
              >
                {label}
                <span>{content[key as Collection].length}</span>
              </button>
            ))}
          </div>
          <div className="management-status" role="status">
            {status}
            {undo && (
              <button
                className="text-link admin-undo"
                disabled={busy}
                onClick={restore}
              >
                {p.undo}
              </button>
            )}
          </div>
          {error && (
            <p className="management-error" role="alert">
              {error}
            </p>
          )}
          <div
            className={`admin-layout ${tab === "reviews" ? "admin-reviews-layout" : ""}`}
          >
            {tab === "store" && (
              <PricingEditor
                key={editing?.id || "new"}
                lang={lang}
                item={editing}
                onCancel={() => setEditing(null)}
                onSaved={() => {
                  setEditing(null);
                  setStatus(p.saved);
                  loadContent().catch(() => setError(t.error));
                }}
              />
            )}
            {tab === "portfolio" && (
              <form
                className="admin-editor"
                onSubmit={savePortfolio}
                noValidate
              >
                <h2>
                  {t.add} — {t.portfolio}
                </h2>
                <p>{t.publicNotice}</p>
                <label htmlFor={`${uid}-title`}>{t.titleLabel}</label>
                <input
                  id={`${uid}-title`}
                  name="title"
                  minLength={2}
                  maxLength={120}
                  required
                />
                <label htmlFor={`${uid}-category`}>{t.category}</label>
                <select id={`${uid}-category`} name="category">
                  {Object.entries(dictionaries[lang].work.filters)
                    .filter(([key]) =>
                      [
                        "logos",
                        "banners",
                        "thumbnails",
                        "mockups",
                        "discord",
                        "other",
                      ].includes(key),
                    )
                    .map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                </select>
                <label className="admin-checkbox">
                  <input type="checkbox" name="featured" defaultChecked />
                  {t.featured}
                </label>
                <label htmlFor={`${uid}-file`}>{t.requiredImage}</label>
                <input
                  id={`${uid}-file`}
                  name="file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  required
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setPreview(file ? URL.createObjectURL(file) : "");
                  }}
                />
                <small>{t.imageHelp}</small>
                {preview && (
                  <img
                    className="admin-upload-preview"
                    src={preview}
                    alt={t.image}
                  />
                )}
                <button className="button" disabled={busy}>
                  {busy ? t.saving : t.save}
                  <span aria-hidden="true">↗</span>
                </button>
              </form>
            )}
            <div className="admin-items">
              <div className="admin-items-heading">
                <h2>{labels[tab]}</h2>
                <button
                  className="text-link"
                  disabled={busy}
                  onClick={() => {
                    setError("");
                    loadContent().catch((e) => failure(e.message));
                  }}
                >
                  {t.refresh}
                </button>
              </div>
              {content[tab].length === 0 && <p>{t.empty}</p>}
              {content[tab].map((item) => {
                const isReview = "rating" in item,
                  isPrice = "price" in item;
                const name = isReview
                  ? item.name
                  : isPrice
                    ? pricingTitle(item, lang)
                    : item.title;
                const image = !isPrice && "image" in item ? item.image : null;
                return (
                  <article className="admin-item" key={item.id}>
                    {image && (
                      <img
                        src={image.startsWith("/") ? image : "/assets/" + image}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    <div>
                      <h3>{name}</h3>
                      {isReview ? (
                        <>
                          <span aria-label={`${item.rating} / 5`}>
                            {"★".repeat(item.rating)}
                          </span>
                          <p>{item.body}</p>
                        </>
                      ) : isPrice ? (
                        <p>{money(item.price, lang)}</p>
                      ) : (
                        <p>
                          {
                            dictionaries[lang].work.filters[
                              item.category as keyof typeof dictionaries.nl.work.filters
                            ]
                          }
                        </p>
                      )}
                    </div>
                    {isPrice && (
                      <button
                        className="text-link admin-edit"
                        disabled={busy}
                        onClick={() => {
                          setEditing(item);
                          setStatus("");
                          setError("");
                        }}
                        aria-label={`${p.edit}: ${name}`}
                      >
                        {p.edit}
                      </button>
                    )}
                    <button
                      className="admin-delete"
                      disabled={busy}
                      onClick={(event) => {
                        deleteTrigger.current = event.currentTarget;
                        setPending({
                          collection: tab,
                          id: item.id,
                          title: name,
                        });
                        confirmDialog.current?.showModal();
                      }}
                      aria-label={`${t.delete}: ${name}`}
                    >
                      {t.delete}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </>
      )}
      <dialog
        className="admin-confirm"
        ref={confirmDialog}
        aria-labelledby={`${uid}-confirm-title`}
        onCancel={() => {
          setPending(null);
          deleteTrigger.current?.focus();
        }}
      >
        <h2 id={`${uid}-confirm-title`}>{t.confirmTitle}</h2>
        <strong>{pending?.title}</strong>
        <p>
          {pending?.collection === "reviews"
            ? t.confirmDescription
            : p.deleteDescription}
        </p>
        <div>
          <button
            className="button button-outline"
            disabled={busy}
            onClick={closeConfirmation}
          >
            {t.cancel}
          </button>
          <button
            className="button admin-destructive"
            disabled={busy}
            onClick={remove}
          >
            {busy
              ? t.saving
              : pending?.collection === "reviews"
                ? t.confirm
                : t.delete}
          </button>
        </div>
      </dialog>
    </section>
  );
}
