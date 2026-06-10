# Wiśnia Beauty — Phase 2 (Service Pages + CMS Page Management) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the owner create/edit/reorder/delete service pages in `/admin` (fixed-slot template) that render at `/[locale]/uslugi/[slug]` in pl+ru, each with its own content, a selected slice of the shared price list, page-local reviews and before/after photos, cross-links, and per-page SEO; plus migrate the 7 design service pages into the CMS.

**Architecture:** A new Payload `servicePages` collection with a fixed set of localized fields (no free block builder). A dynamic Next.js route renders the fixed template, reusing presentational components extracted from the homepage. Prices come from a relationship to the shared `prices` collection; reviews/before-after are page-local arrays. Nav (Usługi dropdown + footer), sitemap, and JSON-LD are extended. A new DB migration is generated and committed; the 7 design pages are seeded.

**Tech Stack:** Next.js 16 (App Router), Payload 3.85 (`@payloadcms/db-postgres`), next-intl 4, Tailwind v4, lucide-react, Vitest, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-06-10-wisnia-beauty-phase2-service-pages-design.md`.

**Conventions (from Phase 1):** pnpm; commit per task with the shown message; TDD where logic exists; all CMS text fields localized pl/ru; verify with `pnpm exec tsc --noEmit` + `pnpm test` (and `pnpm build` at milestones); do NOT run `pnpm dev` inside subagents (controller boots at milestones); Postgres bin on PATH for DB cmds: `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"`. Working dir: the git worktree `/Users/antonvishneuski/Projects/WisniaMainSite/.claude/worktrees/phase1-core`. NO co-author lines in commits.

---

## File Structure

```
src/collections/ServicePages.ts          # NEW collection (fixed-slot fields)
src/payload.config.ts                     # register ServicePages
src/migrations/<timestamp>_service_pages.ts  # NEW generated migration
src/lib/queries.ts                        # + getServicePage, getPublishedServicePages, getServicePageParams
src/lib/jsonld.tsx                        # + serviceLd() builder (breadcrumbLd already exists)
src/lib/service-links.ts                  # crossLinks auto-fill helper (TDD)
src/components/shared/PriceRowList.tsx    # EXTRACTED from Cennik row rendering (shared)
src/components/shared/ReviewCard.tsx      # EXTRACTED from Opinie card (shared)
src/components/shared/BeforeAfterCard.tsx # EXTRACTED from Efekty card (shared)
src/components/service/Breadcrumb.tsx
src/components/service/ServiceHero.tsx
src/components/service/ServiceSteps.tsx
src/components/service/PriceAside.tsx
src/components/service/PackagePromo.tsx
src/components/service/CrossLinks.tsx
src/components/service/ServicePage.tsx    # assembles the template from a servicePage doc
app/(frontend)/[locale]/uslugi/[slug]/page.tsx  # route: params/metadata/jsonld/render
src/components/layout/Header.tsx          # + Usługi dropdown
src/components/layout/Footer.tsx          # + Usługi column
src/app/sitemap.ts                        # + published service pages
seed/data/service-pages.ts                # NEW: 7 pages extracted from design
seed/seed.ts                              # + seed servicePages (after prices exist)
tests/unit/service-links.test.ts
tests/unit/jsonld.test.ts                 # + serviceLd case
tests/int/service-pages.int.spec.ts
tests/e2e/service-pages.spec.ts
```

Note on paths: the app router lives under `src/app/(frontend)/[locale]/...`; the new route file is `src/app/(frontend)/[locale]/uslugi/[slug]/page.tsx`. Use the `@/*` alias (→ `src/*`) for imports.

---

## Task 1: `servicePages` collection + register + types

