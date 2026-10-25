# Sko Designs

A complete multilingual creative-studio website, built with React, TypeScript and Vinext (Next.js App Router compatible) for Cloudflare Workers / Sites.

## Run locally

Requires Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

Open the Local URL printed by the server. Build with `npm run build`. The Sites publishing workflow uses its `build-site.mjs` helper. The hosting identity is stored in `.openai/hosting.json`.

## Content and design

- `lib/content.ts`: Dutch, English and French dictionaries, prices in euro cents, project catalogue and verified Discord invite.
- `components/studio.tsx`: navigation, language switcher, gallery/lightbox, services, team, reviews, pricing calculator, contact and footer.
- `app/globals.css`: shared design tokens, responsive layouts, reduced-motion styles and interaction states.
- `app/[lang]/[[...slug]]/page.tsx`: eight pages per language, translated metadata, canonical URLs and hreflang.
- `proxy.ts`: server-rendered document language and redirects for existing unprefixed links.
- `public/assets`: only the seven user-supplied Sko artworks, their optimized static animation previews and a self-hosted Manrope variable font.

## Factual sources and decisions

The original site was inspected through the browser on 25 October 2026. Its six services and ten original client testimonials were retained, with natural translations. Reviews are shown without invented verification badges. The team is Skodax, CEO/Owner, as supplied by the user; personal age, unrelated team members and unsupported experience claims are omitted.

Prices and conditions use the user's corrected list, overriding the old site: FiveM €18.49, Discord €12.99, Streamer €36.99; logo/banner €5.49; logo/banner animation €8.99; thumbnail €3.49; image/box sets €3.49 / €5.99 / €8.99 / €16.49 / €21.99. These are starting prices; the final price is agreed together.

The portfolio contains only the user's seven supplied files. Following the user's correction, no portfolio artwork from the reference website is included. Original artwork wording is preserved; written website branding is Sko Designs.

Ordering is through the user-confirmed Discord invitation: https://discord.gg/zBPeuExUS3. There is no contact submission form, fake success state, analytics, tracking or collection of project data on this website. The calculator only copies a brief at the visitor's request. Language preference is stored locally and in a SameSite cookie, so language-prefixed URLs and return visits remain consistent.

## Domain and deployment

SEO canonical URLs, sitemap and hreflang retain `https://thomdesigns.nl`. No domain, DNS or original hosting changes have been made. The Sites deployment is a separate private review preview. Publishing to the existing domain requires the domain/hosting access to be configured explicitly.

## Verification

See the delivered verification report for the completed checks. Core browser tests cover all eight routes in all three languages at desktop, tablet and phone widths, package totals, copying, locale persistence, mobile navigation, portfolio filtering, animation controls, accessible dialog closure and focus restoration.
