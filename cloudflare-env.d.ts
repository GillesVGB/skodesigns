declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    DISCORD_CLIENT_ID?: string;
    DISCORD_CLIENT_SECRET?: string;
    DISCORD_GUILD_ID?: string;
    DISCORD_STAFF_ROLE_ID?: string;
    DISCORD_REDIRECT_URI?: string;
    SKO_PUBLIC_PROXY_SECRET?: string;
  }
}
