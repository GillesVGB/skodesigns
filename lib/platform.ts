import { Buffer } from "node:buffer";
import postgres from "postgres";

type QueryRows = postgres.Row[] & { count: number };
type QueryRunner = (
  query: string,
  values: postgres.ParameterOrJSON<never>[],
) => Promise<QueryRows>;

const schema = [
  `CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, name TEXT NOT NULL, rating INTEGER NOT NULL, body TEXT NOT NULL, language TEXT NOT NULL, created_at DOUBLE PRECISION NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS review_limits (id TEXT PRIMARY KEY, next_allowed_at DOUBLE PRECISION NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS staff_sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, avatar TEXT, token_cipher TEXT NOT NULL, expires_at DOUBLE PRECISION NOT NULL, verified_at DOUBLE PRECISION)`,
  `CREATE TABLE IF NOT EXISTS portfolio_items (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, image TEXT NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL, featured INTEGER NOT NULL, created_at DOUBLE PRECISION NOT NULL, deleted_at DOUBLE PRECISION)`,
  `CREATE TABLE IF NOT EXISTS hidden_projects (id TEXT PRIMARY KEY, created_at DOUBLE PRECISION NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS store_items (id TEXT PRIMARY KEY, title TEXT NOT NULL, description_nl TEXT NOT NULL, description_en TEXT NOT NULL, description_fr TEXT NOT NULL, price INTEGER NOT NULL, image TEXT, created_at DOUBLE PRECISION NOT NULL, deleted_at DOUBLE PRECISION, title_nl TEXT, title_en TEXT, title_fr TEXT, kind TEXT NOT NULL DEFAULT 'single', quantity INTEGER)`,
  `CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews (created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS portfolio_live_idx ON portfolio_items (deleted_at, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS store_live_idx ON store_items (deleted_at, created_at)`,
];

let client: ReturnType<typeof postgres> | undefined;
let schemaReady: Promise<void> | undefined;

function getClient() {
  const url = process.env.SUPABASE_DATABASE_URL;
  if (!url) return undefined;
  if (!client) {
    client = postgres(url, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      ssl: "require",
    });
  }
  return client;
}

