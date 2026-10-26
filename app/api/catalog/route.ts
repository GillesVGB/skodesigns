import { readCatalog, readPricing } from "@/lib/catalog-server";
export const revalidate = 3600;

export async function GET() {
  try {
    const [portfolio, pricing] = await Promise.all([
      readCatalog(),
      readPricing(),
    ]);
    return Response.json(
      { portfolio, pricing },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=3600, stale-while-revalidate=60",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
