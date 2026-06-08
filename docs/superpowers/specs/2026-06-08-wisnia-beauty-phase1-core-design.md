# Wiśnia Beauty — Phase 1: Core Foundation (Design Spec)

**Date:** 2026-06-08
**Status:** Draft — awaiting user review
**Parent:** `2026-06-08-wisnia-beauty-overview.md`

## 1. Objective

Stand up the Next.js + Payload application on Vercel with the shared content collections,
the design-token theme, and a fully rebuilt **homepage** whose dynamic sections (prices,
before/after, reviews, contact) are editable from the admin panel — plus the technical-SEO
and analytics baseline that every later page inherits.

**Definition of done:** the homepage is live on Vercel, pixel-close to the design, bilingual
(pl/ru), with a working `/admin` where the owner can edit prices, reviews, before/after, and
site settings; sitemap/robots/JSON-LD/GTM are in place; Lighthouse SEO ≥ 95 and load ≤ 3 s.

Out of scope for Phase 1: the `pages` block builder, the 7 service pages, and the blog
(Phases 2 and 3).

## 2. Architecture

```
app/
  (frontend)/
    [locale]/
      layout.tsx          # html lang, fonts, GTM, next-intl provider
      page.tsx            # homepage (template, reads collections)
    sitemap.ts            # dynamic sitemap incl. hreflang
    robots.ts             # robots.txt
  (payload)/
    admin/[[...segments]] # Payload admin UI
    api/[...slug]         # Payload REST/GraphQL
payload.config.ts         # collections, localization, adapters
src/
  collections/            # Prices, Reviews, BeforeAfter, Media, Users
  globals/                # Settings
  blocks/                 # (stub for Phase 2)
  components/             # Header, Footer, Hero, PriceTabs, ReviewsRow, BeforeAfterGrid, Faq, Contact, StickyCta, CtaButtons
  components/analytics/   # GTM, dataLayer, UTM capture
  lib/                    # jsonld helpers, i18n config, payload client
  theme/                  # tailwind tokens from styles.css
messages/                 # next-intl catalogs: pl.json, ru.json (static copy)
```

Single Vercel deploy. Payload and the frontend share one Next.js app and one Postgres DB.

## 3. Collections delivered in Phase 1

`prices`, `reviews`, `beforeAfter`, `media`, `settings` (global), `users` — fields exactly as
defined in the overview §4. Localization enabled for `pl`/`ru` with `pl` default and fallback.

Admin UX:
- Collections grouped under "Treść" (Content): Prices, Reviews, Before/After, Media.
- "Ustawienia" (Settings) global for NAP, hours, links, analytics IDs, rating badges, domain.
- Drag-to-reorder via `order` field (Payload sort).
- Image fields require `alt` text.

## 4. Homepage composition

The homepage is a fixed template (not the block builder). Sections, top to bottom, recreated
from the design:

1. **Header** — logo, anchor nav, PL/RU toggle, Booksy CTA; mobile burger drawer.
2. **Hero** — H1 + subtitle + 3 CTAs (WhatsApp/Zadzwoń/Booksy) + trust line + owner photo.
3. **Pain/empathy** — 3 cards (static copy via next-intl).
4. **Nasze kierunki** — 4 cards; click selects matching price tab + scrolls to `#cennik`.
5. **Cennik** — tabbed price list (Kosmetologia / Laser / Ciało / Pakiety) rendered from `prices`;
   supports categories, sublines, gift-pills, package now/was cards.
6. **Efekty** — before/after grid rendered from `beforeAfter`.
7. **O nas** — team cards + owner quote (static copy + media).
8. **Jak to działa** — 3 numbered steps (static).
9. **Opinie** — horizontally scrollable reviews from `reviews` + rating badges from `settings`.
10. **FAQ** — accordion (static copy).
11. **Kontakt** — NAP + CTAs + map, all from `settings`.
12. **Footer** — brand, nav, contact, social, privacy link.
13. **Sticky mobile CTA** — Booksy + WhatsApp + phone (≤640px).

Static narrative copy (pain points, team bios, how-it-works, FAQ) lives in `messages/{pl,ru}.json`.
Dynamic data (prices, reviews, before/after, NAP, ratings) comes from Payload.

