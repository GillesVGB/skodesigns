import { discord, route, type Dictionary, type Language } from "@/lib/content";
import { referenceCopy } from "@/lib/reference-copy";
import "@/app/reference-sections.css";

type Props = { lang: Language; d: Dictionary };

function SmallArrow() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M7 17 17 7M7 7h10v10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="reference-heading">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export function ReferenceAbout({ lang, d }: Props) {
  const copy = referenceCopy[lang];
  return (
    <section className="reference-section reference-team container" id="team">
      <SectionHeading title={copy.teamTitle} subtitle={copy.teamSubtitle} />
      <article className="reference-card reference-team-card">
        <img
          className="reference-team-avatar"
          src="/assets/skodax-still.webp"
          alt="Skodax"
          width="40"
          height="40"
          loading="lazy"
        />
        <div className="reference-team-name">
          <h3>Skodax</h3>
          <p>{d.about.role}</p>
        </div>
        <p className="reference-team-bio">{d.about.bio}</p>
        <a
          className="reference-link reference-team-link"
          href={route(lang, "about")}
        >
          {d.ui.more}
          <SmallArrow />
        </a>
      </article>
    </section>
  );
}

const serviceOrder = [0, 3, 4, 2];

function ServiceCard({ lang, d, index }: Props & { index: number }) {
  const [title, description] = d.services.items[index];
  const artwork =
    index === 0
      ? "recent-05.webp"
      : index === 3
        ? "recent-02.webp"
        : index === 4
          ? "sko-v3-still.webp"
          : null;
  const href = artwork
    ? route(lang, "portfolio") +
      "?category=" +
      (index === 0 ? "logos" : index === 3 ? "thumbnails" : "motion")
    : route(lang, "contact");
  return (
    <article
      className={`reference-card reference-service-card reference-service-${index}`}
    >
      <div className="reference-service-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {artwork && (
        <a
          className="reference-service-art"
          href={href}
          aria-label={`${d.services.cta}: ${title}`}
        >
          <img
            src={"/assets/" + artwork}
            alt={`${title} — Sko Designs`}
            width={index === 0 ? 1024 : index === 3 ? 1280 : 640}
            height={index === 0 ? 1024 : index === 3 ? 720 : 640}
            loading="lazy"
          />
        </a>
      )}
      <a className="reference-link" href={href}>
        {artwork ? d.services.cta : d.ui.quote}
        <SmallArrow />
      </a>
    </article>
  );
}

export function ReferenceServices({ lang, d }: Props) {
  const copy = referenceCopy[lang];
  const [bannerTitle, bannerDescription] = d.services.items[1];
  const [emojiTitle, emojiDescription] = d.services.items[5];
  return (
    <section
      className="reference-section reference-services container"
      id="services"
    >
      <SectionHeading
        title={copy.servicesTitle}
        subtitle={copy.servicesSubtitle}
      />
      <div className="reference-service-wall">
        <article className="reference-card reference-service-card reference-banner-card">
          <div className="reference-service-copy">
            <h3>{bannerTitle}</h3>
            <p>{bannerDescription}</p>
          </div>
          <a
            className="reference-banner-art"
            href={route(lang, "portfolio") + "?category=banners"}
            aria-label={`${d.services.cta}: ${bannerTitle}`}
          >
            <img
              src="/assets/recent-04.webp"
              alt="Voltrix"
              width="1584"
              height="396"
              loading="lazy"
            />
          </a>
          <a
            className="reference-link"
            href={route(lang, "portfolio") + "?category=banners"}
          >
            {d.services.cta}
            <SmallArrow />
          </a>
        </article>
        {serviceOrder.map((index) => (
          <ServiceCard key={index} lang={lang} d={d} index={index} />
        ))}
        <article className="reference-card reference-service-card reference-emoji-card">
          <div className="reference-service-copy">
            <h3>{emojiTitle}</h3>
            <p>{emojiDescription}</p>
          </div>
          <a className="reference-link" href={route(lang, "contact")}>
            {d.ui.quote}
            <SmallArrow />
          </a>
        </article>
      </div>
    </section>
  );
}

export function ReferenceContact({ lang, d }: Props) {
  const copy = referenceCopy[lang];
  return (
    <section className="reference-contact-section container" id="contact">
      <div className="reference-card reference-contact-card">
        <h2>{copy.contactTitle}</h2>
        <p>{copy.contactDescription}</p>
        <a
          className="button reference-contact-button"
          href={discord}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${d.ui.contact} (${d.ui.newTab})`}
        >
          {d.ui.contact}
          <SmallArrow />
        </a>
      </div>
    </section>
  );
}