**Files:**
- Create: `src/collections/ServicePages.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Create `src/collections/ServicePages.ts`**

```ts
import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const ServicePages: CollectionConfig = {
  slug: 'servicePages',
  access: { read: () => true },
  admin: { group: 'Treść', useAsTitle: 'title', defaultColumns: ['title', 'slug', 'status', 'order'] },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'Polski slug, wspólny dla obu języków, np. depilacja-laserowa-warszawa' } },
    { name: 'status', type: 'select', defaultValue: 'draft', options: [
      { label: 'Szkic', value: 'draft' }, { label: 'Opublikowana', value: 'published' } ] },
    { name: 'order', type: 'number', defaultValue: 0 },
    { type: 'collapsible', label: 'SEO', fields: [
      { name: 'metaTitle', type: 'text', localized: true },
      { name: 'metaDescription', type: 'textarea', localized: true },
      { name: 'ogImage', type: 'upload', relationTo: 'media' },
      { name: 'serviceName', type: 'text', localized: true },
      { name: 'serviceDescription', type: 'textarea', localized: true },
    ] },
    { type: 'collapsible', label: 'Hero', fields: [
      { name: 'heroImage', type: 'upload', relationTo: 'media' },
      { name: 'heading', type: 'text', localized: true },
      { name: 'intro', type: 'textarea', localized: true },
    ] },
    { name: 'about', type: 'richText', localized: true },
    { name: 'forWhom', type: 'richText', localized: true },
    { name: 'steps', type: 'array', labels: { singular: 'Krok', plural: 'Kroki' }, fields: [
      { name: 'title', type: 'text', localized: true },
      { name: 'text', type: 'textarea', localized: true },
    ] },
    { name: 'results', type: 'richText', localized: true },
    { name: 'priceHeading', type: 'text', localized: true },
    { name: 'priceItems', type: 'relationship', relationTo: 'prices', hasMany: true },
    { type: 'group', name: 'packagePromo', fields: [
      { name: 'enabled', type: 'checkbox', defaultValue: false },
      { name: 'badge', type: 'text', defaultValue: '-15%' },
      { name: 'title', type: 'text', localized: true },
      { name: 'desc', type: 'text', localized: true },
      { name: 'nowPrice', type: 'text', localized: true },
      { name: 'wasPrice', type: 'text', localized: true },
      { name: 'link', type: 'text', defaultValue: '#pakiety' },
    ] },
    { name: 'reviews', type: 'array', fields: [
      { name: 'quote', type: 'textarea', localized: true, required: true },
      { name: 'author', type: 'text', required: true },
      { name: 'initial', type: 'text', maxLength: 1 },
      { name: 'avatarColor', type: 'text', defaultValue: '#8B1A3A' },
      { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
      { name: 'source', type: 'select', defaultValue: 'Google', options: [
        { label: 'Google', value: 'Google' }, { label: 'Booksy', value: 'Booksy' } ] },
      { name: 'date', type: 'text', localized: true },
    ] },
    { name: 'beforeAfter', type: 'array', fields: [
      { name: 'beforeImage', type: 'upload', relationTo: 'media', required: true },
      { name: 'afterImage', type: 'upload', relationTo: 'media', required: true },
      { name: 'caption', type: 'text', localized: true },
    ] },
    { name: 'crossLinks', type: 'relationship', relationTo: 'servicePages', hasMany: true },
  ],
}
```

- [ ] **Step 2: Register in `src/payload.config.ts`**

Read the file; add `import { ServicePages } from './collections/ServicePages'` and add `ServicePages` to the `collections: [...]` array (after BeforeAfter).

- [ ] **Step 3: Generate types + typecheck**

Run:
```bash
pnpm payload generate:types
pnpm exec tsc --noEmit
```
Expected: `src/payload-types.ts` regenerated with a `ServicePage` interface; 0 `error TS`.

- [ ] **Step 4: Commit**

```bash
git add src/collections/ServicePages.ts src/payload.config.ts src/payload-types.ts
git commit -m "feat: servicePages collection (fixed-slot service-page template)"
```

---

## Task 2: DB migration for `servicePages`

**Files:**
- Create: `src/migrations/<timestamp>_service_pages.ts` (generated)

- [ ] **Step 1: Generate the migration**

The local DB currently has the Phase-1 schema (via the committed `initial` migration). Generate an incremental migration that adds the servicePages tables:
```bash
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
pnpm payload migrate:create service_pages
```
Expected: a new file under `src/migrations/` whose `up` contains CREATE TABLE for `service_pages` (+ array/localized side tables + relationships). Open it to confirm it is NOT empty.

- [ ] **Step 2: Apply + reseed locally**

```bash
pnpm payload migrate           # applies the new migration onto the existing schema
pnpm payload migrate:status    # new migration shows Ran: Yes
```
(If `migrate` reports the DB already has the tables from a prior dev-push, reset cleanly: `dropdb --force wisnia && createdb wisnia && pnpm payload migrate && pnpm seed`.)

- [ ] **Step 3: Commit**

```bash
git add src/migrations
git commit -m "feat: migration for servicePages table"
```

---

## Task 3: serviceLd JSON-LD builder + crossLinks helper (TDD)

**Files:**
- Modify: `src/lib/jsonld.tsx`
- Create: `src/lib/service-links.ts`, `tests/unit/service-links.test.ts`
- Modify: `tests/unit/jsonld.test.ts`

- [ ] **Step 1: Write failing test for serviceLd (`tests/unit/jsonld.test.ts`)**

Add:
```ts
import { serviceLd } from '../../src/lib/jsonld'

