# Sko Designs

A multilingual creative-studio website built with Next.js, React and TypeScript. The website and API run in the same Vercel project on `www.skodesign.nl`; the application does not proxy to a private Sites hostname.

## Run locally

Requires Node.js 22.13 or later. Create `.env.local` from `.env.example` and add the Postgres, Blob and Discord credentials before testing the API locally.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5174`. Build with `npm run build`.

## Content and design

- `lib/content.ts`: Dutch, English and French dictionaries, prices in euro cents, project catalogue and verified Discord invite. English is the first-visit default; language selections persist between visits.
- `components/studio.tsx`: navigation, language switcher, gallery/lightbox, services, team, reviews, pricing calculator, contact and footer.
- `app/globals.css`: shared design tokens, responsive layouts, reduced-motion styles and interaction states.
- `app/[lang]/[[...slug]]/page.tsx`: nine public pages plus a protected staff page per language, translated metadata, canonical URLs and hreflang. Admin routes are excluded from the sitemap and marked noindex.
- `proxy.ts`: server-rendered document language and redirects for existing unprefixed links.
- `public/assets`: the supplied Sko branding, nine recent works, optimized static animation previews, Gilles' Discord avatar and a self-hosted Manrope variable font.
- `components/project-planner.tsx` and `lib/planner-copy.ts`: a local three-step project brief builder with validated fields, clipboard copy and text-file download in all languages.
- `components/public-reviews.tsx` and `app/api/reviews/route.ts`: real review submission with a public-consent checkbox, server validation and Postgres persistence.
- `components/admin.tsx`: Discord staff login and management of recent work, the existing pricing page and reviews. There is no separate store page: pricing is the store.
- `lib/pricing-catalog.ts`: the original price list; database overrides and new items feed the pricing page, package calculator and project planner together.
- `lib/staff-auth.ts`: authorization-code OAuth with state validation, encrypted access tokens, opaque HttpOnly session cookies and server-side membership checks. Sessions expire within one hour; positive role checks are reused for at most ten seconds to avoid Discord rate limits. Removing a staff role therefore takes effect within ten seconds. API failures deny access.
- `lib/platform.ts`: Postgres-backed persistence and private Vercel Blob storage for staff uploads. The first API request creates the required tables and indexes if the database is empty.
- Staff uploads have an 8 MB limit and validated PNG/JPEG/static WebP headers and bounded image dimensions. Deleting portfolio and price items unpublishes them, with an immediate Undo action. Deleting a review permanently removes that record after an explicit confirmation in the UI.

## Discord staff access

The configured server is `1562896437082071090`, the staff role is `1563635614287663185` and the Discord application is `1564008974720958464`. The application requests only `identify` and `guilds.members.read`; no bot token is needed.

Required variables are `DATABASE_URL` (or the Vercel integration's `POSTGRES_URL`), `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`. Connect a private Blob store to the same Vercel project; new OIDC-backed stores provide `BLOB_STORE_ID` and short-lived authentication automatically, while token-based stores use `BLOB_READ_WRITE_TOKEN`. The guild and staff role IDs default to the values above, but may be overridden with `DISCORD_GUILD_ID` and `DISCORD_STAFF_ROLE_ID`. Add all required variables to Production (and Preview if you use previews). For local development, store them in the ignored `.env.local` file. Never commit secrets.

Required Discord OAuth redirects to register in the application settings:

- `http://127.0.0.1:5174/api/auth/discord/callback/`
- `https://www.skodesign.nl/api/auth/discord/callback/` (production; exact match, including the trailing slash)

The protected page is `/nl/admin/` (or `/en/admin/`, `/fr/admin/`). All write endpoints verify the session, staff role and same-origin request before changing data.

## Factual sources and decisions

The original site and the supplied offline copy were inspected as design references. Its offered services were retained. Following the user's correction, all reference-site testimonials were removed: the deployed review collection starts empty and displays only submitted reviews, without verification badges. The team is Skodax, CEO/Owner, as supplied by the user; personal age, unrelated team members and unsupported experience claims are omitted.

Prices and conditions use the user's corrected list, overriding the old site: FiveM €18.49, Discord €12.99, Streamer €36.99; logo/banner €5.49; logo/banner animation €8.99; thumbnail €3.49; image/box sets €3.49 / €5.99 / €8.99 / €16.49 / €21.99. These are starting prices; the final price is agreed together.

The portfolio contains the user's seven initial files and nine later recent works. No portfolio artwork from the reference website is included. Original artwork wording is preserved; written website branding is Sko Designs. Navigation and footer use the transparent logo; the homepage restores the earlier layered artwork composition.

Ordering is through the latest user-confirmed Discord invitation: https://discord.gg/skodesigns. The project planner prepares a brief locally and does not send it. The review form stores only the publicly consented name, rating, text, language and timestamp; a daily rotating hashed technical key limits submissions. There is no analytics or advertising tracking. Language preference is stored locally and in a SameSite cookie; the theme is stored locally. Every page includes the requested By Gilles credit linked to Discord user 960090714950225970.

## Domain and deployment

The production domain is `https://www.skodesign.nl`; the Vercel project should use `www` as its primary domain and redirect the apex domain to it. The app and its `/api/*` routes deploy together from this repository's `main` branch. No catch-all proxy, second host or subdomain is required. Connect a Postgres database and a private Blob store to Vercel, then add the variables listed above. Register `https://www.skodesign.nl/api/auth/discord/callback/` as the production OAuth redirect URI in Discord.

Source is also pushed to the user-requested GitHub repository `https://github.com/GillesVGB/skodesigns`.

## Verification

See the delivered verification report for the completed checks. Browser checks cover desktop, tablet and phone layouts, localized routes, package totals, copying and downloading, locale persistence, mobile navigation, portfolio filtering, animation controls and accessible dialogs. Review submission was tested against local D1; the temporary QA record was removed while user-created local reviews were preserved.
