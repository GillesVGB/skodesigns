import { get, head, put } from "@vercel/blob";
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
  // Vercel Marketplace Postgres providers commonly expose POSTGRES_URL; keep
  // DATABASE_URL as the portable name for local and custom integrations.
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return undefined;
  if (!client) {
    client = postgres(url, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
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
  if (!db) throw new Error("DATABASE_URL or POSTGRES_URL is not configured.");
  await ensureSchema(db);
  return statement.execute(run);
}

const database = {
  prepare(statement: string) {
    return new PreparedStatement(statement);
  },
  async batch(statements: PreparedStatement[]) {
    const db = getClient();
    if (!db) throw new Error("DATABASE_URL or POSTGRES_URL is not configured.");
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
  async put(key: string, body: Uint8Array, options: { httpMetadata?: { contentType?: string } }) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
    return put(key, Buffer.from(body), {
      access: "private",
      addRandomSuffix: false,
      contentType: options.httpMetadata?.contentType,
      token,
    });
  },
  async head(key: string) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return null;
    try {
      return await head(key, { token });
    } catch {
      return null;
    }
  },
  async get(key: string) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return null;
    const blob = await get(key, { access: "private", token });
    return blob && blob.statusCode === 200
      ? {
          body: blob.stream,
          httpMetadata: { contentType: blob.blob.contentType },
        }
      : null;
  },
};

export const env = {
  get DB() {
    return getClient() ? database : undefined;
  },
  get BUCKET() {
    return process.env.BLOB_READ_WRITE_TOKEN ? bucket : undefined;
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
  if (!db) throw new Error("Set DATABASE_URL or POSTGRES_URL to connect the Vercel database.");
  return db;
}
