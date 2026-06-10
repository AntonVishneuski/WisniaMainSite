# Wiśnia Beauty — Phase 2: Service Pages + CMS Page Management (Design Spec)

**Date:** 2026-06-10
**Status:** Draft — awaiting user review
**Parent:** `2026-06-08-wisnia-beauty-overview.md`
**Builds on:** Phase 1 (deployed: homepage + admin for prices/reviews/before-after + SEO/analytics, on Vercel; Next.js 16 + Payload 3 + Postgres + Blob + next-intl pl/ru).

## 1. Objective

Let the studio owner create, edit, reorder, and delete **service/landing pages** from the admin —
controlling how many exist — each with its own content, a selected slice of the shared price list,
its own reviews and before/after photos, and per-page SEO. Migrate the 7 design service pages
(`uslugi/*`) into the CMS so they render at `/[locale]/uslugi/[slug]` in both languages.

**Definition of done:** the owner can add a new service page in `/admin` and it appears (published)
at `/uslugi/<slug>` (pl) and `/ru/uslugi/<slug>` (ru), in the site nav (Usługi dropdown + footer),
and in `sitemap.xml`, with correct metadata + JSON-LD — without a developer. The 7 design pages are
seeded and live.

Out of scope: blog (Phase 3); changing the homepage template; e-commerce/booking beyond existing CTAs.

## 2. Key decisions (from brainstorming)

- **Fixed-slot template**, not a free block builder — every service page shares the same proven layout;
  the owner fills defined slots. Safer for a non-technical editor; matches the design.
- **Prices:** the page selects rows from the **shared `prices` collection** (relationship). A price is
  edited once and reflects on the homepage and every page that references it.
- **Reviews & before/after:** entered **per-page** (page-local arrays), not the shared homepage
  collections — so e.g. the men's page can carry male reviews without affecting the homepage.
- **Slug:** a single Polish slug per page, shared across locales (canonical); content is localized.
- **Empty slots don't render** (no photo → "Zdjęcie wkrótce / Фото скоро" hero placeholder; no
  reviews/before-after/package → those sections are omitted).

## 3. Data model — `servicePages` collection (Payload)

All user-facing text fields localized `pl`/`ru`. Admin group "Treść".

- `title` (text, localized, required) — used as nav label + H1.
- `slug` (text, required, unique) — auto from `title`, editable; Polish, shared across locales.
- `status` (select: draft | published, default draft) — only published render/appear in nav/sitemap.
- `order` (number) — nav + listing order.
- **SEO group:** `metaTitle` (localized), `metaDescription` (localized), `ogImage` (upload→media),
  `serviceName` (localized — for `Service` JSON-LD; defaults to title), `serviceDescription` (localized).
- **Hero group:** `heroImage` (upload→media, optional → placeholder when empty), `heading` (localized;
  defaults to title), `intro` (textarea, localized).
- **Content:** `about` (richText, localized — "Czym jest"), `forWhom` (richText, localized, optional —
  "Dla kogo"), `steps` (array of `{ title (localized), text (localized) }` — "Jak przebiega"),
  `results` (richText, localized, optional — "Efekty").
- **Prices:** `priceHeading` (localized, optional), `priceItems` (relationship → `prices`, hasMany,
  ordered). Renders the price aside; empty → no price section.
- **Package promo (optional group `packagePromo`):** `enabled` (checkbox), `badge` (text, e.g. "−15%"),
  `title` (localized), `desc` (localized), `nowPrice` (localized text), `wasPrice` (localized text),
  `link` (text, default `#pakiety` on home).
- **Reviews (page-local):** `reviews` (array of `{ quote (textarea, localized), author, initial,
  avatarColor, rating (1–5, default 5), source (Google|Booksy), date (localized text) }`).
- **Before/after (page-local):** `beforeAfter` (array of `{ beforeImage (upload→media), afterImage
  (upload→media), caption (localized) }`).
- **Cross-links:** `crossLinks` (relationship → `servicePages`, hasMany). Empty → auto-fill with other
  published pages.
- **Hooks:** `afterChange` + `afterDelete` → `revalidatePath('/', 'layout')` (reuse Phase 1 hook,
  NEXT_RUNTIME-guarded).