describe('serviceLd', () => {
  it('builds a Service node with provider + areaServed', () => {
    const ld = serviceLd({ name: 'Depilacja laserowa', description: 'opis', url: 'https://x.pl/uslugi/dl', providerName: 'Wiśnia Beauty Studio', providerUrl: 'https://x.pl' })
    expect(ld['@type']).toBe('Service')
    expect(ld.name).toBe('Depilacja laserowa')
    expect(ld.areaServed).toBe('Warszawa')
    expect(ld.provider['@type']).toBe('BeautySalon')
  })
})
```

- [ ] **Step 2: Run, verify fail**

Run: `pnpm test tests/unit/jsonld.test.ts` → FAIL (serviceLd undefined).

- [ ] **Step 3: Implement serviceLd in `src/lib/jsonld.tsx`**

```ts
export function serviceLd(o: { name: string; description?: string; url: string; providerName: string; providerUrl: string; image?: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'Service',
    name: o.name, description: o.description, url: o.url, image: o.image,
    areaServed: 'Warszawa',
    provider: { '@type': 'BeautySalon', name: o.providerName, url: o.providerUrl },
  }
}
```

- [ ] **Step 4: Write failing test for crossLinks helper (`tests/unit/service-links.test.ts`)**

```ts
import { describe, it, expect } from 'vitest'
import { resolveCrossLinks } from '../../src/lib/service-links'

const pages = [
  { id: '1', slug: 'a', title: 'A' }, { id: '2', slug: 'b', title: 'B' }, { id: '3', slug: 'c', title: 'C' },
] as any

describe('resolveCrossLinks', () => {
  it('returns explicit links when provided', () => {
    const out = resolveCrossLinks({ id: '1', slug: 'a', crossLinks: [pages[1]] } as any, pages)
    expect(out.map((p) => p.slug)).toEqual(['b'])
  })
  it('auto-fills with other published pages (excluding self) when empty, max 3', () => {
    const out = resolveCrossLinks({ id: '1', slug: 'a', crossLinks: [] } as any, pages)
    expect(out.map((p) => p.slug)).toEqual(['b', 'c'])
  })
})
```

- [ ] **Step 5: Run, verify fail**

Run: `pnpm test tests/unit/service-links.test.ts` → FAIL.

- [ ] **Step 6: Implement `src/lib/service-links.ts`**

```ts
export type ServiceLinkRef = { id: string | number; slug: string; title: string }

export function resolveCrossLinks(
  page: { id: string | number; crossLinks?: Array<ServiceLinkRef | string | number> | null },
  allPublished: ServiceLinkRef[],
  max = 3,
): ServiceLinkRef[] {
  const explicit = (page.crossLinks ?? [])
    .map((c) => (typeof c === 'object' ? c : allPublished.find((p) => p.id === c)))
    .filter(Boolean) as ServiceLinkRef[]
  if (explicit.length) return explicit.slice(0, max)
  return allPublished.filter((p) => p.id !== page.id).slice(0, max)
}
```

- [ ] **Step 7: Run both unit files, verify pass**

Run: `pnpm test tests/unit/jsonld.test.ts tests/unit/service-links.test.ts` → PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/jsonld.tsx src/lib/service-links.ts tests/unit/jsonld.test.ts tests/unit/service-links.test.ts
git commit -m "feat: serviceLd JSON-LD builder + crossLinks resolver (TDD)"
```

---

## Task 4: Extract shared presentational components (no visual change)

**Files:**
- Create: `src/components/shared/PriceRowList.tsx`, `src/components/shared/ReviewCard.tsx`, `src/components/shared/BeforeAfterCard.tsx`
- Modify: `src/components/home/Cennik.tsx`, `Opinie.tsx`, `Efekty.tsx` to consume the shared components

