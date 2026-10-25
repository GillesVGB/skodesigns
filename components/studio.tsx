"use client";

import { useEffect, useRef, useState } from "react";
import ProjectPlanner from "./project-planner";
import Admin from "./admin";
import ManagedPricing from "./managed-pricing";
import { basePricing, type PricingItem } from "@/lib/pricing-catalog";
import PublicReviews from "./public-reviews";
import {
  ReferenceAbout,
  ReferenceServices,
  ReferenceContact,
} from "./reference-sections";
import {
  dictionaries,
  discord,
  languageNames,
  languages,
  money,
  projects,
  route,
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
      <img
        className="wordmark"
        src="/assets/sko-logo-transparent.png"
        width="2083"
        height="755"
        alt={d.ui.logoAlt}
      />
      <span className="wordmark-contrast" aria-hidden="true" />
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
function DiscordIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M19.7 5.3a18 18 0 0 0-4.4-1.4l-.5 1a16 16 0 0 0-5.6 0l-.5-1a18 18 0 0 0-4.4 1.4C1.5 9.5.8 13.6 1.2 17.7a18 18 0 0 0 5.4 2.7l1.1-1.8-1.7-.9.4-.3a13 13 0 0 0 11.2 0l.4.3-1.7.9 1.1 1.8a18 18 0 0 0 5.4-2.7c.5-4.8-.8-8.9-3.1-12.4ZM8.5 14.9c-1.1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Zm7 0c-1.1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2Z" />
    </svg>
  );
}
function ThemeToggle({ d }: { d: Dictionary }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem("sko-theme") === "dark";
    } catch {}
    setDark(saved);
    document.documentElement.dataset.theme = saved ? "dark" : "light";
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("sko-theme", next ? "dark" : "light");
    } catch {}
  };
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? d.ui.lightTheme : d.ui.darkTheme}
      aria-pressed={dark}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
          </>
        ) : (
          <path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5 8.5 8.5 0 1 0 20.5 13.2Z" />
        )}
      </svg>
    </button>
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
    "planner",
    "about",
    "reviews",
  ];
  const primaryLinks: Page[] = ["home", "portfolio", "pricing", "planner"];
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
            {primaryLinks.map((p) => (
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
            <ThemeToggle d={d} />
            <a
              className="nav-discord"
              href={discord}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${d.footer.social} (${d.ui.newTab})`}
            >
              <DiscordIcon />
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
            <br /> <span className="blue">{accent}</span>
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
            <br /> <span className="blue">{accent}</span>
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
    <section className="hero container reference-hero">
      <div className="hero-copy">
        <p className="eyebrow hero-badge">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M12 3a9 9 0 1 0 0 18h1.2a2.3 2.3 0 0 0 2-3.4 1.2 1.2 0 0 1 1-1.8H18a3 3 0 0 0 3-3C21 7.4 16.8 3 12 3Z" />
            <circle cx="7.5" cy="10" r=".8" />
            <circle cx="11" cy="7" r=".8" />
            <circle cx="15.5" cy="8.5" r=".8" />
            <circle cx="7.5" cy="14" r=".8" />
          </svg>
          {d.hero.eyebrow}
        </p>
        <h1>
          {d.hero.line1} <span>{d.hero.accent}</span>
        </h1>
        <p className="hero-description">{d.hero.description}</p>
        <div className="hero-buttons">
          <a
            href={discord}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
            aria-label={`${d.ui.contact} (${d.ui.newTab})`}
          >
            {d.ui.contact}
            <Arrow diagonal />
          </a>
          <a
            className="text-link hero-planner-link"
            href={route(lang, "planner")}
          >
            {d.nav.planner}
            <Arrow diagonal />
          </a>
        </div>
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
      src={
        project.image.startsWith("/")
          ? project.image
          : "/assets/" + project.image
      }
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
  catalog = projects,
}: {
  lang: Language;
  d: Dictionary;
  full?: boolean;
  catalog?: Project[];
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
  const items = full ? catalog : catalog.filter((p) => p.featured).slice(0, 6);
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
              ([k]) => k === "all" || catalog.some((p) => p.category === k),
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
  "recent-05.webp",
  "recent-04.webp",
  null,
  "recent-02.webp",
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
  full = false,
}: {
  lang: Language;
  d: Dictionary;
  full?: boolean;
}) {
  return <PublicReviews lang={lang} full={full} />;
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
                  "planner",
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
          <a href={route(lang, "admin")}>{d.nav.admin}</a>
          <span>{d.footer.credit}</span>
          <a
            className="footer-credit"
            href="https://discord.com/users/960090714950225970"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`By Gilles — Discord (${d.ui.newTab})`}
          >
            <img
              src="/assets/gilles-discord-avatar.webp"
              alt=""
              width="26"
              height="26"
              loading="lazy"
            />
            <span>
              By <strong>Gilles</strong>
            </span>
          </a>
          <a href="#main" aria-label={d.ui.home}>
            ↑
          </a>
        </div>
      </footer>
    </>
  );
}

export default function Studio({
  lang,
  page,
  catalog = projects,
  pricing = basePricing(),
}: {
  lang: Language;
  page: Page;
  catalog?: Project[];
  pricing?: PricingItem[];
}) {
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
      <main id="main" className={`page-content page-${page}`} tabIndex={-1}>
        {page === "home" && (
          <>
            <Hero lang={lang} d={d} />
            <Portfolio lang={lang} d={d} catalog={catalog} />
            <ReferenceAbout lang={lang} d={d} />
            <PublicReviews lang={lang} />
            <ReferenceServices lang={lang} d={d} />
            <ReferenceContact lang={lang} d={d} />
          </>
        )}
        {page === "portfolio" && (
          <>
            <PageHeading
              eyebrow={d.work.eyebrow}
              title={d.work.pageTitle}
              description={d.work.pageDescription}
            />
            <Portfolio lang={lang} d={d} full catalog={catalog} />
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
            <ManagedPricing lang={lang} d={d} items={pricing} />
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

        {page === "planner" && <ProjectPlanner lang={lang} pricing={pricing} />}
        {page === "admin" && <Admin lang={lang} />}

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
