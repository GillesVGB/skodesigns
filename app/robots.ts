import type { MetadataRoute } from "next";
import { canonicalOrigin } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/nl/admin/",
        "/en/admin/",
        "/fr/admin/",
        "/api/admin/",
        "/api/auth/",
      ],
    },
    sitemap: canonicalOrigin + "/sitemap.xml",
  };
}