- [ ] **Step 1: Read the current home components**

Read `src/components/home/Cennik.tsx` (row/gift/package rendering), `Opinie.tsx` (review card), `Efekty.tsx` (before/after card) to capture their exact markup + props.

- [ ] **Step 2: Create the shared components**

Move the JSX for a single price row (normal/gift/package variants) into `PriceRowList.tsx` exporting a component that takes `{ rows: PriceRow[]; booksyHref: string }` and renders the rows (reuse `groupPrices` is NOT needed here — it renders a flat ordered list with category headers when `category` changes). Move the review card markup into `ReviewCard.tsx` (`{ review }` prop, structural type matching both the `reviews` collection doc and the page-local review array item). Move the before/after card markup into `BeforeAfterCard.tsx` (`{ item }` with `beforeImage/afterImage/caption`, using `next/image`). Keep class names/tokens identical.

- [ ] **Step 3: Refactor the three home components to use the shared ones**

Replace the inline markup in Cennik (rows), Opinie (cards), Efekty (cards) with the extracted components. The homepage output must be byte-for-byte equivalent.

- [ ] **Step 4: Verify no regression**

Run: `pnpm exec tsc --noEmit` (0 errors) and `pnpm test` (all green). The controller will visually diff the homepage at the next boot milestone.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared src/components/home/Cennik.tsx src/components/home/Opinie.tsx src/components/home/Efekty.tsx
git commit -m "refactor: extract shared PriceRowList/ReviewCard/BeforeAfterCard (home unchanged)"
```

---

## Task 5: Service-page presentational components

**Files:**
- Create: `src/components/service/Breadcrumb.tsx`, `ServiceHero.tsx`, `ServiceSteps.tsx`, `PriceAside.tsx`, `PackagePromo.tsx`, `CrossLinks.tsx`
- Reference: `wisnia-beauty/design_handoff/preview/uslugi/depilacja-laserowa-warszawa.html` + `styles.css`

Recreate the design's service-page sections as components, using Tailwind v4 tokens and the shared components from Task 4. Each takes structurally-typed props from a `ServicePage` doc.

- [ ] **Step 1: `Breadcrumb.tsx`** — props `{ items: {label: string; href?: string}[] }`; renders the `.crumbs` row (Home › Usługi › title), last item not linked.

- [ ] **Step 2: `ServiceHero.tsx`** — props `{ heading, intro, image, settings }`. If `image?.url` present, render it (`next/image`); else render the "Zdjęcie wkrótce / Фото скоро" placeholder box (localized via a `t('service.photoSoon')` key — add `service.photoSoon` to messages pl/ru). Include the 3 CTAs (CtaLink with settings hrefs) like the design hero.

- [ ] **Step 3: `ServiceSteps.tsx`** — props `{ steps: {title; text}[] }`; renders numbered `.svc-steps`/`.svc-step` list. Returns null if empty.

- [ ] **Step 4: `PriceAside.tsx`** — props `{ heading?, rows, booksyHref }`; renders `.svc-aside` heading + `<PriceRowList rows booksyHref/>`. Returns null if no rows.

- [ ] **Step 5: `PackagePromo.tsx`** — props `{ promo }` (the group). Returns null unless `promo.enabled`. Renders `.pkg-promo` (badge, title, desc, now/was price, link).

- [ ] **Step 6: `CrossLinks.tsx`** — props `{ links: {slug; title}[]; locale }`; renders `.svc-cross` with anchors to `/[locale]/uslugi/<slug>` (pl unprefixed, ru `/ru`). Returns null if empty.

- [ ] **Step 7: Verify**

Run: `pnpm exec tsc --noEmit` → 0 errors. (Components rendered in Task 6.)

- [ ] **Step 8: Commit**

```bash
git add src/components/service messages/pl.json messages/ru.json
git commit -m "feat: service-page presentational components"
```

---

## Task 6: The route — `uslugi/[slug]/page.tsx` + queries + assembler

**Files:**
- Modify: `src/lib/queries.ts`
- Create: `src/components/service/ServicePage.tsx`, `app/(frontend)/[locale]/uslugi/[slug]/page.tsx`

- [ ] **Step 1: Add queries to `src/lib/queries.ts`**

```ts
export async function getPublishedServicePages(locale: Locale) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'servicePages', locale, where: { status: { equals: 'published' } }, sort: 'order', limit: 100, depth: 0 })
  return res.docs
}

