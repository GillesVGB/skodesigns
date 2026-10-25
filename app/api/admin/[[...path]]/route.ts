import { env } from "@/lib/platform";
import { projects } from "@/lib/content";
import { readCatalog, readPricing } from "@/lib/catalog-server";
import { boundedBytes, imageInfo } from "@/lib/image-upload";
import {
  configured,
  cookie,
  hashToken,
  json,
  requireStaff,
  sameOrigin,
  setCookie,
} from "@/lib/staff-auth";
export const dynamic = "force-dynamic";
const parts = (r: Request) =>
  new URL(r.url).pathname.split("/").filter(Boolean).slice(2);
export async function GET(request: Request) {
  try {
    const [operation] = parts(request);
    if (operation === "session" && !configured())
      return json({ configured: false, user: null });
    const staff = await requireStaff(request);
    if (staff instanceof Response) {
      if (operation === "session" && staff.status === 401)
        return json({ configured: true, user: null });
      return staff;
    }
    if (operation === "session")
      return json({
        configured: true,
        user: { id: staff.user_id, name: staff.name, avatar: staff.avatar },
      });
    if (operation === "content") {
      const [portfolio, store, reviews] = await Promise.all([
        readCatalog(),
        readPricing(),
        env
          .DB!.prepare(
            "SELECT id,name,rating,body,language,created_at FROM reviews ORDER BY created_at DESC",
          )
          .all(),
      ]);
      return json({ portfolio, store, reviews: reviews.results });
    }
    return json({ error: "notFound" }, 404);
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);
  try {
    const [operation] = parts(request);
    if (operation === "logout") {
      const token = cookie(request, "sko-admin");
      if (env.DB && token)
        await env.DB.prepare("DELETE FROM staff_sessions WHERE id = ?")
          .bind(await hashToken(token))
          .run();
      return new Response(null, {
        status: 204,
        headers: {
          "Set-Cookie": setCookie(request, "sko-admin", "", 0),
          "Cache-Control": "no-store",
        },
      });
    }
    const staff = await requireStaff(request);
    if (staff instanceof Response) return staff;
    if (operation === "upload") {
      if (!env.BUCKET) return json({ error: "unavailable" }, 503);
      if (
        !request.headers.get("Content-Type")?.startsWith("multipart/form-data")
      )
        return json({ error: "invalid" }, 400);
      const bytes = await boundedBytes(request, 8_600_000);
      const data = await new Response(bytes, {
        headers: { "Content-Type": request.headers.get("Content-Type")! },
      }).formData();
      const file = data.get("file");
      if (!file || typeof file === "string" || file.size > 8_000_000)
        return json({ error: "tooLarge" }, 400);
      const buffer = new Uint8Array(await file.arrayBuffer());
      const info = imageInfo(buffer);
      const key = crypto.randomUUID() + "." + info.extension;
      await env.BUCKET.put(key, buffer, {
        httpMetadata: { contentType: info.mime },
      });
      return json(
        { image: `/api/media/${key}/`, width: info.width, height: info.height },
        201,
      );
    }
    if (!request.headers.get("Content-Type")?.startsWith("application/json"))
      return json({ error: "invalid" }, 400);
    const data = JSON.parse(
      new TextDecoder().decode(await boundedBytes(request, 24000)),
    ) as Record<string, unknown>;
    if (!data || typeof data !== "object" || Array.isArray(data))
      return json({ error: "invalid" }, 400);
    if (operation === "restore") {
      const id = String(data.id || "");
      if (!/^[a-zA-Z0-9-]{1,80}$/.test(id))
        return json({ error: "invalid" }, 400);
      if (data.collection === "portfolio") {
        if (projects.some((item) => item.id === id))
          await env
            .DB!.prepare("DELETE FROM hidden_projects WHERE id = ?")
            .bind(id)
            .run();
        else
          await env
            .DB!.prepare(
              "UPDATE portfolio_items SET deleted_at = NULL WHERE id = ?",
            )
            .bind(id)
            .run();
      } else if (data.collection === "store")
        await env
          .DB!.prepare("UPDATE store_items SET deleted_at = NULL WHERE id = ?")
          .bind(id)
          .run();
      else return json({ error: "invalid" }, 400);
      return new Response(null, {
        status: 204,
        headers: { "Cache-Control": "no-store" },
      });
    }
    const title = typeof data.title === "string" ? data.title.trim() : "";
    if (title.length < 2 || title.length > 120)
      return json({ error: "invalid" }, 400);
    const image = typeof data.image === "string" ? data.image : "";
    const category = String(data.category);
    const width = Number(data.width);
    const height = Number(data.height);
    if (
      image &&
      (!/^\/api\/media\/[a-f0-9-]{36}\.(png|jpg|webp)\/$/.test(image) ||
        !(await env.BUCKET?.head(image.split("/")[3])))
    )
      return json({ error: "invalidImage" }, 400);
    const id =
      operation === "store" &&
      typeof data.id === "string" &&
      /^[a-zA-Z0-9-]{1,80}$/.test(data.id)
        ? data.id
        : crypto.randomUUID();
    if (operation === "portfolio") {
      if (
        !image ||
        ![
          "logos",
          "banners",
          "thumbnails",
          "mockups",
          "discord",
          "other",
        ].includes(String(data.category)) ||
        !Number.isInteger(data.width) ||
        !Number.isInteger(data.height) ||
        Number(data.width) < 1 ||
        Number(data.height) < 1 ||
        Number(data.width) > 8192 ||
        Number(data.height) > 8192
      )
        return json({ error: "invalid" }, 400);
      await env
        .DB!.prepare(
          "INSERT INTO portfolio_items (id,title,category,image,width,height,featured,created_at) VALUES (?,?,?,?,?,?,?,?)",
        )
        .bind(
          id,
          title,
          category,
          image,
          width,
          height,
          data.featured === true ? 1 : 0,
          Date.now(),
        )
        .run();
    } else if (operation === "store") {
      const titles = ["nl", "en", "fr"].map((lang) =>
        typeof data["title_" + lang] === "string"
          ? (data["title_" + lang] as string).trim()
          : "",
      );
      const descriptions = ["nl", "en", "fr"].map((lang) =>
        typeof data["description_" + lang] === "string"
          ? (data["description_" + lang] as string).trim()
          : "",
      );
      const kind = String(data.kind);
      const price = Number(data.price);
      const quantity = kind === "box" ? Number(data.quantity) : null;
      if (
        titles.some((v) => v.length < 2 || v.length > 120) ||
        descriptions.some((v) => v.length > 2000) ||
        (kind === "package" && descriptions.some((v) => v.length < 3)) ||
        !["package", "single", "box"].includes(kind) ||
        (kind === "box" &&
          (!Number.isInteger(quantity) || quantity! < 1 || quantity! > 1000)) ||
        !Number.isInteger(data.price) ||
        Number(data.price) < 1 ||
        Number(data.price) > 1_000_000
      )
        return json({ error: "invalid" }, 400);
      await env
        .DB!.prepare(
          "INSERT INTO store_items (id,title,title_nl,title_en,title_fr,description_nl,description_en,description_fr,price,image,created_at,kind,quantity) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,title_nl=excluded.title_nl,title_en=excluded.title_en,title_fr=excluded.title_fr,description_nl=excluded.description_nl,description_en=excluded.description_en,description_fr=excluded.description_fr,price=excluded.price,kind=excluded.kind,quantity=excluded.quantity,deleted_at=NULL",
        )
        .bind(
          id,
          title,
          ...titles,
          ...descriptions,
          price,
          null,
          Date.now(),
          kind,
          quantity,
        )
        .run();
    } else return json({ error: "notFound" }, 404);
    return json({ id }, 201);
  } catch (error) {
    const invalid =
      error instanceof Error &&
      ["tooLarge", "invalidImage"].includes(error.message);
    return json(
      {
        error: invalid
          ? error.message
          : error instanceof SyntaxError
            ? "invalid"
            : "unavailable",
      },
      invalid || error instanceof SyntaxError ? 400 : 503,
    );
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);
  try {
    const staff = await requireStaff(request);
    if (staff instanceof Response) return staff;
    const [operation, id] = parts(request);
    if (!id || !/^[a-zA-Z0-9-]{1,80}$/.test(id))
      return json({ error: "invalid" }, 400);
    if (operation === "portfolio") {
      if (projects.some((p) => p.id === id))
        await env
          .DB!.prepare(
            "INSERT OR IGNORE INTO hidden_projects (id,created_at) VALUES (?,?)",
          )
          .bind(id, Date.now())
          .run();
      else
        await env
          .DB!.prepare("UPDATE portfolio_items SET deleted_at = ? WHERE id = ?")
          .bind(Date.now(), id)
          .run();
    } else if (operation === "store") {
      const item = (await readPricing()).find((item) => item.id === id);
      if (!item) return json({ error: "notFound" }, 404);
      await env
        .DB!.prepare(
          "INSERT INTO store_items (id,title,title_nl,title_en,title_fr,description_nl,description_en,description_fr,price,image,created_at,kind,quantity,deleted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET deleted_at=excluded.deleted_at",
        )
        .bind(
          item.id,
          item.title,
          item.title_nl,
          item.title_en,
          item.title_fr,
          item.description_nl,
          item.description_en,
          item.description_fr,
          item.price,
          null,
          Date.now(),
          item.kind,
          item.quantity,
          Date.now(),
        )
        .run();
    } else if (operation === "reviews")
      await env.DB!.prepare("DELETE FROM reviews WHERE id = ?").bind(id).run();
    else return json({ error: "notFound" }, 404);
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
