# Wiśnia Beauty Studio — Architecture Overview & Roadmap

**Date:** 2026-06-08
**Status:** Approved (design), phased build
**Owner:** Anton Vishneuski

This document is the top-level reference for the Wiśnia Beauty Studio website rebuild.
It defines the stack, the data model, the cross-cutting concerns (SEO, i18n, analytics),
and the phase roadmap. Each phase has its own spec file in this directory.

---

## 1. Goal

Rebuild the existing **high-fidelity HTML/CSS/JS design** of Wiśnia Beauty Studio (a
cosmetology / laser / massage studio in central Warsaw) as a **modern, SEO-first,
bilingual (Polish default + Russian) multi-page website** with a **CMS admin panel**.

The studio's business goal is **lead generation** — drive bookings via
**WhatsApp / phone / Booksy**.

The owner must be able to manage, without a developer:
- **Pages** — create, edit, reorder, and delete landing/service pages (controls how many exist).
- **Per-page content** — hero, prose, steps, FAQ, cross-links, via reorderable blocks.
- **Prices** — tabbed/categorised price lists, reusable across pages.
- **Photos** — uploads (before/after, cabinet, equipment, certificates) with alt text.
- **Reviews** — add/remove client reviews and rating badges.
- **Blog posts** — expertise articles.

## 2. Source design

The design reference lives in `wisnia-beauty/design_handoff/`:
- `source/` — editable HTML/CSS/JS for the homepage + privacy page, plus `robots.txt`, `sitemap.xml`.
- `preview/` — fully self-contained build: homepage, **7 service pages** (`uslugi/*.html`),
  **blog** (`blog/index.html` + 4 articles), privacy page. Open these to view the finished look.

Design tokens (colors, type, spacing, radii, shadows) are documented in
`wisnia-beauty/design_handoff/README.md` and are ported 1:1 into the target theme.

**Fidelity:** high. Recreate pixel-closely, then wire real integrations.

## 3. Stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript** |
| CMS / admin | **Payload CMS 3** mounted in the same Next.js app (`/admin`) |
| Database | **Vercel Postgres** (Payload Postgres adapter) |
| File storage | **Vercel Blob** (Payload upload adapter) |
| Styling | **Tailwind CSS** with design tokens from `styles.css :root` |
| Fonts | Google Fonts: Cormorant Garamond (serif) + Jost (sans) |
| Icons | `lucide-react` (WhatsApp glyph = inline SVG) |
| Public i18n | next-intl (or Payload localization) — `pl` (default) + `ru` |
| Hosting | **Vercel** (one project, one repo) |

Single deploy: `/` = public site, `/admin` = Payload panel, `/api` = Payload's auto-generated API.

## 4. Data model (Payload collections)

All user-facing text fields are **localized `pl` / `ru`** (entered manually for both languages).

### `pages`
Dynamic landing/service pages. Owner can create/duplicate/reorder/delete freely.
- `title` (localized), `slug` (auto from title, editable), `section` (e.g. `uslugi`, `root`)
- `status` (draft / published), `order`
- **SEO group:** `metaTitle`, `metaDescription`, `canonical`, `ogImage`, structured-data type
  (`Service` for service pages), `noindex` flag
- **`layout`** — reorderable blocks array (see §5)

### `prices`
Reusable price rows.
- `tab` (select: `kosmetologia` | `laser` | `cialo` | `pakiety`)
- `category` (localized) + `categorySubtitle` (localized, optional)
- `name` (localized) + `subline` (localized, optional)
- `price` (localized text — preserves "od 650 zł", "220-260 zł", "-15%")
- `priceWas` (localized text, optional — struck-through "zamiast …")
- `isPackage`, `isGift` (checkboxes), `note` (localized rich text, optional)
- `bookingUrl` (optional override), `order`

### `reviews`
- `quote` (localized), `author`, `initial` (1 char), `avatarColor`
- `rating` (1–5, default 5), `source` (Google | Booksy), `date` (localized text), `order`

### `beforeAfter`
- `beforeImage` (→ media), `afterImage` (→ media), `caption` (localized), `order`

### `posts` (blog)
- `title` (localized), `slug`, `cover` (→ media), `excerpt` (localized)
- `body` (localized rich text), `relatedService` (→ pages), SEO group
- `publishedAt`, `status`

### `media`
- Upload to Vercel Blob, `alt` (localized), auto-generated responsive sizes.