- **Access:** `read: () => true`; create/update/delete authenticated (Payload default).

## 4. Routing & frontend

- Route: `src/app/(frontend)/[locale]/uslugi/[slug]/page.tsx` — dynamic.
  - `generateStaticParams`: published pages × locales.
  - `generateMetadata`: title/description/canonical/hreflang/OG from the SEO group (+ `metadataBase`).
  - `export const revalidate = 3600` + on-demand revalidation via the collection hook.
  - Unknown or draft slug → `notFound()` (branded 404 from Phase 1).
- Render order (fixed template): Header → breadcrumb (Home › Usługi › title) → Hero (image or
  placeholder) → prose (about / forWhom / steps / results) → price aside (from `priceItems`) →
  package promo (if enabled) → before/after grid (if any) → reviews (if any) → cross-links → Footer →
  Sticky CTA.
- **Component reuse:** extract shared presentational components so home + service pages share markup:
  - `PriceRowList` (render an array of price rows — used by homepage Cennik and the service aside),
  - `ReviewCard`, `BeforeAfterCard`, `CtaLink`, `Reveal` (already shared).
  - New components: `ServiceHero`, `Breadcrumb`, `ServiceSteps`, `PriceAside`, `PackagePromo`,
    `CrossLinks`, and the page assembler.
- Data access: extend `src/lib/queries.ts` with `getServicePage(slug, locale)` (depth to resolve
  `priceItems` and media) and `getServicePageSlugs()` / `getPublishedServicePages(locale)` (for params
  + nav).

## 5. Navigation & SEO

- **Header:** add an "Usługi" dropdown listing published pages (by `order`); mobile drawer includes
  them. Uses next-intl label `nav.uslugi` (already present).
- **Footer:** add an "Usługi" column with the same links.
- **Sitemap (`src/app/sitemap.ts`):** include every published service page for both locales with
  symmetric hreflang + x-default (extend the existing builder; fetch slugs from Payload).
- **JSON-LD per page:** `Service` (name/description/provider→LocalBusiness/areaServed Warszawa) +
  `BreadcrumbList`. Reuse `src/lib/jsonld.tsx` (add a `serviceLd` builder; `breadcrumbLd` already exists).

## 6. Migration / seed

Extend the seed to create the 7 design service pages from `wisnia-beauty/design_handoff/preview/uslugi/*`
(or `source` equivalents): PL text from the HTML, RU from the inline `window.I18N_PAGE` dictionaries.
For each page: slug (from filename), title/heading/intro, about/forWhom/steps/results prose, linked
`priceItems` (match by name to seeded prices), package promo where present, before/after (real photos
for the laser page; placeholders elsewhere), reviews (male reviews on the men's page), cross-links,
SEO fields, `status: published`, `order`. Idempotent (upsert/replace by slug). The 7 slugs:
`depilacja-laserowa-warszawa`, `depilacja-laserowa-mezczyzni-warszawa`, `ipl-fotoodmladzanie-warszawa`,
`rf-lifting-warszawa`, `usuwanie-naczynek-warszawa`, `oczyszczanie-twarzy-warszawa`, `mezoterapia-warszawa`.

## 7. Testing

- **Unit:** cross-link auto-fill helper; any slug/utility logic.
- **Integration (Payload local API):** create a servicePage with linked `priceItems` → relationship
  resolves at depth; published vs draft access; `getServicePage`/slug queries return expected shape.
- **E2E (Playwright):** a seeded service page renders (hero, price aside shows zł, breadcrumb); the
  header "Usługi" dropdown lists pages and navigates; draft page 404s; pl + ru both load.
- All existing Phase 1 tests must stay green; `tsc` clean; `next build` passes.

## 8. Migrations & deploy

- Generate a new Payload migration for the `servicePages` table (`payload migrate:create`), commit it;
  `vercel-build` applies it automatically on deploy.
- After deploy, seed the 7 pages into prod (same one-off seed flow as Phase 1).

## 9. Open inputs (use design content / placeholders)

- Real hero photos for the 5 placeholder pages and the men's page (client to supply later — placeholders
  ship now).
- Final male reviews for the men's page (use the design's where present).
