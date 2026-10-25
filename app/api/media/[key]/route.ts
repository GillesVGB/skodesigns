import { env } from "cloudflare:workers";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const path = new URL(request.url).pathname;
  const key = path.split("/").filter(Boolean).at(-1) || "";
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(key) || !env.DB || !env.BUCKET)
    return new Response(null, { status: 404 });
  const live = await env.DB.prepare(
    "SELECT id FROM portfolio_items WHERE image = ? AND deleted_at IS NULL UNION ALL SELECT id FROM store_items WHERE image = ? AND deleted_at IS NULL LIMIT 1",
  )
    .bind(path, path)
    .first();
  if (!live) return new Response(null, { status: 404 });
  const object = await env.BUCKET.get(key);
  if (!object) return new Response(null, { status: 404 });
  return new Response(object.body, {
    headers: {
      "Content-Type":
        object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=60",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
