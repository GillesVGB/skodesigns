"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { discord, money, type Language } from "@/lib/content";
import { plannerCopy } from "@/lib/planner-copy";
import {
  basePricing,
  pricingTitle,
  type PricingItem,
} from "@/lib/pricing-catalog";
import "@/app/project-planner.css";

type Fields = {
  brand: string;
  platform: string;
  style: string;
  budget: string;
  details: string;
};

export default function ProjectPlanner({
  lang,
  pricing = basePricing(),
}: {
  lang: Language;
  pricing?: PricingItem[];
}) {
  const t = plannerCopy[lang];
  const uid = useId();
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(null);
  const [fields, setFields] = useState<Fields>({
    brand: "",
    platform: "",
    style: "",
    budget: "",
    details: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<"service" | "brand" | "details", string>>
  >({});
  const [status, setStatus] = useState<
    "" | "copied" | "downloaded" | "copyError" | "downloadError"
  >("");
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  const brandInput = useRef<HTMLInputElement>(null);
  const detailsInput = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (previousStep.current !== step) heading.current?.focus();
    previousStep.current = step;
  }, [step]);

  const services = [
    ...pricing.map((item) => ({
      id: item.id,
      price: item.price,
      name: pricingTitle(item, lang),
    })),
    { id: "custom", price: null, name: t.services.custom },
  ];
  const choice = services.find((item) => item.id === service);
  const serviceName = choice?.name || t.noService;
  const price =
    choice && choice.price !== null
      ? `${t.from} ${money(choice.price, lang)}`
      : choice
        ? t.customPrice
        : "—";
  const platform = fields.platform
    ? t.platforms[fields.platform as keyof typeof t.platforms]
    : t.notSet;
  const brief = [
    t.briefTitle,
    "",
    `${t.service}: ${serviceName}`,
    `${t.priceLabel}: ${price}`,
    t.condition,
    "",
    `${t.brand}: ${fields.brand.trim()}`,
    `${t.platform}: ${platform}`,
    `${t.budget}: ${fields.budget.trim() || t.notSet}`,
    "",
    `${t.style}:`,
    fields.style.trim() || t.notSet,
    "",
    `${t.details}:`,
    fields.details.trim(),
    "",
    t.localNotice,
  ].join("\n");

  function update(key: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    setStatus("");
  }
  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    if (step === 0) {
      if (!service) {
        setErrors({ service: t.errors.service });
        document.getElementById(`${uid}-service-${services[0]?.id}`)?.focus();
        return;
      }
    } else if (step === 1) {
      const issues: typeof errors = {};
      if (fields.brand.trim().length < 2 || fields.brand.trim().length > 80)
        issues.brand = t.errors.brand;
      if (
        fields.details.trim().length < 20 ||
        fields.details.trim().length > 2000
      )
        issues.details = t.errors.details;
      if (Object.keys(issues).length) {
        setErrors(issues);
        if (issues.brand) brandInput.current?.focus();
        else detailsInput.current?.focus();
        return;
      }
    } else return;
    setErrors({});
    setStep((value) => value + 1);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(brief);
      setStatus("copied");
    } catch {
      setStatus("copyError");
    }
  }
  function download() {
    try {
      const file = new Blob(["\ufeff", brief], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${t.filename}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("downloaded");
    } catch {
      setStatus("downloadError");
    }
  }

  return (
    <section className="project-planner container">
      <header className="planner-heading">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.description}</p>
      </header>
      <ol className="planner-progress" aria-label={t.progress}>
        {t.steps.map((label, index) => (
          <li
            key={label}
            className={
              index === step ? "current" : index < step ? "complete" : ""
            }
            aria-current={index === step ? "step" : undefined}
          >
            <button
              type="button"
              disabled={index >= step}
              onClick={() => {
                setErrors({});
                setStep(index);
              }}
            >
              <span className="planner-step-number" aria-hidden="true">
                {index < step ? "✓" : `0${index + 1}`}
              </span>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="planner-layout">
        <div className="planner-panel">
          <form onSubmit={next} noValidate>
            <p className="planner-step-caption">
              {t.step} {step + 1} {t.of} 3
            </p>
            <h2 ref={heading} tabIndex={-1}>
              {step === 0
                ? t.chooseTitle
                : step === 1
                  ? t.visionTitle
                  : t.reviewTitle}
            </h2>
            <p className="planner-panel-description">
              {step === 0
                ? t.chooseDescription
                : step === 1
                  ? t.visionDescription
                  : t.reviewDescription}
            </p>
            {step === 0 && (
              <fieldset
                className="planner-services"
                aria-describedby={
                  errors.service ? `${uid}-service-error` : undefined
                }
              >
                <legend className="sr-only">{t.service}</legend>
                {services.map((item) => (
                  <label
                    className={`planner-service ${service === item.id ? "selected" : ""}`}
                    key={item.id}
                  >
                    <input
                      id={`${uid}-service-${item.id}`}
                      type="radio"
                      name="service"
                      value={item.id}
                      checked={service === item.id}
                      onChange={() => {
                        setService(item.id);
                        setErrors({});
                        setStatus("");
                      }}
                    />
                    <span className="planner-choice-mark" aria-hidden="true">
                      {service === item.id ? "✓" : ""}
                    </span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.price === null
                        ? t.customPrice
                        : `${t.from} ${money(item.price, lang)}`}
                    </small>
                  </label>
                ))}
                {errors.service && (
                  <p
                    className="planner-error"
                    id={`${uid}-service-error`}
                    role="alert"
                  >
                    {errors.service}
                  </p>
                )}
              </fieldset>
            )}
            {step === 1 && (
              <div className="planner-fields">
                <div className="planner-field">
                  <label htmlFor={`${uid}-brand`}>
                    {t.brand}
                    <small>{t.required}</small>
                  </label>
                  <input
                    ref={brandInput}
                    id={`${uid}-brand`}
                    name="brand"
                    autoComplete="organization"
                    value={fields.brand}
                    onChange={(event) => update("brand", event.target.value)}
                    minLength={2}
                    maxLength={80}
                    required
                    placeholder={t.brandPlaceholder}
                    aria-invalid={!!errors.brand}
                    aria-describedby={
                      errors.brand ? `${uid}-brand-error` : undefined
                    }
                  />
                  {errors.brand && (
                    <p className="planner-error" id={`${uid}-brand-error`}>
                      {errors.brand}
                    </p>
                  )}
                </div>
                <div className="planner-fields-row">
                  <div className="planner-field">
                    <label htmlFor={`${uid}-platform`}>
                      {t.platform}
                      <small>{t.optional}</small>
                    </label>
                    <select
                      id={`${uid}-platform`}
                      name="platform"
                      value={fields.platform}
                      onChange={(event) =>
                        update("platform", event.target.value)
                      }
                    >
                      <option value="">{t.platformPlaceholder}</option>
                      {Object.entries(t.platforms).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="planner-field">
                    <label htmlFor={`${uid}-budget`}>
                      {t.budget}
                      <small>{t.optional}</small>
                    </label>
                    <input
                      id={`${uid}-budget`}
                      name="budget"
                      maxLength={100}
                      value={fields.budget}
                      onChange={(event) => update("budget", event.target.value)}
                      placeholder={t.budgetPlaceholder}
                    />
                  </div>
                </div>
                <div className="planner-field">
                  <label htmlFor={`${uid}-style`}>
                    {t.style}
                    <small>{t.optional}</small>
                  </label>
                  <textarea
                    id={`${uid}-style`}
                    name="style"
                    rows={3}
                    maxLength={700}
                    value={fields.style}
                    onChange={(event) => update("style", event.target.value)}
                    placeholder={t.stylePlaceholder}
                  />
                </div>
                <div className="planner-field">
                  <label htmlFor={`${uid}-details`}>
                    {t.details}
                    <small>{t.required}</small>
                  </label>
                  <textarea
                    ref={detailsInput}
                    id={`${uid}-details`}
                    name="details"
                    rows={5}
                    minLength={20}
                    maxLength={2000}
                    required
                    value={fields.details}
                    onChange={(event) => update("details", event.target.value)}
                    placeholder={t.detailsPlaceholder}
                    aria-invalid={!!errors.details}
                    aria-describedby={`${uid}-details-hint${errors.details ? ` ${uid}-details-error` : ""}`}
                  />
                  <div className="planner-field-hint">
                    <small id={`${uid}-details-hint`}>{t.detailsHint}</small>
                    <span aria-hidden="true">{fields.details.length}/2000</span>
                  </div>
                  {errors.details && (
                    <p className="planner-error" id={`${uid}-details-error`}>
                      {errors.details}
                    </p>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="planner-result">
                <p className="planner-local-notice">
                  <span aria-hidden="true">✓</span>
                  {t.localNotice}
                </p>
                <pre
                  className="planner-brief"
                  tabIndex={0}
                  aria-label={t.briefTitle}
                >
                  {brief}
                </pre>
                <div className="planner-result-buttons">
                  <button className="button" type="button" onClick={copy}>
                    {status === "copied" ? t.copied : t.copy}
                    <span aria-hidden="true">⧉</span>
                  </button>
                  <button
                    className="button button-outline"
                    type="button"
                    onClick={download}
                  >
                    {t.download}
                    <span aria-hidden="true">↓</span>
                  </button>
                </div>
                <div
                  className={`planner-result-status ${status.endsWith("Error") ? "error" : ""}`}
                  role="status"
                >
                  {status === "copied" && t.copied}
                  {status === "downloaded" && t.downloaded}
                  {status === "copyError" && t.errors.copy}
                  {status === "downloadError" && t.errors.download}
                </div>
                <a
                  className="planner-discord-link"
                  href={discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.discord} (${t.newTab})`}
                >
                  {t.discord}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            )}
            <div className="planner-controls">
              {step > 0 ? (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setStep(step - 1);
                    setErrors({});
                  }}
                >
                  <span aria-hidden="true">←</span>
                  {step === 2 ? t.edit : t.back}
                </button>
              ) : (
                <p>{t.condition}</p>
              )}
              {step < 2 && (
                <button className="button" type="submit">
                  {t.next}
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </form>
        </div>
        <aside className="planner-summary" aria-label={t.summaryTitle}>
          <div className="planner-summary-art">
            <span className="planner-art-orbit" aria-hidden="true" />
            <img
              src="/assets/sko-logo-transparent.png"
              width="2083"
              height="755"
              alt={t.artworkAlt}
            />
          </div>
          <div className="planner-summary-copy">
            <p className="eyebrow">SKO DESIGNS</p>
            <h2>{t.summaryTitle}</h2>
            <p>{t.summaryDescription}</p>
            <dl>
              <div>
                <dt>{t.service}</dt>
                <dd>{serviceName}</dd>
              </div>
              <div>
                <dt>{t.brand}</dt>
                <dd>{fields.brand.trim() || t.noBrand}</dd>
              </div>
              <div>
                <dt>{t.priceLabel}</dt>
                <dd className="planner-summary-price">{price}</dd>
              </div>
            </dl>
            <small>{t.condition}</small>
            <p className="planner-summary-privacy">{t.privacyNote}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
