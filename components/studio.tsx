"use client";

import { useEffect, useRef, useState } from "react";
import {
  boxCounts,
  boxPrices,
  dictionaries,
  discord,
  languageNames,
  languages,
  money,
  packagePrices,
  projects,
  route,
  singlePrices,
  type Dictionary,
  type Language,
  type Page,
  type Project,
} from "@/lib/content";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Star() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none">
      <path
        d="M24 0v48M0 24h48M7 7l34 34M7 41 41 7"
        stroke="currentColor"
        strokeWidth="6"
      />
    </svg>
  );
}

function Logo({ d }: { d: Dictionary }) {
  return (
    <span className="brand-art">
      <svg
        className="wordmark"
        viewBox="595 245 795 300"
        role="img"
        aria-label={d.ui.logoAlt}
      >
        <image href="/assets/sko-banner.webp" width="1983" height="793" />
      </svg>
      <img
        className="compact-mark"
        src="/assets/sko-icon.webp"
        width="44"
        height="44"
        alt={d.ui.logoAlt}
      />
    </span>
  );
}

function LanguageSelector({
  lang,
  page,
  d,
}: {
  lang: Language;
  page: Page;
  d: Dictionary;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (details.current && !details.current.contains(e.target as Node))
        details.current.open = false;
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  return (
    <details
      className="language"
      ref={details}
      onKeyDown={(e) => {
        if (e.key === "Escape" && details.current) {
          details.current.open = false;
          details.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label={`${d.ui.language}: ${languageNames[lang]}`}>
        {lang.toUpperCase()}
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16">
          <path
            d="m4 6 4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </summary>
      <div className="language-options">
        {languages.map((l) => (
          <a
            key={l}
            href={route(l, page)}
            lang={l}
            hrefLang={l}
            aria-label={languageNames[l]}
            aria-current={l === lang ? "true" : undefined}
            onClick={(e) => {
              try {
                localStorage.setItem("sko-language", l);
              } catch {}
              document.cookie = `sko-language=${l}; Path=/; Max-Age=31536000; SameSite=Lax`;
              const params = new URLSearchParams(window.location.search);
              const filter = params.get("category");
              if (page === "portfolio" && filter && filter in d.work.filters) {
                e.currentTarget.href =
                  route(l, page) + "?category=" + encodeURIComponent(filter);
              }
            }}
          >
            <span>{languageNames[l]}</span>
            <span aria-hidden="true">{l === lang ? "✓" : l.toUpperCase()}</span>
          </a>
        ))}
      </div>
    </details>
  );
}

function Navigation({
  lang,
  page,
  d,
}: {
  lang: Language;
  page: Page;
  d: Dictionary;
}) {
  const modal = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => {
    modal.current?.close();
    setOpen(false);
    trigger.current?.focus();
  };
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth > 1120 && modal.current?.open) close();
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const links: Page[] = [
    "home",
    "portfolio",
    "services",
    "pricing",
    "about",
    "reviews",
  ];
  return (
    <>
      <a href="#main" className="skip-link">
        {d.ui.skip}
      </a>
      <header className="site-header">
        <div className="nav-wrap container">
          <a
            className="brand"
            href={route(lang)}
            aria-label={`Sko Designs — ${d.ui.home}`}
          >
            <Logo d={d} />
          </a>
          <nav className="desktop-links" aria-label={d.footer.navigation}>
            {links.map((p) => (
              <a
                key={p}
                href={route(lang, p)}
                aria-current={page === p ? "page" : undefined}
              >
                {d.nav[p]}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <div className="desktop-language">
              <LanguageSelector lang={lang} page={page} d={d} />
            </div>
            <a
              className="button button-small nav-project"
              href={route(lang, "contact")}
            >
              {d.ui.start}
              <Arrow diagonal />
            </a>
            <button
              className="menu-toggle"
              ref={trigger}
              aria-label={open ? d.ui.closeMenu : d.ui.menu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => {
                modal.current?.showModal();
                setOpen(true);
              }}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <dialog
        className="mobile-menu"
        id="mobile-menu"
        ref={modal}
        aria-label={d.footer.navigation}
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === modal.current) close();
        }}
      >
        <div className="mobile-menu-head">
          <a href={route(lang)}>
            <Logo d={d} />
          </a>
          <button
            className="icon-button"
            onClick={close}
            aria-label={d.ui.closeMenu}
          >
            ×
          </button>
        </div>
        <nav>
          {links.map((p, i) => (
            <a
              key={p}
              href={route(lang, p)}
              aria-current={page === p ? "page" : undefined}
            >
              <span className="menu-number">0{i + 1}</span>
              {d.nav[p]}
              <Arrow diagonal />
            </a>
          ))}
        </nav>
        <div className="mobile-menu-bottom">
          <LanguageSelector lang={lang} page={page} d={d} />
          <a className="button" href={route(lang, "contact")}>
            {d.ui.start}
            <Arrow diagonal />
          </a>
        </div>
      </dialog>
    </>
  );
}

function Intro({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
}) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>
        {title}
        {accent && (
          <>
            <br />
            <span className="blue">{accent}</span>
          </>
        )}
      </h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
}) {
  return (
    <div className="page-heading container">
      <p className="eyebrow">{eyebrow}</p>
      <h1>
        {title}
        {accent && (
          <>
            <br />
            <span className="blue">{accent}</span>
          </>
        )}
      </h1>
      {description && <p>{description}</p>}
      <span className="heading-star" aria-hidden="true">
        <Star />
      </span>
    </div>
  );
}

function Hero({ lang, d }: { lang: Language; d: Dictionary }) {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="blue-dot" />
          {d.hero.eyebrow}
        </p>
        <h1>
          {d.hero.line1} <br />
          {d.hero.line2} <br />
          <span>
            {d.hero.accent}
            <svg
              viewBox="0 0 450 18"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M4 12C110 0 300 0 446 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </span>
        </h1>
        <p className="hero-description">{d.hero.description}</p>
        <div className="hero-buttons">
          <a href={route(lang, "portfolio")} className="button">
            {d.ui.explore}
            <Arrow diagonal />
          </a>
          <a href={route(lang, "contact")} className="text-link">
            {d.ui.start}
            <Arrow />
          </a>
        </div>
        <p className="hero-note">
          <span aria-hidden="true">↳</span>
          {d.hero.note}
        </p>
      </div>
      <div className="hero-composition">
        <div className="art-grid" aria-hidden="true" />
        <span className="composition-cross" aria-hidden="true">
          +
        </span>
        <span className="composition-label">SKO / {d.band[1]}</span>
        <div className="hero-square">
          <img
            src="/assets/sko-icon.webp"
            width="640"
            height="640"
            alt={d.ui.logoAlt}
            fetchPriority="high"
          />
          <span className="square-caption">Sko Designs / 01</span>
        </div>
        <div className="hero-banner">
          <img
            src="/assets/sko-banner.webp"
            width="1983"
            height="793"
            alt={d.ui.logoAlt}
            fetchPriority="high"
          />
        </div>
        <div className="hero-thumbnail">
          <img
            src="/assets/your-vision.webp"
            width="1024"
            height="536"
            alt="Your Vision, Our Design"
          />
        </div>
        <div className="composition-stamp" aria-hidden="true">
          <Star />
        </div>
        <div className="composition-footer">
          <span>{d.hero.visual}</span>
          <span aria-hidden="true">↗</span>
        </div>
      </div>
      <div className="hero-bottom">
        <span>{d.hero.index}</span>
        <a href="#work">
          {d.hero.scroll}
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}

function BrandBand({ d }: { d: Dictionary }) {
  return (
    <div className="brand-band">
      <div className="container">
        {d.band.map((t) => (
          <span key={t}>
            <span className="band-star" aria-hidden="true">
              ✳
            </span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectImage({
  project,
  d,
  className = "",
  loading = "lazy",
}: {
  project: Project;
  d: Dictionary;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <img
      className={className}
      src={"/assets/" + project.image}
      alt={`${project.title} — ${d.work.filters[project.category as keyof typeof d.work.filters]}. ${d.ui.artAlt}`}
      width={project.width}
      height={project.height}
      loading={loading}
      decoding="async"
    />
  );
}

function Portfolio({
  lang,
  d,
  full = false,
}: {
  lang: Language;
  d: Dictionary;
  full?: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const [playing, setPlaying] = useState(false);
  const modal = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("category");
    if (f && f in d.work.filters) setFilter(f);
    const pop = () => {
      const v = new URLSearchParams(window.location.search).get("category");
      setFilter(v && v in d.work.filters ? v : "all");
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [d]);
  const items = full ? projects : projects.filter((p) => p.featured);
  const visible = items.filter(
    (p) => filter === "all" || p.category === filter,
  );
  const changeFilter = (f: string) => {
    setFilter(f);
    if (full) {
      const u = new URL(window.location.href);
      if (f === "all") u.searchParams.delete("category");
      else u.searchParams.set("category", f);
      window.history.pushState({}, "", u);
    }
  };
  const openProject = (p: Project, e: React.MouseEvent<HTMLButtonElement>) => {
    lastTrigger.current = e.currentTarget;
    setSelected(p);
    setPlaying(false);
    modal.current?.showModal();
  };
  const close = () => {
    modal.current?.close();
    setSelected(null);
    setPlaying(false);
    lastTrigger.current?.focus();
  };
  const step = (offset: number) => {
    if (!selected) return;
    const i = visible.findIndex((p) => p.id === selected.id);
    setSelected(visible[(i + offset + visible.length) % visible.length]);
    setPlaying(false);
  };
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [selected]);
  return (
    <section
      id="work"
      className={`portfolio-section ${full ? "full-portfolio" : "section-space"} container`}
    >
      {full && <h2 className="sr-only">{d.nav.portfolio}</h2>}
      {!full && (
        <div className="section-head">
          <Intro
            eyebrow={d.work.eyebrow}
            title={d.work.title}
            accent={d.work.accent}
            description={d.work.description}
          />
          <a href={route(lang, "portfolio")} className="text-link">
            {d.ui.allWork}
            <Arrow diagonal />
          </a>
        </div>
      )}
      {full && (
        <div className="filters" role="group" aria-label={d.nav.portfolio}>
          {Object.entries(d.work.filters)
            .filter(
              ([k]) => k === "all" || projects.some((p) => p.category === k),
            )
            .map(([k, v]) => (
              <button
                key={k}
                onClick={() => changeFilter(k)}
                aria-pressed={filter === k}
                className={filter === k ? "active" : ""}
              >
                {v}
                {filter === k && (
                  <span>{visible.length.toString().padStart(2, "0")}</span>
                )}
              </button>
            ))}
        </div>
      )}
      <div className="project-grid">
        {visible.map((p, i) => (
          <article className={`project-card project-${p.id}`} key={p.id}>
            <button
              className="project-preview"
              onClick={(e) => openProject(p, e)}
              aria-label={`${d.ui.view}: ${p.title} — ${d.work.filters[p.category as keyof typeof d.work.filters]}`}
            >
              <div className="project-image">
                <ProjectImage project={p} d={d} />
              </div>
              <span className="preview-arrow" aria-hidden="true">
                <Arrow diagonal />
              </span>
              {p.animation && (
                <span className="motion-badge" aria-hidden="true">
                  ▷
                </span>
              )}
            </button>
            <div className="project-info">
              <div>
                <h3>{p.title}</h3>
                <p>
                  {d.work.filters[p.category as keyof typeof d.work.filters]}
                </p>
              </div>
              <span className="project-number" aria-hidden="true">
                {(i + 1).toString().padStart(2, "0")}
              </span>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p>{d.work.empty}</p>}
      <dialog
        ref={modal}
        className="project-modal"
        aria-labelledby="project-title"
        aria-describedby="project-description"
        onCancel={() => {
          setSelected(null);
          setPlaying(false);
        }}
        onClick={(e) => {
          if (e.target === modal.current) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {selected && (
          <div className="modal-inner">
            <div className="modal-top">
              <div>
                <p className="eyebrow">
                  {
                    d.work.filters[
                      selected.category as keyof typeof d.work.filters
                    ]
                  }
                </p>
                <h2 id="project-title">{selected.title}</h2>
              </div>
              <button
                className="icon-button"
                autoFocus
                onClick={close}
                aria-label={d.ui.close}
              >
                ×
              </button>
            </div>
            <div
              className={`modal-art ${selected.id === "discord" ? "small-art" : ""}`}
            >
              <img
                src={
                  "/assets/" +
                  (playing && selected.animation
                    ? selected.animation
                    : selected.image)
                }
                width={selected.width}
                height={selected.height}
                alt={`${selected.title} — ${d.ui.artAlt}`}
              />
            </div>
            <div className="modal-bottom">
              <div>
                <p id="project-description">
                  {selected.animation ? d.work.motionNote : d.work.detail}
                </p>
                {selected.animation && (
                  <button
                    className="text-link"
                    onClick={() => setPlaying(!playing)}
                  >
                    {playing ? d.ui.pause : d.ui.play}
                    <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
                  </button>
                )}
              </div>
              <div className="modal-controls">
                <button
                  className="icon-button"
                  onClick={() => step(-1)}
                  aria-label={d.ui.previous}
                >
                  ←
                </button>
                <button
                  className="icon-button"
                  onClick={() => step(1)}
                  aria-label={d.ui.next}
                >
                  →
                </button>
              </div>
            </div>
            <a
              className="text-link modal-project-link"
              href={route(lang, "contact")}
            >
              {d.work.inquiry}
              <Arrow diagonal />
            </a>
          </div>
        )}
      </dialog>
    </section>
  );
}

const serviceAssets = [
  "sko-icon.webp",
  "sko-banner.webp",
  null,
  null,
  "sko-v3-still.webp",
  null,
];
const serviceCategories = [
  "logos",
  "banners",
  "mockups",
  "thumbnails",
  "motion",
  "discord",
];
function Services({
  lang,
  d,
  full = false,
}: {
  lang: Language;
  d: Dictionary;
  full?: boolean;
}) {
  return (
    <>
      <section
        className={`services-section section-space ${full ? "services-full" : ""}`}
      >
        <div className="container services-layout">
          {full && <h2 className="sr-only">{d.nav.services}</h2>}
          {!full ? (
            <div className="services-intro">
              <Intro
                eyebrow={d.services.eyebrow}
                title={d.services.title}
                accent={d.services.accent}
                description={d.services.description}
              />
              <a className="text-link" href={route(lang, "services")}>
                {d.ui.discover}
                <Arrow diagonal />
              </a>
              <div className="services-art" aria-hidden="true">
                <img
                  src="/assets/sko-white-still.webp"
                  width="793"
                  height="317"
                  loading="lazy"
                  alt=""
                />
              </div>
            </div>
          ) : null}
          <div className="service-list">
            {d.services.items.map(([title, description], i) => (
              <article className="service-row" key={title}>
                <span className="service-number">0{i + 1}</span>
                <div className="service-text">
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <a
                    href={
                      serviceAssets[i]
                        ? route(lang, "portfolio") +
                          "?category=" +
                          serviceCategories[i]
                        : route(lang, "contact")
                    }
                    className="text-link"
                  >
                    {serviceAssets[i] ? d.services.cta : d.ui.quote}
                    <Arrow diagonal />
                  </a>
                </div>
                {serviceAssets[i] && (
                  <a
                    href={
                      route(lang, "portfolio") +
                      "?category=" +
                      serviceCategories[i]
                    }
                    className="service-image"
                    aria-label={`${d.services.cta}: ${title}`}
                  >
                    <img
                      src={"/assets/" + serviceAssets[i]}
                      alt={title}
                      width="220"
                      height="160"
                      loading="lazy"
                    />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      {full && <Process d={d} />}
    </>
  );
}
function Process({ d }: { d: Dictionary }) {
  return (
    <section className="process-section section-space container">
      <h2>{d.services.processTitle}</h2>
      <div className="process-grid">
        {d.services.steps.map(([title, description], i) => (
          <div key={title}>
            <span className="process-number">
              0{i + 1}
              <Arrow diagonal />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function About({
  lang,
  d,
  full = false,
}: {
  lang: Language;
  d: Dictionary;
  full?: boolean;
}) {
  return (
    <>
      <section className="about-section section-space container">
        <div className="about-art">
          <img
            src="/assets/sko-icon.webp"
            width="640"
            height="640"
            loading="lazy"
            alt={d.ui.logoAlt}
          />
          <div className="about-art-caption">
            <span>SKO DESIGNS</span>
            <span>{d.band[0]}</span>
          </div>
        </div>
        <div className="about-copy">
          {!full && (
            <Intro
              eyebrow={d.about.eyebrow}
              title={d.about.title}
              accent={d.about.accent}
            />
          )}
          <p className="lead">{d.about.description}</p>
          <p>{d.about.detail}</p>
          <div className="founder">
            <img
              src="/assets/skodax-still.webp"
              alt="Skodax"
              width="54"
              height="54"
              loading="lazy"
            />
            <div>
              <strong>Skodax</strong>
              <span>{d.about.role}</span>
            </div>
            <Arrow diagonal />
          </div>
          {full ? (
            <p>{d.about.bio}</p>
          ) : (
            <a className="text-link" href={route(lang, "about")}>
              {d.ui.more}
              <Arrow diagonal />
            </a>
          )}
        </div>
      </section>
      {full && (
        <section className="values-section container">
          <h2>{d.about.signature}</h2>
          <div className="process-grid">
            {d.about.values.map(([title, text], i) => (
              <div key={title}>
                <span className="eyebrow blue">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Reviews({
  lang,
  d,
  full = false,
}: {
  lang: Language;
  d: Dictionary;
  full?: boolean;
}) {
  const reviewItems = full
    ? d.reviews.items
    : [d.reviews.items[1], d.reviews.items[2], d.reviews.items[9]];
  return (
    <section className="reviews-section section-space">
      <div className="container">
        {!full && (
          <div className="section-head">
            <Intro
              eyebrow={d.reviews.eyebrow}
              title={d.reviews.title}
              accent={d.reviews.accent}
            />
            <a className="text-link" href={route(lang, "reviews")}>
              {d.reviews.all}
              <Arrow diagonal />
            </a>
          </div>
        )}
        <div className="review-grid">
          {reviewItems.map(([name, text]) => (
            <figure className="review" key={name}>
              <div className="review-stars" role="img" aria-label={d.ui.stars}>
                ★★★★★
              </div>
              <blockquote>{text}</blockquote>
              <figcaption>
                <span className="review-avatar" aria-hidden="true">
                  {name[0]}
                </span>
                <span>
                  <strong>{name}</strong>
                  <small>{d.reviews.source}</small>
                </span>
                <span className="quote-mark" aria-hidden="true">
                  ”
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        {full && <p className="review-source">{d.reviews.description}</p>}
      </div>
    </section>
  );
}

function Pricing({
  lang,
  d,
  full = false,
}: {
  lang: Language;
  d: Dictionary;
  full?: boolean;
}) {
  return (
    <section className="pricing-section section-space container">
      {full && <h2 className="sr-only">{d.nav.pricing}</h2>}
      {!full && (
        <div className="section-head">
          <Intro
            eyebrow={d.pricing.eyebrow}
            title={d.pricing.title}
            accent={d.pricing.accent}
            description={d.pricing.description}
          />
          <a className="text-link" href={route(lang, "pricing")}>
            {d.nav.pricing}
            <Arrow diagonal />
          </a>
        </div>
      )}
      <div className="package-grid">
        {d.pricing.packages.map((entry, i) => {
          const [name, description, features] = entry as [
            string,
            string,
            string[],
          ];
          return (
            <article
              className={`package ${i === 1 ? "package-featured" : ""}`}
              key={name}
            >
              <div className="package-heading">
                <span className="eyebrow">0{i + 1}</span>
                {i === 1 && (
                  <span className="popular">{d.pricing.popular}</span>
                )}
              </div>
              <h3>{name}</h3>
              <p>{description}</p>
              <div className="package-price">
                <small>{d.ui.from}</small>
                <strong>{money(packagePrices[i], lang)}</strong>
              </div>
              <ul>
                {features.map((f) => (
                  <li key={f}>
                    <span aria-hidden="true">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={discord}
                target="_blank"
                rel="noopener noreferrer"
                className={`button ${i === 1 ? "button-white" : "button-outline"}`}
                aria-label={`${d.ui.order}: ${name} (${d.ui.newTab})`}
              >
                {d.ui.order}
                <Arrow diagonal />
              </a>
            </article>
          );
        })}
      </div>
      <p className="price-condition">{d.pricing.condition}</p>
      {full && (
        <>
          <div className="price-tables">
            <div>
              <h2>{d.pricing.singles}</h2>
              {d.pricing.singleNames.map((name, i) => (
                <div className="price-row" key={name}>
                  <span>{name}</span>
                  <strong>{money(singlePrices[i], lang)}</strong>
                </div>
              ))}
            </div>
            <div>
              <h2>{d.pricing.boxes}</h2>
              {boxCounts.map((n, i) => (
                <div className="price-row" key={n}>
                  <span>
                    {n} {n === 1 ? d.pricing.boxUnit : d.pricing.boxUnits}
                  </span>
                  <strong>{money(boxPrices[i], lang)}</strong>
                </div>
              ))}
            </div>
          </div>
          <PackageBuilder lang={lang} d={d} />
          <div className="custom-quote">
            <div>
              <h3>{d.pricing.custom}</h3>
              <p>{d.pricing.customDesc}</p>
            </div>
            <a href={route(lang, "contact")} className="text-link">
              {d.ui.quote}
              <Arrow diagonal />
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
        </>
      )}
    </section>
  );
}

function PackageBuilder({ lang, d }: { lang: Language; d: Dictionary }) {
  const [chosen, setChosen] = useState<number[]>([]);
  const [box, setBox] = useState(-1);
  const [copyState, setCopyState] = useState("");
  const total =
    chosen.reduce((t, i) => t + singlePrices[i], 0) +
    (box >= 0 ? boxPrices[box] : 0);
  const selection = [
    ...chosen.map(
      (i) => `${d.pricing.singleNames[i]} — ${money(singlePrices[i], lang)}`,
    ),
    ...(box >= 0
      ? [
          `${boxCounts[box]} ${boxCounts[box] === 1 ? d.pricing.boxUnit : d.pricing.boxUnits} — ${money(boxPrices[box], lang)}`,
        ]
      : []),
  ];
  const brief = `${d.pricing.copyPrefix}\n\n${selection.join("\n")}\n\n${d.pricing.copyPrice}: ${money(total, lang)}\n${d.pricing.condition}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState("ok");
    } catch {
      setCopyState("error");
    }
  };
  return (
    <section className="package-builder" aria-labelledby="builder-title">
      <div>
        <p className="eyebrow">SKO / {d.pricing.selection}</p>
        <h2 id="builder-title">{d.pricing.builder}</h2>
        <p>{d.pricing.builderDesc}</p>
        <fieldset>
          <legend>{d.pricing.singles}</legend>
          {d.pricing.singleNames.map((n, i) => (
            <label className="builder-choice" key={n}>
              <input
                type="checkbox"
                checked={chosen.includes(i)}
                onChange={() => {
                  setChosen((v) =>
                    v.includes(i) ? v.filter((x) => x !== i) : [...v, i],
                  );
                  setCopyState("");
                }}
              />
              <span>{n}</span>
              <strong>{money(singlePrices[i], lang)}</strong>
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>{d.pricing.boxes}</legend>
          {boxCounts.map((n, i) => (
            <label key={n} className="builder-choice">
              <input
                type="checkbox"
                checked={box === i}
                onChange={() => {
                  setBox(box === i ? -1 : i);
                  setCopyState("");
                }}
              />
              <span>
                {n} {n === 1 ? d.pricing.boxUnit : d.pricing.boxUnits}
              </span>
              <strong>{money(boxPrices[i], lang)}</strong>
            </label>
          ))}
        </fieldset>
      </div>
      <div className="builder-summary">
        <div className="builder-summary-top">
          <span className="eyebrow">{d.pricing.selection}</span>
          <Arrow diagonal />
        </div>
        <div className="builder-selection">
          {selection.length ? (
            <ul>
              {selection.map((s) => (
                <li key={s}>{s}</li>
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
          <Arrow diagonal />
        </a>
        <small>{d.pricing.builderNote}</small>
      </div>
    </section>
  );
}

function Contact({ lang, d }: { lang: Language; d: Dictionary }) {
  return (
    <section className="contact-section container">
      <div className="discord-panel">
        <img
          src="/assets/sko-icon.webp"
          alt={d.ui.logoAlt}
          width="82"
          height="82"
        />
        <h2>{d.contact.discord}</h2>
        <p>{d.contact.discordDesc}</p>
        <a
          className="button button-white"
          href={discord}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${d.contact.button} (${d.ui.newTab})`}
        >
          {d.contact.button}
          <Arrow diagonal />
        </a>
        <small>{d.contact.hint}</small>
      </div>
      <div className="contact-brief">
        <h2>{d.contact.briefTitle}</h2>
        <p>{d.contact.briefDesc}</p>
        <ol>
          {d.contact.briefs.map((text, i) => (
            <li key={text}>
              <span>0{i + 1}</span>
              {text}
            </li>
          ))}
        </ol>
        <a className="text-link" href={route(lang, "pricing")}>
          {d.contact.pricingLink}
          <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}

function Footer({
  lang,
  page,
  d,
}: {
  lang: Language;
  page: Page;
  d: Dictionary;
}) {
  return (
    <>
      <section className="final-cta">
        <div className="container">
          <div>
            <p className="eyebrow">{d.contact.eyebrow}</p>
            <h2>
              {d.contact.title}
              <br />
              <span>{d.contact.accent}</span>
            </h2>
          </div>
          <a
            href={page === "contact" ? discord : route(lang, "contact")}
            className="cta-circle"
            aria-label={page === "contact" ? d.contact.button : d.ui.start}
          >
            <Arrow diagonal />
          </a>
          <p>{d.contact.mini}</p>
        </div>
      </section>
      <footer className="site-footer container">
        <div className="footer-main">
          <div className="footer-brand">
            <a href={route(lang)} aria-label={`Sko Designs — ${d.ui.home}`}>
              <Logo d={d} />
            </a>
            <p>{d.footer.description}</p>
          </div>
          <div>
            <h3>{d.footer.navigation}</h3>
            <div className="footer-links">
              {(
                [
                  "portfolio",
                  "services",
                  "pricing",
                  "about",
                  "reviews",
                  "contact",
                ] as Page[]
              ).map((p) => (
                <a key={p} href={route(lang, p)}>
                  {d.nav[p]}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-connect">
            <h3>{d.footer.connect}</h3>
            <a
              className="text-link"
              href={discord}
              target="_blank"
              rel="noopener noreferrer"
            >
              {d.footer.social}
              <Arrow diagonal />
            </a>
            <p className="footer-language-label">{d.footer.language}</p>
            <div className="footer-languages">
              {languages.map((l) => (
                <a
                  key={l}
                  lang={l}
                  hrefLang={l}
                  href={route(l, page)}
                  aria-current={l === lang ? "true" : undefined}
                >
                  {l.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Sko Designs. {d.footer.copyright}
          </span>
          <a href={route(lang, "privacy")}>{d.nav.privacy}</a>
          <span>{d.footer.credit}</span>
          <a href="#main" aria-label={d.ui.home}>
            ↑
          </a>
        </div>
      </footer>
    </>
  );
}

export default function Studio({ lang, page }: { lang: Language; page: Page }) {
  const d = dictionaries[lang];
  useEffect(() => {
    document.documentElement.dataset.skoReady = "true";
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("sko-language", lang);
    } catch {}
    document.cookie = `sko-language=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [lang]);
  return (
    <>
      <Navigation lang={lang} page={page} d={d} />
      <main id="main" tabIndex={-1}>
        {page === "home" && (
          <>
            <Hero lang={lang} d={d} />
            <BrandBand d={d} />
            <Portfolio lang={lang} d={d} />
            <Services lang={lang} d={d} />
            <About lang={lang} d={d} />
            <Reviews lang={lang} d={d} />
            <Pricing lang={lang} d={d} />
          </>
        )}
        {page === "portfolio" && (
          <>
            <PageHeading
              eyebrow={d.work.eyebrow}
              title={d.work.pageTitle}
              description={d.work.pageDescription}
            />
            <Portfolio lang={lang} d={d} full />
          </>
        )}
        {page === "services" && (
          <>
            <PageHeading
              eyebrow={d.services.eyebrow}
              title={d.services.title}
              accent={d.services.accent}
              description={d.services.description}
            />
            <Services lang={lang} d={d} full />
          </>
        )}
        {page === "pricing" && (
          <>
            <PageHeading
              eyebrow={d.pricing.eyebrow}
              title={d.pricing.title}
              accent={d.pricing.accent}
              description={d.pricing.description}
            />
            <Pricing lang={lang} d={d} full />
          </>
        )}
        {page === "about" && (
          <>
            <PageHeading
              eyebrow={d.about.eyebrow}
              title={d.about.title}
              accent={d.about.accent}
            />
            <About lang={lang} d={d} full />
            <Process d={d} />
          </>
        )}
        {page === "reviews" && (
          <>
            <PageHeading
              eyebrow={d.reviews.eyebrow}
              title={d.reviews.title}
              accent={d.reviews.accent}
            />
            <Reviews lang={lang} d={d} full />
          </>
        )}
        {page === "contact" && (
          <>
            <PageHeading
              eyebrow={d.contact.eyebrow}
              title={d.contact.title}
              accent={d.contact.accent}
              description={d.contact.description}
            />
            <Contact lang={lang} d={d} />
            <Process d={d} />
          </>
        )}
        {page === "privacy" && (
          <>
            <PageHeading
              eyebrow="SKO DESIGNS"
              title={d.privacy.title}
              description={d.privacy.intro}
            />
            <article className="privacy-copy container">
              {d.privacy.sections.map(([title, text]) => (
                <section key={title}>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </section>
              ))}
              <a className="text-link" href={discord}>
                {d.ui.contact}
                <Arrow diagonal />
              </a>
            </article>
          </>
        )}
      </main>
      <Footer lang={lang} page={page} d={d} />
    </>
  );
}