async function ensureSchema(db: ReturnType<typeof postgres>) {
  if (!schemaReady) {
    schemaReady = db.begin(async (tx) => {
      for (const statement of schema) await tx.unsafe(statement);
      await tx.unsafe(
        "ALTER TABLE staff_sessions ADD COLUMN IF NOT EXISTS verified_at DOUBLE PRECISION",
      );
      await tx.unsafe(
        "ALTER TABLE store_items ADD COLUMN IF NOT EXISTS title_nl TEXT, ADD COLUMN IF NOT EXISTS title_en TEXT, ADD COLUMN IF NOT EXISTS title_fr TEXT, ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'single', ADD COLUMN IF NOT EXISTS quantity INTEGER",
      );
    }).then(() => undefined).catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  await schemaReady;
}

function toPostgres(statement: string) {
  let query = statement.trim().replace(/;\s*$/, "");
  query = query.replace(/^INSERT\s+OR\s+IGNORE\s+INTO\s+/i, "INSERT INTO ");
  const ignoredInsert = /^INSERT\s+OR\s+IGNORE\s+INTO\s+/i.test(statement.trim());
  let index = 0;
  query = query.replace(/\?/g, () => `$${++index}`);
  if (ignoredInsert && !/\bON\s+CONFLICT\b/i.test(query)) {
    query += " ON CONFLICT DO NOTHING";
  }
  return query;
}

class PreparedStatement {
  private values: postgres.ParameterOrJSON<never>[] = [];
  constructor(private readonly statement: string) {}

  bind(...values: postgres.ParameterOrJSON<never>[]) {
    this.values = values;
    return this;
  }

  async execute(run: QueryRunner) {
    return run(toPostgres(this.statement), this.values);
  }

  async all<T = Record<string, unknown>>() {
    const rows = await runQuery((query, values) => client!.unsafe(query, values), this);
    return { results: rows as unknown as T[] };
  }

  async first<T = Record<string, unknown>>(): Promise<T | undefined>;
  async first(column: string): Promise<unknown>;
  async first<T = Record<string, unknown>>(column?: string): Promise<T | unknown | undefined> {
    const rows = await runQuery((query, values) => client!.unsafe(query, values), this);
    const row = rows[0] as T | undefined;
    return column && row && typeof row === "object"
      ? (row as Record<string, unknown>)[column]
      : row;
  }

  async run() {
    const rows = await runQuery((query, values) => client!.unsafe(query, values), this);
    return { success: true as const, meta: { changes: rows.count } };
  }
}

async function runQuery(
  run: QueryRunner,
  statement: PreparedStatement,
) {
  const db = getClient();
  if (!db)
    throw new Error(
      "SUPABASE_DATABASE_URL is not configured.",
    );
  await ensureSchema(db);
  return statement.execute(run);
}

const database = {
  prepare(statement: string) {
    return new PreparedStatement(statement);
  },
  async batch(statements: PreparedStatement[]) {
    const db = getClient();
    if (!db)
      throw new Error(
        "SUPABASE_DATABASE_URL is not configured.",
      );
    await ensureSchema(db);
    return db.begin(async (tx) => {
      const results = [];
      for (const statement of statements) {
        const rows = await statement.execute(
          (query, values) => tx.unsafe(query, values),
        );
        results.push({ results: rows });
      }
      return results;
    });
  },
};

const bucket = {
  async put(
    key: string,
    body: Uint8Array,
    options: { httpMetadata?: { contentType?: string } },
  ) {
    await ensureSupabaseBucket();
    const response = await supabaseStorageRequest(
      `/object/${encodeURIComponent(storageBucketName())}/${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": options.httpMetadata?.contentType || "application/octet-stream",
          "Cache-Control": "max-age=3600",
        },
        body: Buffer.from(body),
      },
    );
    if (!response.ok)
      throw new Error(`Supabase Storage upload failed (${response.status}).`);
  },
  async head(key: string) {
    const response = await supabaseStorageRequest(
      `/object/${encodeURIComponent(storageBucketName())}/${encodeURIComponent(key)}`,
      { method: "HEAD" },
    );
    if (response.status === 404) return null;
    if (!response.ok)
      throw new Error(`Supabase Storage check failed (${response.status}).`);
    return { httpMetadata: { contentType: response.headers.get("content-type") || undefined } };
  },
  async get(key: string) {
    const response = await supabaseStorageRequest(
      `/object/authenticated/${encodeURIComponent(storageBucketName())}/${encodeURIComponent(key)}`,
    );
    if (response.status === 404) return null;
    if (!response.ok)
      throw new Error(`Supabase Storage download failed (${response.status}).`);
    return response.body
      ? {
          body: response.body,
          httpMetadata: { contentType: response.headers.get("content-type") || undefined },
        }
      : null;
  },
};

function supabaseStorageConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  if (
    parsed.protocol !== "https:" &&
    !(parsed.protocol === "http:" && parsed.hostname === "localhost")
  )
    return undefined;
  return { url: parsed.origin, key };
}

function storageBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || "sko-designs-media";
}

async function supabaseStorageRequest(path: string, init: RequestInit = {}) {
  const config = supabaseStorageConfig();
  if (!config) throw new Error("Supabase Storage is not configured.");
  const headers = new Headers(init.headers);
  headers.set("apikey", config.key);
  return fetch(`${config.url}/storage/v1${path}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
}

let bucketSetup: Promise<void> | undefined;
async function ensureSupabaseBucket() {
  if (!bucketSetup) {
    bucketSetup = (async () => {
      const name = storageBucketName();
      if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(name))
        throw new Error("SUPABASE_STORAGE_BUCKET has an invalid name.");
      const existing = await supabaseStorageRequest(
        `/bucket/${encodeURIComponent(name)}`,
      );
      if (existing.ok) return;
      if (existing.status !== 404)
        throw new Error(`Supabase Storage bucket check failed (${existing.status}).`);
      const created = await supabaseStorageRequest("/bucket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: name,
          name,
          public: false,
          file_size_limit: 8_000_000,
          allowed_mime_types: ["image/png", "image/jpeg", "image/webp"],
        }),
      });
      if (!created.ok && created.status !== 409)
        throw new Error(`Supabase Storage bucket creation failed (${created.status}).`);
    })().catch((error) => {
      bucketSetup = undefined;
      throw error;
    });
  }
  await bucketSetup;
}

export const env = {
  get DB() {
    return getClient() ? database : undefined;
  },
  get BUCKET() {
    return supabaseStorageConfig() ? bucket : undefined;
  },
  get DISCORD_CLIENT_ID() {
    return process.env.DISCORD_CLIENT_ID;
  },
  get DISCORD_CLIENT_SECRET() {
    return process.env.DISCORD_CLIENT_SECRET;
  },
  get DISCORD_GUILD_ID() {
    return process.env.DISCORD_GUILD_ID;
  },
  get DISCORD_STAFF_ROLE_ID() {
    return process.env.DISCORD_STAFF_ROLE_ID;
  },
};

export function getDb() {
  const db = getClient();
  if (!db)
    throw new Error(
      "Set SUPABASE_DATABASE_URL to connect the database.",
    );
  return db;
}
