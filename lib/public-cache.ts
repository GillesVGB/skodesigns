import { revalidatePath } from "next/cache";
import { languages, route } from "@/lib/content";

export function revalidatePublicCatalog() {
  for (const lang of languages) {
    revalidatePath(route(lang));
    revalidatePath(route(lang, "portfolio"));
  }
  revalidatePath("/api/catalog/");
}

export function revalidatePublicPricing() {
  for (const lang of languages) {
    revalidatePath(route(lang, "pricing"));
    revalidatePath(route(lang, "planner"));
  }
  revalidatePath("/api/catalog/");
}

export function revalidatePublicReviews() {
  for (const lang of languages) {
    revalidatePath(route(lang));
    revalidatePath(route(lang, "reviews"));
  }
  revalidatePath("/api/reviews/");
}
