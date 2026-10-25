"use client";
import { useState } from "react";
import {
  discord,
  money,
  route,
  type Dictionary,
  type Language,
} from "@/lib/content";
import {
  pricingDescription,
  pricingTitle,
  type PricingItem,
} from "@/lib/pricing-catalog";
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
export default function ManagedPricing({
  lang,
  d,
  items,
}: {
  lang: Language;
  d: Dictionary;
  items: PricingItem[];
}) {
  const packages = items.filter((item) => item.kind === "package"),
    singles = items.filter((item) => item.kind === "single"),
    boxes = items.filter((item) => item.kind === "box");
  return (
    <section className="pricing-section section-space container">
      <h2 className="sr-only">{d.nav.pricing}</h2>
      {packages.length > 0 && (
        <div className="package-grid">
          {packages.map((item, index) => {
            const [description, ...features] = pricingDescription(item, lang)
              .split("\n")
              .filter((line) => line.trim());
            const name = pricingTitle(item, lang);
            const highlighted = item.id === "package-discord";
            return (
              <article
                className={`package ${highlighted ? "package-featured" : ""}`}
                key={item.id}
              >
                <div className="package-heading">
                  <span className="eyebrow">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3>{name}</h3>
                <p>{description}</p>
                <div className="package-price">
                  <small>{d.ui.from}</small>
                  <strong>{money(item.price, lang)}</strong>
                </div>
                <ul>
                  {features.map((feature, index) => (
                    <li key={index}>
                      <span aria-hidden="true">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`button ${highlighted ? "button-white" : "button-outline"}`}
                  aria-label={`${d.ui.order}: ${name} (${d.ui.newTab})`}
                >
                  {d.ui.order}
                  <Arrow />
                </a>
              </article>
            );
          })}
        </div>
      )}
      <p className="price-condition">{d.pricing.condition}</p>
      <div className="price-tables">
        {[
          { title: d.pricing.singles, items: singles },
          { title: d.pricing.boxes, items: boxes },
        ]
          .filter((group) => group.items.length)
          .map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((item) => (
                <div className="price-row" key={item.id}>
                  <span>
                    {pricingTitle(item, lang)}
                    {pricingDescription(item, lang) && (
                      <small className="price-item-description">
                        {pricingDescription(item, lang)}
                      </small>
                    )}
                  </span>
                  <strong>{money(item.price, lang)}</strong>
                </div>
              ))}
            </div>
          ))}
      </div>
      {(singles.length > 0 || boxes.length > 0) && (
        <Builder lang={lang} d={d} singles={singles} boxes={boxes} />
      )}
      <div className="custom-quote">
        <div>
          <h3>{d.pricing.custom}</h3>
          <p>{d.pricing.customDesc}</p>
        </div>
        <a href={route(lang, "contact")} className="text-link">
          {d.ui.quote}
          <Arrow />
        </a>
      </div>
      <div className="faq">
        <h2>{d.pricing.faqTitle}</h2>
        <div>
          {d.pricing.faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
function Builder({
  lang,
  d,
  singles,
  boxes,
}: {
  lang: Language;
  d: Dictionary;
  singles: PricingItem[];
  boxes: PricingItem[];
}) {
  const [chosen, setChosen] = useState<string[]>([]),
    [box, setBox] = useState<string | null>(null),
    [copyState, setCopyState] = useState(""),
    [expanded, setExpanded] = useState(true);
  const selected = [
    ...singles.filter((item) => chosen.includes(item.id)),
    ...boxes.filter((item) => item.id === box),
  ];
  const total = selected.reduce((sum, item) => sum + item.price, 0);
  const selection = selected.map(
    (item) => `${pricingTitle(item, lang)} — ${money(item.price, lang)}`,
  );
  const brief = `${d.pricing.copyPrefix}\n\n${selection.join("\n")}\n\n${d.pricing.copyPrice}: ${money(total, lang)}\n${d.pricing.condition}`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState("ok");
    } catch {
      setCopyState("error");
    }
  }
  return (
    <details
      className="pricing-builder"
      aria-labelledby="builder-title"
      open={expanded}
      onToggle={(event) => {
        if (event.currentTarget.open !== expanded)
          setExpanded(event.currentTarget.open);
      }}
    >
      <summary
        className="pricing-builder-toggle"
        aria-controls="builder-content"
        aria-expanded={expanded}
      >
        <span className="pricing-builder-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="4.5" y="3" width="15" height="18" rx="2.5" />
            <path d="M8 7h8M8 11h1m3 0h1m3 0h1M8 15h1m3 0h1m3 0h1M8 18h1m3 0h1" />
          </svg>
        </span>
        <span className="pricing-builder-heading">
          <span className="pricing-builder-title" id="builder-title" role="heading" aria-level={2}>
            {d.pricing.builder}
          </span>
          <span className="pricing-builder-description">{d.pricing.builderDesc}</span>
        </span>
        <span className="pricing-builder-meta">
          <span className="pricing-builder-quick-total">
            {d.pricing.total}: {money(total, lang)}
          </span>
          <svg className="pricing-builder-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="pricing-builder-content" id="builder-content">
        <div className="pricing-builder-options">
          <p className="eyebrow">SKO / {d.pricing.selection}</p>
        {singles.length > 0 && (
          <fieldset>
            <legend>{d.pricing.singles}</legend>
            {singles.map((item) => (
              <label className="builder-choice" key={item.id}>
                <input
                  type="checkbox"
                  checked={chosen.includes(item.id)}
                  onChange={() => {
                    setChosen((current) =>
                      current.includes(item.id)
                        ? current.filter((id) => id !== item.id)
                        : [...current, item.id],
                    );
                    setCopyState("");
                  }}
                />
                <span>{pricingTitle(item, lang)}</span>
                <strong>{money(item.price, lang)}</strong>
              </label>
            ))}
          </fieldset>
        )}
        {boxes.length > 0 && (
          <fieldset>
            <legend>{d.pricing.boxes}</legend>
            {boxes.map((item) => (
              <label className="builder-choice" key={item.id}>
                <input
                  type="checkbox"
                  checked={box === item.id}
                  onChange={() => {
                    setBox(box === item.id ? null : item.id);
                    setCopyState("");
                  }}
                />
                <span>{pricingTitle(item, lang)}</span>
                <strong>{money(item.price, lang)}</strong>
              </label>
            ))}
          </fieldset>
        )}
        </div>
      <div className="builder-summary">
        <div className="builder-summary-top">
          <span className="eyebrow">{d.pricing.selection}</span>
          <Arrow />
        </div>
        <div className="builder-selection">
          {selection.length ? (
            <ul>
              {selection.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{d.pricing.noSelection}</p>
          )}
        </div>
        <div className="builder-total" aria-live="polite">
          <span>{d.pricing.total}</span>
          <strong>{money(total, lang)}</strong>
        </div>
        <button className="button" disabled={!selection.length} onClick={copy}>
          {copyState === "ok" ? d.ui.copied : d.ui.copy}
          <Arrow />
        </button>
        <div role="status">
          {copyState === "ok" && <p className="copy-status">✓ {d.ui.copied}</p>}
          {copyState === "error" && (
            <>
              <p>{d.ui.copyError}</p>
              <pre className="copy-fallback">{brief}</pre>
            </>
          )}
        </div>
        <a
          className="button button-outline"
          href={discord}
          target="_blank"
          rel="noopener noreferrer"
        >
          {d.ui.order}
          <Arrow />
        </a>
        <small>{d.pricing.builderNote}</small>
      </div>
      </div>
    </details>
  );
}
