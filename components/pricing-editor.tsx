"use client";
import { useId, useState, type FormEvent } from "react";
import { type Language } from "@/lib/content";
import { type PricingItem } from "@/lib/pricing-catalog";
import { managementCopy } from "@/lib/management-copy";
import { adminPricingCopy } from "@/lib/admin-pricing-copy";
export default function PricingEditor({
  lang,
  item,
  onSaved,
  onCancel,
}: {
  lang: Language;
  item: PricingItem | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const t = managementCopy[lang],
    p = adminPricingCopy[lang],
    uid = useId();
  const [kind, setKind] = useState<PricingItem["kind"]>(item?.kind || "single");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    if (!form.checkValidity()) {
      form.reportValidity();
      setError(t.invalid);
      return;
    }
    const fields = new FormData(form);
    const priceText = String(fields.get("price") || "").trim();
    const price = Math.round(Number(priceText.replace(",", ".")) * 100);
    if (
      !/^\d{1,5}([.,]\d{1,2})?$/.test(priceText) ||
      price < 1 ||
      price > 1_000_000
    ) {
      setError(t.invalid);
      return;
    }
    setBusy(true);
    try {
      const payload = {
        id: item?.id,
        title: fields.get("title_nl"),
        kind,
        quantity: kind === "box" ? Number(fields.get("quantity")) : null,
        price,
        ...Object.fromEntries(
          ["nl", "en", "fr"].flatMap((l) => [
            [`title_${l}`, fields.get(`title_${l}`)],
            [`description_${l}`, fields.get(`description_${l}`)],
          ]),
        ),
      };
      const response = await fetch("/api/admin/store/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error);
      }
      form.reset();
      onSaved();
    } catch (e) {
      setError(
        e instanceof Error && ["unauthorized", "forbidden"].includes(e.message)
          ? t.sessionExpired
          : t.error,
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-editor" onSubmit={save} noValidate>
      <h2>
        {item ? p.edit : p.new} — {p.store}
      </h2>
      <p>{t.publicNotice}</p>
      <label htmlFor={`${uid}-kind`}>{p.kind}</label>
      <select
        id={`${uid}-kind`}
        value={kind}
        onChange={(e) => setKind(e.target.value as PricingItem["kind"])}
      >
        <option value="package">{p.package}</option>
        <option value="single">{p.single}</option>
        <option value="box">{p.box}</option>
      </select>
      {kind === "box" && (
        <>
          <label htmlFor={`${uid}-quantity`}>{p.quantity}</label>
          <input
            id={`${uid}-quantity`}
            type="number"
            name="quantity"
            min={1}
            max={1000}
            step={1}
            defaultValue={item?.quantity || 1}
            required
          />
        </>
      )}
      {(["nl", "en", "fr"] as const).map((l) => (
        <div className="admin-language-field" key={l}>
          <label htmlFor={`${uid}-title-${l}`}>{p[`title_${l}`]}</label>
          <input
            id={`${uid}-title-${l}`}
            name={`title_${l}`}
            lang={l}
            defaultValue={item?.[`title_${l}`] || ""}
            required
            minLength={2}
            maxLength={120}
          />
        </div>
      ))}
      <label htmlFor={`${uid}-price`}>{t.price}</label>
      <input
        id={`${uid}-price`}
        name="price"
        inputMode="decimal"
        defaultValue={item ? (item.price / 100).toFixed(2) : ""}
        placeholder={t.pricePlaceholder}
        required
        maxLength={8}
      />
      <small>{p.descriptionHint}</small>
      {(["nl", "en", "fr"] as const).map((l) => (
        <div className="admin-language-field" key={l}>
          <label htmlFor={`${uid}-description-${l}`}>
            {
              t[
                (
                  {
                    nl: "descriptionNl",
                    en: "descriptionEn",
                    fr: "descriptionFr",
                  } as const
                )[l]
              ]
            }
          </label>
          <textarea
            id={`${uid}-description-${l}`}
            name={`description_${l}`}
            lang={l}
            rows={kind === "package" ? 6 : 3}
            minLength={kind === "package" ? 3 : 0}
            maxLength={2000}
            required={kind === "package"}
            defaultValue={item?.[`description_${l}`] || ""}
          />
        </div>
      ))}
      {error && (
        <p className="management-error" role="alert">
          {error}
        </p>
      )}
      <button className="button" disabled={busy}>
        {busy ? t.saving : t.save}
        <span aria-hidden="true">↗</span>
      </button>
      {item && (
        <button
          className="text-link"
          type="button"
          disabled={busy}
          onClick={onCancel}
        >
          {t.cancel}
        </button>
      )}
    </form>
  );
}
