"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { route, type Language } from "@/lib/content";
import { reviewCopy, type PublicReview } from "@/lib/review-copy";
import "@/app/public-reviews.css";

type FieldErrors = Partial<
  Record<"name" | "rating" | "body" | "consent", string>
>;

export default function PublicReviews({
  lang,
  full = false,
}: {
  lang: Language;
  full?: boolean;
}) {
  const t = reviewCopy[lang];
  const id = useId();
  const modal = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [load, setLoad] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const nameInput = useRef<HTMLInputElement>(null);
  const bodyInput = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoad("loading");
    fetch("/api/reviews/", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("unavailable");
        const data = (await response.json()) as { reviews?: PublicReview[] };
        if (!Array.isArray(data.reviews)) throw new Error("invalid");
        setReviews(data.reviews);
        setLoad("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoad("error");
      });
    return () => controller.abort();
  }, [attempt]);

  function close() {
    modal.current?.close();
    trigger.current?.focus();
  }
  function open() {
    setSuccess(false);
    setServerError("");
    setErrors({});
    modal.current?.showModal();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const issues: FieldErrors = {};
    if (name.trim().length < 2 || name.trim().length > 60)
      issues.name = t.fields.name;
    if (!Number.isInteger(rating) || rating < 1 || rating > 5)
      issues.rating = t.fields.rating;
    if (body.trim().length < 10 || body.trim().length > 1200)
      issues.body = t.fields.body;
    if (!consent) issues.consent = t.fields.consent;
    setErrors(issues);
    setServerError("");
    if (Object.keys(issues).length) {
      if (issues.name) nameInput.current?.focus();
      else if (issues.rating)
        modal.current
          ?.querySelector<HTMLInputElement>('input[name="rating"]')
          ?.focus();
      else if (issues.body) bodyInput.current?.focus();
      else
        modal.current
          ?.querySelector<HTMLInputElement>('input[name="consent"]')
          ?.focus();
      return;
    }
    setSending(true);
    try {
      const honeypot = new FormData(event.currentTarget).get("website");
      const response = await fetch("/api/reviews/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          body: body.trim(),
          consent,
          language: lang,
          website: honeypot || "",
        }),
      });
      const data = (await response.json()) as {
        review?: PublicReview;
        error?: keyof typeof t.errors;
      };
      if (!response.ok || !data.review?.id) {
        setServerError(
          t.errors[data.error || "unavailable"] || t.errors.unavailable,
        );
        return;
      }
      setReviews((current) =>
        [
          data.review!,
          ...current.filter((r) => r.id !== data.review!.id),
        ].slice(0, 50),
      );
      setLoad("ready");
      setSuccess(true);
      setName("");
      setRating(0);
      setBody("");
      setConsent(false);
    } catch {
      setServerError(t.errors.unavailable);
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      className={`public-reviews ${full ? "public-reviews-full" : "public-reviews-home"}`}
      id="reviews"
      aria-labelledby={`${id}-title`}
    >
      <div className="container">
        <div className="public-reviews-heading">
          <h2 id={`${id}-title`}>{t.title}</h2>
          <p className="public-reviews-subtitle">{t.subtitle}</p>
          <button
            className="public-reviews-add"
            type="button"
            ref={trigger}
            aria-label={t.create}
            title={t.create}
            onClick={open}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {load === "loading" && (
          <p className="public-reviews-state" role="status">
            {t.loading}
          </p>
        )}
        {load === "error" && (
          <div className="public-reviews-state" role="status">
            <p>{t.loadError}</p>
            <button
              className="text-link"
              onClick={() => setAttempt((value) => value + 1)}
            >
              {t.retry} ↻
            </button>
          </div>
        )}
        {load === "ready" && reviews.length === 0 && (
          <div className="public-reviews-empty">
            <h3>{t.emptyTitle}</h3>
            <p>{t.empty}</p>
          </div>
        )}
        {reviews.length > 0 && (
          <div className="public-reviews-grid">
            {reviews.map((review) => (
              <figure className="public-reviews-card" key={review.id}>
                <figcaption>
                  <span className="public-reviews-avatar" aria-hidden="true">
                    {review.name.slice(0, 1).toUpperCase()}
                  </span>
                  <strong>{review.name}</strong>
                </figcaption>
                <div
                  className="public-reviews-stars"
                  role="img"
                  aria-label={`${review.rating} / 5 ${t.stars}`}
                >
                  {"★".repeat(review.rating)}
                  <span aria-hidden="true">
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <blockquote lang={review.language}>{review.body}</blockquote>
              </figure>
            ))}
          </div>
        )}
      </div>
      <dialog
        ref={modal}
        className="review-form-dialog"
        aria-labelledby={`${id}-form-title`}
        aria-describedby={`${id}-form-description`}
        onClick={(event) => {
          if (event.target === modal.current) close();
        }}
      >
        <div className="review-form-inner">
          <button
            className="review-form-close"
            type="button"
            aria-label={t.close}
            onClick={close}
          >
            ×
          </button>
          <h2 id={`${id}-form-title`}>{t.formTitle}</h2>
          <p id={`${id}-form-description`}>{t.formDescription}</p>
          {success ? (
            <div className="review-form-success" role="status">
              <span aria-hidden="true">✓</span>
              <p>{t.success}</p>
              <button className="button" onClick={close}>
                {t.close}
              </button>
            </div>
          ) : (
            <form className="review-form" onSubmit={submit} noValidate>
              <div className="review-form-field">
                <label htmlFor={`${id}-name`}>{t.name}</label>
                <input
                  ref={nameInput}
                  id={`${id}-name`}
                  name="name"
                  autoComplete="nickname"
                  minLength={2}
                  maxLength={60}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  aria-invalid={!!errors.name}
                  aria-describedby={
                    errors.name ? `${id}-name-error` : undefined
                  }
                />
                {errors.name && (
                  <p className="review-form-error" id={`${id}-name-error`}>
                    {errors.name}
                  </p>
                )}
              </div>
              <fieldset
                className="review-form-rating"
                aria-describedby={
                  errors.rating ? `${id}-rating-error` : undefined
                }
              >
                <legend>{t.rating}</legend>
                <div role="radiogroup" aria-label={t.ratingLabel}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label
                      key={value}
                      className={
                        value <= rating
                          ? "review-form-star selected"
                          : "review-form-star"
                      }
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={rating === value}
                        onChange={() => setRating(value)}
                        aria-label={`${value} / 5 ${t.stars}`}
                      />
                      <span aria-hidden="true">★</span>
                    </label>
                  ))}
                </div>
                {errors.rating && (
                  <p className="review-form-error" id={`${id}-rating-error`}>
                    {errors.rating}
                  </p>
                )}
              </fieldset>
              <div className="review-form-field">
                <label htmlFor={`${id}-body`}>{t.review}</label>
                <textarea
                  ref={bodyInput}
                  id={`${id}-body`}
                  name="body"
                  minLength={10}
                  maxLength={1200}
                  rows={5}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={t.reviewPlaceholder}
                  aria-invalid={!!errors.body}
                  aria-describedby={
                    errors.body ? `${id}-body-error` : undefined
                  }
                />
                <span className="review-form-count" aria-hidden="true">
                  {body.length} / 1200
                </span>
                {errors.body && (
                  <p className="review-form-error" id={`${id}-body-error`}>
                    {errors.body}
                  </p>
                )}
              </div>
              <div className="review-form-trap" aria-hidden="true">
                <label htmlFor={`${id}-website`}>Website</label>
                <input
                  id={`${id}-website`}
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <label className="review-form-consent">
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  required
                  onChange={(e) => setConsent(e.target.checked)}
                  aria-invalid={!!errors.consent}
                />
                <span>{t.consent}</span>
              </label>
              {errors.consent && (
                <p className="review-form-error">{errors.consent}</p>
              )}
              <p className="review-form-note">
                {t.publicNote}{" "}
                <a href={route(lang, "privacy")}>{t.privacy} ↗</a>
              </p>
              {serverError && (
                <p
                  className="review-form-error review-form-server-error"
                  role="alert"
                >
                  {serverError}
                </p>
              )}
              <button
                className="button review-form-submit"
                type="submit"
                disabled={sending}
              >
                {sending ? t.submitting : t.submit}
                <span aria-hidden="true">↗</span>
              </button>
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}