export async function getServicePage(slug: string, locale: Locale) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'servicePages', locale, where: { slug: { equals: slug }, status: { equals: 'published' } }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
}

export async function getServicePageParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'servicePages', where: { status: { equals: 'published' } }, limit: 100, depth: 0, locale: 'pl' })
  return res.docs.map((d: any) => d.slug as string)
}
```

- [ ] **Step 2: Create `ServicePage.tsx` (assembler)**

A server component taking `{ page, settings, locale, crossLinks }` that lays out: `<Breadcrumb/>`, `<ServiceHero/>`, the prose (`about` → render richText via `@payloadcms/richtext-lexical/react`'s `RichText`, `forWhom`, `<ServiceSteps/>`, `results`), `<PriceAside rows={page.priceItems} .../>`, `<PackagePromo promo={page.packagePromo}/>`, before/after grid (map `page.beforeAfter` → `<BeforeAfterCard/>`), reviews (map `page.reviews` → `<ReviewCard/>`), `<CrossLinks/>`. Use `<Reveal>` wrappers. (For richText rendering, use Payload's React renderer: `import { RichText } from '@payloadcms/richtext-lexical/react'` and `<RichText data={page.about} />`; guard null.)

- [ ] **Step 3: Create the route `app/(frontend)/[locale]/uslugi/[slug]/page.tsx`**

```tsx
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { locales } from '@/lib/i18n'
import { getServicePage, getServicePageParams, getPublishedServicePages } from '@/lib/queries'
import { getPayloadClient } from '@/lib/getPayload'
import { serviceLd, breadcrumbLd, JsonLd } from '@/lib/jsonld'
import { resolveCrossLinks } from '@/lib/service-links'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { ServicePage } from '@/components/service/ServicePage'