Privacy page (`/[locale]/polityka-prywatnosci`) ported as static localized content.

## 5. Theme

Port `styles.css :root` tokens into Tailwind `theme.extend` (colors, spacing scale `--s-1..-s-10`,
radii, warm cherry-tinted shadows, `--maxw 1200px`, `--header-h 78px`). Recreate component styles
to match: serif headings (Cormorant Garamond 600, `text-wrap: balance`), Jost body 17px/1.65,
eyebrow labels (13px uppercase 0.28em rose-gold), `.accent` italic cherry. Breakpoints 960 / 640.
Reveal-on-scroll via IntersectionObserver gated behind `prefers-reduced-motion`.

## 6. i18n

- next-intl with locale-prefixed routes `/pl/...` (default, may be unprefixed) and `/ru/...`.
- Locale toggle swaps route + persists choice; `<html lang>` and `<title>` update.
- CMS content: Payload localized fields; static copy: next-intl catalogs.
- Mesotherapy phrasing avoids "injection/needle" — enforced in copy.

## 7. SEO baseline

- `generateMetadata` per route: title, description, canonical, hreflang alternates, OG.
- JSON-LD: `LocalBusiness`/`BeautySalon` (from `settings`), `FAQPage`, `AggregateRating`/`Review`
  (from `reviews` + rating badges), `BreadcrumbList`.
- Dynamic `sitemap.ts` (homepage + privacy now; extended in later phases) with hreflang.
- `robots.ts` allowing crawl, pointing to sitemap; `noindex` honored per page.
- `next/image` for all imagery, font preload, ISR (`revalidate`) with on-demand revalidation
  triggered by Payload `afterChange` hooks on publish.

## 8. Analytics & lead attribution

- GTM container injected from `settings.gtmId` (skipped if empty) — `<head>` + `<noscript>`.
- GA4 + Search Console verification loaded via GTM.
- `dataLayer` events on every CTA click: `cta_click` with `{ method: whatsapp|phone|booksy, location }`.
- On first landing: read UTM params + `document.referrer`, store in a first-party cookie,
  attach to subsequent `cta_click` events.

## 9. Auth & security

- Single owner user (Payload local auth). Seed/first-run creates the admin via env or first-user flow.
- `/admin` and `/api` protected by Payload access control (authenticated only for writes;
  public read for published content via the frontend's server-side Payload calls).
- Secrets via Vercel env vars: `PAYLOAD_SECRET`, `DATABASE_URL` (Vercel Postgres),
  `BLOB_READ_WRITE_TOKEN`. `.env*` git-ignored.

## 10. Seeding

A seed script imports the existing homepage data from the design reference into the collections:
all price rows (per the 4 tabs, with categories/sublines/gift-pills/packages), the 6 reviews +
rating badges, the 6 before/after pairs (+ images uploaded to Blob), and the `settings` NAP/links.
This gives a populated homepage on first deploy and a realistic admin to edit.

## 11. Testing & verification

- **Unit:** price-list grouping (tab→category→rows), JSON-LD builders, UTM parser.
- **Integration:** Payload collection CRUD + access control; homepage renders from seeded data;
  locale switch swaps content.
- **E2E (Playwright):** homepage loads pl + ru; price tabs switch; FAQ accordion; CTA click fires
  a `dataLayer` event; admin login + edit a price + see it reflected after revalidate.
- **SEO checks:** Lighthouse SEO ≥ 95, valid JSON-LD (schema.org validator), sitemap + robots
  reachable, hreflang present.
- **Perf:** LCP/load ≤ 3 s on mid-tier mobile profile.

Follows TDD: write the failing test for each unit/integration behavior before implementing.

## 12. Deliverables

- Running Next.js + Payload app committed to the repo.
- Vercel project connected to the repo with env vars and Postgres + Blob.
- Seeded, editable homepage live and bilingual.
- This phase's implementation plan (next step: writing-plans skill).

## 13. Open inputs (can use placeholders, flagged as TODO)

Domain, GA4/GTM/Search-Console IDs, official Google Map embed, privacy legal entity + e-mail,
WhatsApp number verification. Placeholders used where missing, surfaced in `settings` and README.
