import { env } from "@/lib/platform";
import { publicOrigin } from "@/lib/staff-auth";
import { revalidatePublicReviews } from "@/lib/public-cache";

export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const reply = (
  body: unknown,
  status = 200,
  extra: Record<string, string> = {},
) => Response.json(body, { status, headers: { ...headers, ...extra } });

export async function GET() {
  if (!env.DB) return reply({ error: "unavailable" }, 503);
  try {
    const result = await env.DB.prepare(
      "SELECT id, name, rating, body, language, created_at AS createdAt FROM reviews ORDER BY created_at DESC, id DESC LIMIT 50",
    ).all();
    return reply({ reviews: result.results }, 200, {
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60",
    });
  } catch {
    return reply({ error: "unavailable" }, 503);
  }
}

export async function POST(request: Request) {
  if (!env.DB) return reply({ error: "unavailable" }, 503);
  const origin = request.headers.get("Origin");
  if (!origin || origin !== publicOrigin(request))
    return reply({ error: "forbidden" }, 403);
  if (
    !request.headers
      .get("Content-Type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return reply({ error: "invalid" }, 415);
  if (Number(request.headers.get("Content-Length")) > 8000)
    return reply({ error: "tooLarge" }, 413);
  let payload: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "invalid" }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 8000) {
        await reader.cancel();
        return reply({ error: "tooLarge" }, 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    payload = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(bytes),
    );
  } catch {
    return reply({ error: "invalid" }, 400);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    return reply({ error: "invalid" }, 400);
  const input = payload as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const body = typeof input.body === "string" ? input.body.trim() : "";
  const rating = input.rating;
  const language = input.language;
  if (
    input.website ||
    name.length < 2 ||
    name.length > 60 ||
    body.length < 10 ||
    body.length > 1200 ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    !["nl", "en", "fr"].includes(String(language)) ||
    input.consent !== true
  )
    return reply({ error: "invalid" }, 400);
  try {
    const now = Date.now();
    const source =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      "local-preview";
    const dailyKey = `${new Date(now).toISOString().slice(0, 10)}:sko-review:${source}`;
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(dailyKey),
    );
    const key = Array.from(new Uint8Array(digest), (v) =>
      v.toString(16).padStart(2, "0"),
    ).join("");
    const allowance = await env.DB.prepare(
      "INSERT INTO review_limits (id, next_allowed_at) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET next_allowed_at = excluded.next_allowed_at WHERE review_limits.next_allowed_at <= ? RETURNING id",
    )
      .bind(key, now + 60_000, now)
      .first();
    if (!allowance)
      return reply({ error: "rateLimited" }, 429, { "Retry-After": "60" });
    const review = {
      id: crypto.randomUUID(),
      name,
      rating,
      body,
      language: String(language) as "nl" | "en" | "fr",
      createdAt: now,
    };
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO reviews (id, name, rating, body, language, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      ).bind(review.id, name, rating, body, review.language, now),
      env.DB.prepare(
        "DELETE FROM review_limits WHERE next_allowed_at < ?",
      ).bind(now - 86_400_000),
    ]);
    revalidatePublicReviews();
    return reply({ review }, 201);
  } catch {
    return reply({ error: "unavailable" }, 503);
  }
}