export const revalidate = 3600
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateStaticParams() {
  const slugs = await getServicePageParams()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const page: any = await getServicePage(slug, locale as Locale)
  if (!page) return {}
  const base = locale === 'ru' ? `${SITE}/ru` : SITE
  const url = `${base}/uslugi/${slug}`
  return {
    metadataBase: new URL(SITE),
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.intro,
    alternates: { canonical: url, languages: { pl: `${SITE}/uslugi/${slug}`, ru: `${SITE}/ru/uslugi/${slug}` } },
    openGraph: { type: 'website', url, title: page.metaTitle || page.title, images: page.ogImage?.url ? [page.ogImage.url] : ['/assets/hero-olga.jpg'] },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page: any = await getServicePage(slug, locale as Locale)
  if (!page) notFound()
  const payload = await getPayloadClient()
  const settings: any = await payload.findGlobal({ slug: 'settings', locale: locale as Locale }).catch(() => null)
  const published: any[] = await getPublishedServicePages(locale as Locale)
  const crossLinks = resolveCrossLinks(page, published.map((p) => ({ id: p.id, slug: p.slug, title: p.title })))
  const base = locale === 'ru' ? `${SITE}/ru` : SITE
  return (
    <>
      <JsonLd data={serviceLd({ name: page.serviceName || page.title, description: page.serviceDescription || page.intro, url: `${base}/uslugi/${slug}`, providerName: 'Wiśnia Beauty Studio', providerUrl: SITE })} />
      <JsonLd data={breadcrumbLd([{ name: 'Home', url: base }, { name: 'Usługi', url: `${base}/uslugi/${slug}` }, { name: page.title, url: `${base}/uslugi/${slug}` }])} />
      <Header locale={locale} settings={settings} />
      <main><ServicePage page={page} settings={settings} locale={locale} crossLinks={crossLinks} /></main>
      <Footer locale={locale} settings={settings} />
      <StickyCta locale={locale} settings={settings} />
    </>
  )
}
```
Adjust prop names if Header/Footer differ; cast Payload docs as needed for tsc.

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit` → 0 errors. (Controller boots + checks routing after Task 9 seed.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/queries.ts src/components/service/ServicePage.tsx "app/(frontend)/[locale]/uslugi/[slug]/page.tsx"
git commit -m "feat: service page route (params, metadata, JSON-LD, assembler)"
```

---

## Task 7: Header "Usługi" dropdown + Footer "Usługi" column

**Files:**
- Modify: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`
- Modify: `app/(frontend)/[locale]/layout.tsx` (pass the published list down) OR fetch inside Header

- [ ] **Step 1: Provide the service list to nav**

The Header/Footer need the published pages (slug+title, ordered). Simplest: fetch in the layout (`getPublishedServicePages(locale)`) and pass `services` prop to Header/Footer; both already receive `locale`/`settings`. Add `services?: {slug; title}[]` to their props.

- [ ] **Step 2: Header dropdown**

Add an "Usługi" item (label `t('nav.uslugi')`) that, on hover/click (client), shows a dropdown of `services` linking to `/[locale]/uslugi/<slug>` (pl unprefixed, ru `/ru`). Include the services in the mobile drawer as a sub-list. If `services` is empty, hide the dropdown.

- [ ] **Step 3: Footer column**

Add an "Usługi" column (heading `t('nav.uslugi')`) listing the same links. Hide if empty.

- [ ] **Step 4: Verify**

Run: `pnpm exec tsc --noEmit` → 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx "app/(frontend)/[locale]/layout.tsx"
git commit -m "feat: Usługi dropdown in header + footer column"
```

---

## Task 8: Sitemap includes service pages

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Extend the sitemap**

Make `sitemap()` async; fetch `getServicePageParams()` and add, for each slug, the `/uslugi/<slug>` (pl) + `/ru/uslugi/<slug>` (ru) entries with the same symmetric `languages` map + `x-default` pattern used for the static paths.

```ts
import type { MetadataRoute } from 'next'
import { getServicePageParams } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const staticPaths = ['', '/polityka-prywatnosci']
  const slugs = await getServicePageParams()
  const servicePaths = slugs.map((s) => `/uslugi/${s}`)
  const paths = [...staticPaths, ...servicePaths]
  return paths.flatMap((p) => {
    const languages = { pl: `${url}${p}`, ru: `${url}/ru${p}`, 'x-default': `${url}${p}` }
    return [
      { url: `${url}${p}`, alternates: { languages } },
      { url: `${url}/ru${p}`, alternates: { languages } },
    ]
  })
}
```

- [ ] **Step 2: Verify + commit**

Run: `pnpm exec tsc --noEmit` → 0 errors.
```bash
git add src/app/sitemap.ts
git commit -m "feat: sitemap includes published service pages (hreflang)"
```

---

## Task 9: Seed the 7 design service pages

**Files:**
- Create: `seed/data/service-pages.ts`
- Modify: `seed/seed.ts`
- Source: `wisnia-beauty/design_handoff/preview/uslugi/*.html` (PL inline + RU in `window.I18N_PAGE`)

- [ ] **Step 1: Extract the 7 pages into `seed/data/service-pages.ts`**

For each of the 7 slugs, transcribe from the design HTML: `title`, `heading`, `intro`, `about`/`forWhom`/`results` prose (as plain text → converted to Lexical richText nodes by a small helper, see Step 2), `steps` (3 items, title+text), `priceNames` (an array of price `name` strings to link via the shared prices), `packagePromo` (where the design shows the −15% card), `reviews` (the men's page gets its male reviews; others may have none or the shared ones — use what the design page shows), `beforeAfter` (real photos only for the laser page → local files `wisnia-beauty/design_handoff/source/assets/ba*-*.jpg`; others empty → placeholder hero), `crossLinks` (slugs), SEO (`metaTitle`/`metaDescription`), `order`. RU values from each page's inline `I18N_PAGE`. Slugs: `depilacja-laserowa-warszawa`, `depilacja-laserowa-mezczyzni-warszawa`, `ipl-fotoodmladzanie-warszawa`, `rf-lifting-warszawa`, `usuwanie-naczynek-warszawa`, `oczyszczanie-twarzy-warszawa`, `mezoterapia-warszawa`.

Shape:
```ts
export const servicePages = [
  { slug: 'depilacja-laserowa-warszawa', order: 0,
    title: { pl: 'Depilacja laserowa', ru: 'Лазерная эпиляция' },
    heading: { pl: '…', ru: '…' }, intro: { pl: '…', ru: '…' },
    about: { pl: '…', ru: '…' }, forWhom: { pl: '…', ru: '…' }, results: { pl: '…', ru: '…' },
    steps: [ { title: {pl,ru}, text: {pl,ru} }, /* x3 */ ],
    priceNames: ['Bikini głębokie', 'Pachy', /* … laser rows to link */],
    packagePromo: { enabled: true, title: {pl,ru}, desc: {pl,ru}, nowPrice: {pl,ru}, wasPrice: {pl,ru}, link: '#pakiety' },
    reviews: [ /* page-local; men's page = male reviews */ ],
    beforeAfter: [ { beforeFile: 'wisnia-beauty/design_handoff/source/assets/ba1-before.jpg', afterFile: '…ba1-after.jpg', caption: {pl,ru} } ],
    heroFile: 'wisnia-beauty/design_handoff/source/assets/hero-laser.jpg', // null for placeholder pages
    crossLinks: ['ipl-fotoodmladzanie-warszawa', 'usuwanie-naczynek-warszawa'],
    metaTitle: {pl,ru}, metaDescription: {pl,ru} },
  // … 6 more …
]
```

- [ ] **Step 2: Extend `seed/seed.ts` to create servicePages**

After prices are seeded (so they exist to link), and after a small `textToLexical(str)` helper (wrap a plain string in a minimal Lexical root → paragraph → text node) for the richText fields:
- Wipe existing servicePages (idempotent).
- For each entry: upload `heroFile` + each before/after image to media (reuse the media-upload pattern); resolve `priceNames` to price IDs by querying `payload.find({ collection: 'prices', where: { name: { equals } } })` (pl locale); resolve `crossLinks` slugs to IDs after all pages exist (two-pass: create all pages, then update crossLinks). Create with `locale: 'pl'`, then `payload.update` with `locale: 'ru'` for localized fields. Set `status: 'published'`.
- Two-pass for crossLinks: first create all 7 (without crossLinks), collect slug→id, then update each with resolved crossLink IDs.

- [ ] **Step 3: Run the seed locally**

Run: `pnpm seed` → expect existing counts plus `servicePages:7`. Add a count log line. Verify no errors.

- [ ] **Step 4: Commit**

```bash
git add seed/data/service-pages.ts seed/seed.ts
git commit -m "feat: seed 7 design service pages into servicePages"
```

---

## Task 10: Integration tests

**Files:**
- Create: `tests/int/service-pages.int.spec.ts`

- [ ] **Step 1: Write the tests**

```ts
// @vitest-environment node
import 'dotenv/config'
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '../../src/payload.config'

