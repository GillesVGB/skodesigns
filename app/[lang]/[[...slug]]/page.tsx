import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Studio from "@/components/studio";
import { readCatalog, readPricing } from "@/lib/catalog-server";
import {
  canonicalOrigin,
  dictionaries,
  languages,
  pages,
  route,
  type Language,
  type Page,
} from "@/lib/content";

type Props = { params: Promise<{ lang: string; slug?: string[] }> };
async function resolve(params: Props["params"]) {
  const { lang, slug = [] } = await params;
  if (
    !languages.includes(lang as Language) ||
    slug.length > 1 ||
    (slug[0] && !pages.includes(slug[0] as Page))
  )
    notFound();
  return { lang: lang as Language, page: (slug[0] || "home") as Page };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, page } = await resolve(params);
  const [title, description] = dictionaries[lang].seo[page];
  return {
    title: `${title} | Sko Designs`,
    description,
    metadataBase: new URL(canonicalOrigin),
    robots: page === "admin" ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: route(lang, page),
      languages: {
        nl: route("nl", page),
        en: route("en", page),
        fr: route("fr", page),
        "x-default": route("en", page),
      },
    },
    openGraph: {
      title: `${title} | Sko Designs`,
      description,
      url: canonicalOrigin + route(lang, page),
      type: "website",
      siteName: "Sko Designs",
      locale: { nl: "nl_NL", en: "en_GB", fr: "fr_FR" }[lang],
      alternateLocale: languages
        .filter((l) => l !== lang)
        .map((l) => ({ nl: "nl_NL", en: "en_GB", fr: "fr_FR" })[l]),
      images: [
        {
          url: "/assets/sko-banner.webp",
          width: 1983,
          height: 793,
          alt: dictionaries[lang].ui.logoAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Sko Designs`,
      description,
      images: ["/assets/sko-banner.webp"],
    },
    icons: { icon: "/assets/sko-icon.webp", apple: "/assets/sko-icon.webp" },
  };
}
export default async function Page({ params }: Props) {
  const { lang, page } = await resolve(params);
  const catalog =
    page === "home" || page === "portfolio" ? await readCatalog() : undefined;
  const pricing =
    page === "pricing" || page === "planner" ? await readPricing() : undefined;
  return <Studio lang={lang} page={page} catalog={catalog} pricing={pricing} />;
}