### `settings` (global)
- NAP: address, phone, WhatsApp number, Instagram
- Hours, Booksy URL, Google Map embed
- Rating badges (Google score, Booksy score)
- Analytics IDs: GA4, GTM, Search Console verification
- Default OG image, site domain

### `users`
- Single owner account (Payload auth: email + password).

## 5. Page blocks (the `layout` builder)

Each block maps to a React component rendered against the design tokens:
- **Hero** — heading, intro, image *or* "Zdjęcie wkrótce / Фото скоро" placeholder, CTAs, breadcrumb
- **Prose** — rich text ("czym jest / dla kogo / efekty")
- **Steps** — numbered "jak przebiega" (N steps)
- **PriceTable** — reference shared `prices` (filter by tab/category) or inline rows
- **PackagePromo** — −15% upsell card (title, now/was price, link)
- **BeforeAfter** — reference `beforeAfter` pairs
- **Reviews** — reference `reviews` (page-specific selection, e.g. male reviews for the men's page)
- **Gallery** — cabinet / equipment / certificate photos
- **CrossLinks** — links to other service pages
- **FAQ** — accordion Q&A
- **CTA** — WhatsApp / phone / Booksy call-to-action band

## 6. Cross-cutting concerns

### SEO (first-class)
- Per-page metadata API: title, description, canonical, **hreflang (pl/ru)**, Open Graph.
- **Structured data (JSON-LD):** `LocalBusiness`/`BeautySalon` (consistent NAP, hours, geo, map),
  `Service` per service page, `Review` / `AggregateRating`, `FAQPage`, `BreadcrumbList`,
  `Article` for blog posts.
- Dynamic **`sitemap.xml`** (incl. hreflang) + **`robots.txt`**.
- Core Web Vitals budget: `next/image`, font preload, ISR caching → 2–3 s load target.
- HTTPS automatic (Vercel).
- Per-keyword Warsaw service pages (7 initial) — each its own H1/title/meta/content.

### Local SEO
- Consistent NAP between site and Google Business Profile.
- `LocalBusiness` JSON-LD with geo + map embed.
- Trust content: cabinet/equipment photos, certificates/diplomas, before/after, real reviews.

### Analytics & lead attribution
- **GTM** container loads **GA4** + holds Search Console verification.
- CTA clicks (WhatsApp / phone / Booksy) fire `dataLayer` events.
- Capture UTM params + referrer on landing, persist, attach to CTA events
  → source visible in GA4 (Google search / Maps / Instagram / FB / ads).

### i18n
- `pl` default, `ru` switchable; persisted in `localStorage["wisnia-lang"]` parity + locale-prefixed routes.
- All CMS content localized; static narrative copy in next-intl message catalogs.
- Mesotherapy copy avoids "injection/needle" wording (PL regulatory) — preserve verbatim.

## 7. Phase roadmap

Each phase ships independently and has its own spec + plan.

- **Phase 1 — Core foundation** (`2026-06-08-wisnia-beauty-phase1-core-design.md`)
  Next.js + Payload scaffold, Postgres + Blob, auth, design-token theme, shared collections
  (`prices`, `reviews`, `beforeAfter`, `media`, `settings`, `users`), **homepage** rebuilt from
  collections, technical SEO baseline (metadata, sitemap, robots, JSON-LD), GTM/GA4 + lead attribution,
  Vercel deploy. **Outcome:** the live homepage with an editable price/review/before-after admin.

- **Phase 2 — Page builder + service pages**
  `pages` collection + block builder + block renderer; migrate the 7 service pages into CMS;
  per-page prices/photos/reviews/content; `/[locale]/uslugi/[slug]` routing; cross-links;
  per-page SEO + `Service` JSON-LD.

- **Phase 3 — Blog**
  `posts` collection; `/blog` index + `/blog/[slug]`; `Article` JSON-LD; related-service CTA.

## 8. Known gaps / inputs needed from client

- **Domain** (replaces `https://TWOJA-DOMENA.pl`).
- **Analytics IDs:** GA4, GTM, Search Console verification.
- **WhatsApp** number verification (`+48 453 270 435`); Booksy URL confirmed (`wisniabeauty.booksy.com/a`).
- **Google Map** official embed link.
- **Privacy policy** legal entity (NIP / company) + data-request e-mail.
- **Photos:** male hero + male reviews for the men's laser page; cabinet/equipment/certificate photos;
  real heroes for the 5 placeholder service pages.
- Live **rating numbers / review dates** kept in sync with Google/Booksy.