let payload: Payload
beforeAll(async () => { payload = await getPayload({ config }) }, 60000)

describe('servicePages (integration, seeded)', () => {
  it('has 7 published pages', async () => {
    const res = await payload.find({ collection: 'servicePages', where: { status: { equals: 'published' } }, limit: 100 })
    expect(res.totalDocs).toBe(7)
  })
  it('a page resolves linked priceItems at depth', async () => {
    const res = await payload.find({ collection: 'servicePages', where: { slug: { equals: 'depilacja-laserowa-warszawa' } }, depth: 2, locale: 'pl', limit: 1 })
    const doc: any = res.docs[0]
    expect(doc).toBeTruthy()
    expect(Array.isArray(doc.priceItems)).toBe(true)
    expect(doc.priceItems.length).toBeGreaterThan(0)
    expect(typeof doc.priceItems[0]).toBe('object') // resolved, not just an id
    expect(doc.priceItems[0].price).toBeTruthy()
  })
  it('pl and ru titles both present for same slug', async () => {
    const pl = await payload.find({ collection: 'servicePages', where: { slug: { equals: 'depilacja-laserowa-warszawa' } }, locale: 'pl', limit: 1 })
    const ru = await payload.find({ collection: 'servicePages', where: { slug: { equals: 'depilacja-laserowa-warszawa' } }, locale: 'ru', limit: 1 })
    expect(pl.docs[0]?.title).toBeTruthy(); expect(ru.docs[0]?.title).toBeTruthy()
    expect(pl.docs[0]?.id).toBe(ru.docs[0]?.id)
  })
})
```

- [ ] **Step 2: Run + commit**

Run: `pnpm test tests/int/service-pages.int.spec.ts` → PASS (requires seeded DB).
```bash
git add tests/int/service-pages.int.spec.ts
git commit -m "test: servicePages integration (count, priceItems depth, locales)"
```

---

## Task 11: E2E tests

**Files:**
- Create: `tests/e2e/service-pages.spec.ts`

- [ ] **Step 1: Write the tests**

```ts
import { test, expect } from '@playwright/test'

