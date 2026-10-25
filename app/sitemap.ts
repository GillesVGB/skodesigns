import type { MetadataRoute } from "next";
import { canonicalOrigin, languages, pages, route } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return languages.flatMap((lang) =>
    pages.map((page) => ({
      url: canonicalOrigin + route(lang, page),
      alternates: {
        languages: Object.fromEntries(
          languages.map((l) => [l, canonicalOrigin + route(l, page)]),
        ),
      },
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : page === "portfolio" ? 0.9 : 0.7,
    })),
  );
}
