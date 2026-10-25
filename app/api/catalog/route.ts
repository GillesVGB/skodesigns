import { readCatalog, readPricing } from "@/lib/catalog-server";
import { json } from "@/lib/staff-auth";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const [portfolio, pricing] = await Promise.all([
      readCatalog(),
      readPricing(),
    ]);
    return json({ portfolio, pricing });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