test('laser service page renders with price + breadcrumb', async ({ page }) => {
  await page.goto('/uslugi/depilacja-laserowa-warszawa')
  await expect(page.locator('h1')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('main')).toContainText('zł')
})

test('ru service page loads', async ({ page }) => {
  await page.goto('/ru/uslugi/depilacja-laserowa-warszawa')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await expect(page.locator('h1')).toBeVisible()
})

test('header Usługi dropdown navigates to a service page', async ({ page }) => {
  await page.goto('/')
  // open the Usługi dropdown (hover or click) then click a service link
  const uslugi = page.getByRole('button', { name: /Usługi/i }).or(page.getByRole('link', { name: /Usługi/i })).first()
  await uslugi.click().catch(() => {})
  const link = page.getByRole('link', { name: /Depilacja laserowa/i }).first()
  await link.click()
  await expect(page).toHaveURL(/\/uslugi\//)
})

test('unknown service slug 404s', async ({ page }) => {
  const res = await page.goto('/uslugi/nie-istnieje')
  expect(res?.status()).toBe(404)
})
```
Adjust the dropdown selector to the real markup from Task 7 (read Header.tsx).

- [ ] **Step 2: Run + commit**

Run: `pnpm test:e2e tests/e2e/service-pages.spec.ts` → PASS (boots the seeded app).
```bash
git add tests/e2e/service-pages.spec.ts
git commit -m "test: e2e service pages (render, ru, nav dropdown, 404)"
```

---

## Task 12: Full verification + push + deploy seed

**Files:** none (verification + ops)

- [ ] **Step 1: Full local verification**

Run: `pnpm exec tsc --noEmit` (0), `pnpm test` (all green), `pnpm test:e2e` (all green), `pnpm build` (succeeds; route table shows `● /[locale]/uslugi/[slug]`).

- [ ] **Step 2: Controller boots + screenshots a service page (pl + ru) to confirm visual fidelity vs the design preview.**

- [ ] **Step 3: Push + merge to main**

```bash
git push origin worktree-phase1-core
git -C /Users/antonvishneuski/Projects/WisniaMainSite merge --ff-only worktree-phase1-core
git -C /Users/antonvishneuski/Projects/WisniaMainSite push origin main
```
Vercel auto-deploys; `vercel-build` runs the new migration → `service_pages` table created in prod.

- [ ] **Step 4: Seed the 7 pages into prod (one-off)**

After deploy, run the seed against prod (same flow as Phase 1: prod `DATABASE_URL` + `BLOB_READ_WRITE_TOKEN`, `NODE_ENV=production pnpm seed`). Verify via `https://<domain>/api/servicePages?limit=0` → totalDocs 7, and open `/uslugi/depilacja-laserowa-warszawa`.

---

## Self-Review (author)

- **Spec coverage:** collection §3 → Task 1; migration §8 → Task 2; routing/metadata/JSON-LD §4–5 → Task 6 (+ serviceLd Task 3); component reuse §4 → Task 4; service components → Task 5; nav §5 → Task 7; sitemap §5 → Task 8; migration of 7 pages §6 → Task 9; tests §7 → Tasks 10–11; deploy §8 → Task 12. All spec sections mapped.
- **Placeholder scan:** seed prose content is transcribed from the design in Task 9 (not invented); the only deferred items are the spec's "client photos later" (placeholders ship). No TBD steps.
- **Type consistency:** `getServicePage`/`getPublishedServicePages`/`getServicePageParams` defined in Task 6 used in Tasks 6/7/8; `resolveCrossLinks`/`serviceLd` defined Task 3 used Task 6; `PriceRowList`/`ReviewCard`/`BeforeAfterCard` defined Task 4 used Task 5/6; `revalidateAfterChange/Delete` reused from Phase 1 hook in Task 1.
- **Note:** Task 4 is a refactor of shipped homepage components — verify the homepage is visually unchanged at the Task 12 boot before relying on it.
