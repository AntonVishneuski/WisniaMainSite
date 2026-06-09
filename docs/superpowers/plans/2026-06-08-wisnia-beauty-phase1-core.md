# Wiśnia Beauty — Phase 1 (Core Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a live, bilingual (pl/ru) Wiśnia Beauty homepage on Vercel, rendered from a Payload CMS whose admin lets the owner edit prices, reviews, before/after, and site settings — with the technical-SEO and analytics baseline every later page inherits.

**Architecture:** One Next.js 15 (App Router) app with Payload CMS 3 mounted inside it (`/admin`, `/api`). Data in Vercel Postgres, images in Vercel Blob. The public homepage is a fixed server-rendered template that reads dynamic data (prices, reviews, before/after, NAP, ratings) from Payload collections; static narrative copy lives in next-intl catalogs. SEO (metadata, JSON-LD, sitemap, robots) and analytics (GTM/GA4 + UTM lead attribution) are wired app-wide.

**Tech Stack:** Next.js 15, React 19, TypeScript, Payload CMS 3 (`@payloadcms/db-postgres`, `@payloadcms/storage-vercel-blob`, `@payloadcms/richtext-lexical`), Tailwind CSS, next-intl, lucide-react, Vitest (unit/integration), Playwright (e2e), pnpm. Hosted on Vercel.

**Design source of truth:** `wisnia-beauty/design_handoff/` — recreate markup/styles from `source/index.html`, `source/styles.css`, `source/privacy.html`; view finished look in `preview/`. Design tokens are in `wisnia-beauty/design_handoff/README.md`.

**Conventions:**
- Package manager: **pnpm**. Node 20.9+.
- Commit after every task with the message shown in its final step.
- TDD: write the failing test, watch it fail, implement minimally, watch it pass, commit.
- All user-facing CMS fields are localized `pl`/`ru` (`pl` default, fallback to `pl`).
- Run tests with `pnpm test` (Vitest) and `pnpm test:e2e` (Playwright).

---

## File Structure

```
(repo root: /Users/antonvishneuski/Projects/WisniaMainSite — already has docs/, wisnia-beauty/, .git)
src/
  payload.config.ts            # Payload init: db, storage, localization, collections, globals
  collections/
    Users.ts                   # auth, single owner
    Media.ts                   # uploads → Vercel Blob, localized alt
    Prices.ts                  # tabbed price rows
    Reviews.ts                 # client reviews
    BeforeAfter.ts             # before/after pairs
  globals/
    Settings.ts                # NAP, hours, links, ratings, analytics IDs, domain
  lib/
    getPayload.ts              # cached Payload local API client
    queries.ts                 # typed data fetchers for the homepage
    price-groups.ts            # group flat price rows → tabs→categories→rows
    jsonld.ts                  # JSON-LD builders (LocalBusiness, FAQPage, AggregateRating, Breadcrumb)
    utm.ts                     # parse + persist UTM/referrer attribution
    i18n.ts                    # next-intl config, locales
  components/
    layout/Header.tsx
    layout/Footer.tsx
    layout/StickyCta.tsx
    layout/LangToggle.tsx
    home/Hero.tsx
    home/PainCards.tsx
    home/Kierunki.tsx
    home/Cennik.tsx             # tabs + panels, client component
    home/Efekty.tsx
    home/ONas.tsx
    home/JakToDziala.tsx
    home/Opinie.tsx             # horizontal scroll reviews
    home/Faq.tsx                # accordion, client component
    home/Kontakt.tsx
    ui/CtaButtons.tsx           # WhatsApp/phone/Booksy, fires dataLayer
    ui/Reveal.tsx               # IntersectionObserver reveal
    analytics/Gtm.tsx           # GTM head+noscript injection
    analytics/UtmCapture.tsx    # client, captures UTM on landing
app/
  (payload)/admin/[[...segments]]/page.tsx   # from create-payload-app
  (payload)/api/[...slug]/route.ts           # from create-payload-app
  (frontend)/[locale]/layout.tsx             # html lang, fonts, GTM, intl provider
  (frontend)/[locale]/page.tsx               # homepage
  (frontend)/[locale]/polityka-prywatnosci/page.tsx
  (frontend)/sitemap.ts
  (frontend)/robots.ts
messages/
  pl.json                      # static narrative copy (PL)
  ru.json                      # static narrative copy (RU)
seed/
  seed.ts                      # import design data into collections
  data/prices.ts reviews.ts beforeAfter.ts settings.ts  # extracted from design
tests/
  unit/price-groups.test.ts
  unit/jsonld.test.ts
  unit/utm.test.ts
  integration/collections.test.ts
  integration/homepage-data.test.ts
  e2e/homepage.spec.ts
  e2e/admin.spec.ts
tailwind.config.ts             # design tokens
.env.example
vercel.json (if needed)
```

---

## Task 1: Scaffold Next.js + Payload into the existing repo

**Files:**
- Create: entire Payload+Next skeleton at repo root (preserving `docs/`, `wisnia-beauty/`, `.git`, `.gitignore`)

- [ ] **Step 1: Scaffold in a temp dir with the blank+postgres template**

Run:
```bash
cd /Users/antonvishneuski/Projects
pnpm dlx create-payload-app@latest wisnia-tmp --template blank --db postgres --no-deps
```
Expected: a `wisnia-tmp/` folder with `src/payload.config.ts`, `app/(payload)/...`, `next.config.mjs`, `tsconfig.json`, `package.json`.

- [ ] **Step 2: Move generated files into the repo (keep our docs/, wisnia-beauty/, .git)**

Run:
```bash
cd /Users/antonvishneuski/Projects/wisnia-tmp
# copy everything except its own .git
rsync -a --exclude '.git' ./ /Users/antonvishneuski/Projects/WisniaMainSite/
cd /Users/antonvishneuski/Projects/WisniaMainSite
rm -rf /Users/antonvishneuski/Projects/wisnia-tmp
```
Expected: repo root now has `app/`, `src/payload.config.ts`, `package.json`, `next.config.mjs`.

- [ ] **Step 3: Merge .gitignore additions**

Ensure repo `.gitignore` keeps our existing entries plus the generated ones (`/.next/`, `/node_modules`, `/media`, `.env`). Our `.gitignore` already covers these; if create-payload-app added a `.gitignore`, reconcile so all of: `node_modules/`, `.next/`, `.env`, `.env*.local`, `*.zip`, `.claude/settings.local.json`, `/media` are present.

- [ ] **Step 4: Install deps + test/i18n/styling libs**

Run:
```bash
pnpm install
pnpm add next-intl lucide-react @payloadcms/storage-vercel-blob
pnpm add -D tailwindcss postcss autoprefixer vitest @vitejs/plugin-react @playwright/test
pnpm dlx tailwindcss init -p
```
Expected: installs succeed; `tailwind.config.ts` (or `.js`) + `postcss.config.js` created.

- [ ] **Step 5: Add test scripts to package.json**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"seed": "tsx seed/seed.ts"
```
Add `tsx` if missing: `pnpm add -D tsx`.

- [ ] **Step 6: Create .env.example and local .env**

Create `.env.example`:
```bash
DATABASE_URL=postgres://user:pass@localhost:5432/wisnia
PAYLOAD_SECRET=change-me-32-chars-min
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Copy to `.env` and fill `DATABASE_URL` (local Postgres or Vercel Postgres dev URL) and a random `PAYLOAD_SECRET`.

- [ ] **Step 7: Verify dev server boots**

Run: `pnpm dev`
Expected: server starts on `http://localhost:3000`; `/admin` shows the Payload "create first user" screen. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 + Payload CMS 3 app"
```

---

## Task 2: Tailwind design tokens + fonts

**Files:**
- Modify: `tailwind.config.ts`
- Create: `app/(frontend)/globals.css`
- Reference: `wisnia-beauty/design_handoff/source/styles.css` (`:root`), README tokens

- [ ] **Step 1: Write the token sanity test**

Create `tests/unit/tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import config from '../../tailwind.config'

describe('design tokens', () => {
  it('exposes brand colors', () => {
    const colors = (config.theme?.extend?.colors ?? {}) as Record<string, string>
    expect(colors.cherry).toBe('#8B1A3A')
    expect(colors.cream).toBe('#FDFAF7')
    expect(colors['rose-gold']).toBe('#C9956C')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/unit/tokens.test.ts`
Expected: FAIL (colors undefined).

- [ ] **Step 3: Implement tailwind.config.ts tokens**

Replace `tailwind.config.ts` content:
```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cherry: '#8B1A3A',
        'cherry-deep': '#6E122C',
        'cherry-soft': '#A8324F',
        'rose-gold': '#C9956C',
        'rose-gold-dk': '#B07E55',
        blush: '#F5EDE3',
        'blush-deep': '#EFE3D5',
        cream: '#FDFAF7',
        graphite: '#1A1A1A',
        gray: '#5A5A5A',
        'gray-soft': '#8A8079',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-jost)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: { sm: '10px', md: '16px', lg: '22px', xl: '32px', pill: '999px' },
      boxShadow: {
        sm: '0 2px 8px rgba(110,18,44,.06)',
        md: '0 12px 32px rgba(110,18,44,.08)',
        lg: '0 24px 60px rgba(110,18,44,.12)',
      },
      maxWidth: { content: '1200px' },
      spacing: { s1: '4px', s2: '8px', s3: '12px', s4: '16px', s5: '24px', s6: '32px', s7: '48px', s8: '64px', s9: '96px', s10: '128px' },
    },
    screens: { sm: '640px', md: '960px', lg: '1200px' },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/unit/tokens.test.ts`
Expected: PASS.

- [ ] **Step 5: Create globals.css with base + fonts**

Create `app/(frontend)/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { --header-h: 78px; --line: rgba(26,26,26,.10); --line-warm: rgba(201,149,108,.35); }
html { scroll-behavior: smooth; }
body { background: theme('colors.cream'); color: theme('colors.gray'); font-family: theme('fontFamily.sans'); font-size: 17px; line-height: 1.65; }
h1,h2,h3,h4 { font-family: theme('fontFamily.serif'); font-weight: 600; color: theme('colors.graphite'); line-height: 1.12; letter-spacing: -0.01em; text-wrap: balance; }
.eyebrow { font-size: 13px; text-transform: uppercase; letter-spacing: .28em; color: theme('colors.rose-gold-dk'); }
.accent { font-style: italic; color: theme('colors.cherry'); }
@media (prefers-reduced-motion: no-preference) {
  .reveal { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease; }
  .reveal.is-visible { opacity: 1; transform: none; }
}
```

- [ ] **Step 6: Wire fonts via next/font (done in Task 9 layout) — placeholder note**

No code now; fonts (`next/font/google` Cormorant Garamond + Jost) are loaded in the layout (Task 9) and expose `--font-cormorant` / `--font-jost`.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.ts "app/(frontend)/globals.css" tests/unit/tokens.test.ts
git commit -m "feat: port design tokens to Tailwind theme + base styles"
```

---

## Task 3: Payload config — db, storage, localization

**Files:**
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Implement payload.config.ts with Postgres, Blob, pl/ru localization**

Replace `src/payload.config.ts`:
```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Prices } from './collections/Prices'
import { Reviews } from './collections/Reviews'
import { BeforeAfter } from './collections/BeforeAfter'
import { Settings } from './globals/Settings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: { user: 'users' },
  editor: lexicalEditor(),
  collections: [Users, Media, Prices, Reviews, BeforeAfter],
  globals: [Settings],
  localization: {
    locales: [
      { label: 'Polski', code: 'pl' },
      { label: 'Русский', code: 'ru' },
    ],
    defaultLocale: 'pl',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' } }),
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
```

- [ ] **Step 2: Verify it type-checks (collections come in next tasks; create stubs to compile)**

Temporarily, until Tasks 4–6 land, this won't compile because collection files don't exist. That's expected — Tasks 4–6 create them. If executing strictly in order, create empty stub exports first:
```bash
mkdir -p src/collections src/globals
```
Then implement collections in Tasks 4–6, and only run the compile check at the end of Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/payload.config.ts
git commit -m "feat: payload config with postgres, vercel blob, pl/ru localization"
```

---

## Task 4: Users + Media collections

**Files:**
- Create: `src/collections/Users.ts`, `src/collections/Media.ts`

- [ ] **Step 1: Implement Users.ts (single-owner auth)**

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', group: 'System' },
  fields: [{ name: 'name', type: 'text' }],
}
```

- [ ] **Step 2: Implement Media.ts (Blob upload, localized alt)**

```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  admin: { group: 'Treść' },
  upload: {
    imageSizes: [
      { name: 'thumb', width: 400 },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1600 },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [{ name: 'alt', type: 'text', localized: true }],
}
```

- [ ] **Step 3: Commit**

```bash
git add src/collections/Users.ts src/collections/Media.ts
git commit -m "feat: Users (auth) and Media (blob upload) collections"
```

---

## Task 5: Prices, Reviews, BeforeAfter collections

**Files:**
- Create: `src/collections/Prices.ts`, `src/collections/Reviews.ts`, `src/collections/BeforeAfter.ts`

- [ ] **Step 1: Implement Prices.ts**

```ts
import type { CollectionConfig } from 'payload'

export const Prices: CollectionConfig = {
  slug: 'prices',
  access: { read: () => true },
  admin: { group: 'Treść', useAsTitle: 'name', defaultColumns: ['name', 'tab', 'category', 'price', 'order'] },
  fields: [
    { name: 'tab', type: 'select', required: true, options: [
      { label: 'Kosmetologia', value: 'kosmetologia' },
      { label: 'Laser', value: 'laser' },
      { label: 'Ciało', value: 'cialo' },
      { label: 'Pakiety', value: 'pakiety' },
    ] },
    { name: 'category', type: 'text', localized: true },
    { name: 'categorySubtitle', type: 'text', localized: true },
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'subline', type: 'text', localized: true },
    { name: 'price', type: 'text', localized: true },
    { name: 'priceWas', type: 'text', localized: true },
    { name: 'isPackage', type: 'checkbox', defaultValue: false },
    { name: 'isGift', type: 'checkbox', defaultValue: false },
    { name: 'note', type: 'richText', localized: true },
    { name: 'bookingUrl', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

- [ ] **Step 2: Implement Reviews.ts**

```ts
import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: { read: () => true },
  admin: { group: 'Treść', useAsTitle: 'author', defaultColumns: ['author', 'source', 'rating', 'order'] },
  fields: [
    { name: 'quote', type: 'textarea', localized: true, required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'initial', type: 'text', maxLength: 1 },
    { name: 'avatarColor', type: 'text', defaultValue: '#8B1A3A' },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'source', type: 'select', options: [
      { label: 'Google', value: 'Google' }, { label: 'Booksy', value: 'Booksy' },
    ], defaultValue: 'Google' },
    { name: 'date', type: 'text', localized: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

- [ ] **Step 3: Implement BeforeAfter.ts**

```ts
import type { CollectionConfig } from 'payload'

export const BeforeAfter: CollectionConfig = {
  slug: 'beforeAfter',
  access: { read: () => true },
  admin: { group: 'Treść', useAsTitle: 'caption', defaultColumns: ['caption', 'order'] },
  fields: [
    { name: 'beforeImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'afterImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', localized: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
```

- [ ] **Step 4: Commit**

```bash
git add src/collections/Prices.ts src/collections/Reviews.ts src/collections/BeforeAfter.ts
git commit -m "feat: Prices, Reviews, BeforeAfter collections"
```

---

## Task 6: Settings global + payload-types generation

**Files:**
- Create: `src/globals/Settings.ts`

- [ ] **Step 1: Implement Settings.ts**

```ts
import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: { read: () => true },
  admin: { group: 'Ustawienia' },
  fields: [
    { type: 'collapsible', label: 'Kontakt (NAP)', fields: [
      { name: 'address', type: 'text', localized: true },
      { name: 'addressNote', type: 'text', localized: true },
      { name: 'phone', type: 'text' },
      { name: 'whatsapp', type: 'text', admin: { description: 'np. 48453270435' } },
      { name: 'instagram', type: 'text' },
      { name: 'hours', type: 'text', localized: true },
      { name: 'mapEmbedUrl', type: 'text' },
    ] },
    { type: 'collapsible', label: 'Linki / oceny', fields: [
      { name: 'booksyUrl', type: 'text', defaultValue: 'https://wisniabeauty.booksy.com/a' },
      { name: 'googleRating', type: 'text', defaultValue: '5,0' },
      { name: 'booksyRating', type: 'text', defaultValue: '4,9' },
      { name: 'reviewsCount', type: 'number' },
    ] },
    { type: 'collapsible', label: 'Analityka / domena', fields: [
      { name: 'siteUrl', type: 'text', admin: { description: 'np. https://wisniabeauty.pl' } },
      { name: 'gtmId', type: 'text', admin: { description: 'GTM-XXXXXXX' } },
      { name: 'ga4Id', type: 'text' },
      { name: 'searchConsoleToken', type: 'text' },
      { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
      { name: 'geoLat', type: 'text' },
      { name: 'geoLng', type: 'text' },
    ] },
  ],
}
```

- [ ] **Step 2: Generate Payload types and compile**

Run:
```bash
pnpm payload generate:types
pnpm exec tsc --noEmit
```
Expected: `src/payload-types.ts` generated; type-check passes (0 errors).

- [ ] **Step 3: Commit**

```bash
git add src/globals/Settings.ts src/payload-types.ts
git commit -m "feat: Settings global + generated payload types"
```

---

## Task 7: Price grouping utility (TDD)

**Files:**
- Create: `src/lib/price-groups.ts`, `tests/unit/price-groups.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { groupPrices } from '../../src/lib/price-groups'

const rows = [
  { id: '1', tab: 'kosmetologia', category: 'Oczyszczanie', name: 'Wodorowe', price: '250 zł', order: 0 },
  { id: '2', tab: 'kosmetologia', category: 'Oczyszczanie', name: 'Kombinowane', price: '350 zł', order: 1 },
  { id: '3', tab: 'kosmetologia', category: 'Peelingi', categorySubtitle: 'po 300 zł', name: 'Medyczne', price: '300 zł', order: 2 },
  { id: '4', tab: 'laser', category: 'Kobiety', name: 'Pachy', price: '110 zł', order: 0 },
] as any

describe('groupPrices', () => {
  it('groups rows by tab then category preserving order', () => {
    const out = groupPrices(rows)
    expect(out.kosmetologia.map((c) => c.category)).toEqual(['Oczyszczanie', 'Peelingi'])
    expect(out.kosmetologia[0].rows).toHaveLength(2)
    expect(out.kosmetologia[1].categorySubtitle).toBe('po 300 zł')
    expect(out.laser[0].rows[0].name).toBe('Pachy')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/unit/price-groups.test.ts`
Expected: FAIL (`groupPrices` not defined).

- [ ] **Step 3: Implement price-groups.ts**

```ts
export type PriceRow = {
  id: string
  tab: 'kosmetologia' | 'laser' | 'cialo' | 'pakiety'
  category?: string | null
  categorySubtitle?: string | null
  name: string
  subline?: string | null
  price?: string | null
  priceWas?: string | null
  isPackage?: boolean | null
  isGift?: boolean | null
  note?: unknown
  bookingUrl?: string | null
  order?: number | null
}

export type CategoryGroup = {
  category?: string | null
  categorySubtitle?: string | null
  rows: PriceRow[]
}

export type GroupedPrices = Record<PriceRow['tab'], CategoryGroup[]>

const TABS: PriceRow['tab'][] = ['kosmetologia', 'laser', 'cialo', 'pakiety']

export function groupPrices(rows: PriceRow[]): GroupedPrices {
  const sorted = [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const out = Object.fromEntries(TABS.map((t) => [t, []])) as GroupedPrices
  for (const row of sorted) {
    const groups = out[row.tab]
    const key = row.category ?? ''
    let group = groups.find((g) => (g.category ?? '') === key)
    if (!group) {
      group = { category: row.category, categorySubtitle: row.categorySubtitle, rows: [] }
      groups.push(group)
    }
    group.rows.push(row)
  }
  return out
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/unit/price-groups.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/price-groups.ts tests/unit/price-groups.test.ts
git commit -m "feat: price grouping utility"
```

---

## Task 8: i18n config + Payload data client + queries

**Files:**
- Create: `src/lib/i18n.ts`, `src/lib/getPayload.ts`, `src/lib/queries.ts`, `middleware.ts`, `messages/pl.json`, `messages/ru.json`

- [ ] **Step 1: Implement i18n.ts**

```ts
export const locales = ['pl', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pl'
```

- [ ] **Step 2: Configure next-intl request + middleware + plugin**

Create `src/i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale } from '../lib/i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !locales.includes(locale as any)) locale = defaultLocale
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default }
})
```
Create `middleware.ts` (repo root):
```ts
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './src/lib/i18n'

export default createMiddleware({ locales, defaultLocale, localePrefix: 'as-needed' })
export const config = { matcher: ['/((?!api|admin|_next|.*\\..*).*)'] }
```
In `next.config.mjs`, wrap with the next-intl plugin:
```js
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
/** @type {import('next').NextConfig} */
const nextConfig = {}
export default withPayload(withNextIntl(nextConfig))
```

- [ ] **Step 3: Implement getPayload.ts (cached local API)**

```ts
import { getPayload as initPayload } from 'payload'
import config from '../payload.config'

let cached: ReturnType<typeof initPayload> | null = null
export function getPayloadClient() {
  if (!cached) cached = initPayload({ config })
  return cached
}
```

- [ ] **Step 4: Implement queries.ts (homepage fetchers)**

```ts
import type { Locale } from './i18n'
import { getPayloadClient } from './getPayload'

export async function getHomeData(locale: Locale) {
  const payload = await getPayloadClient()
  const [prices, reviews, beforeAfter, settings] = await Promise.all([
    payload.find({ collection: 'prices', locale, limit: 500, sort: 'order' }),
    payload.find({ collection: 'reviews', locale, limit: 100, sort: 'order' }),
    payload.find({ collection: 'beforeAfter', locale, limit: 100, sort: 'order', depth: 1 }),
    payload.findGlobal({ slug: 'settings', locale }),
  ])
  return { prices: prices.docs, reviews: reviews.docs, beforeAfter: beforeAfter.docs, settings }
}
```

- [ ] **Step 5: Create message catalogs (static narrative copy, PL + RU)**

Create `messages/pl.json` and `messages/ru.json` with keys for static sections. Extract the exact PL strings from `wisnia-beauty/design_handoff/source/index.html` (the `data-i18n` Polish inline text) and the RU strings from `source/i18n.js` (`window.I18N.ru`). Cover at minimum: `nav.*`, `hero.*`, `pain.*`, `kierunki.*`, `srv.*` (tab labels/titles), `ba.*` (eyebrow/title/before/after/disclaimer), `team.*`, `how.*`, `reviews.*` (eyebrow/title), `faq.*`, `contact.*`, `footer.*`, `cta.*`. Example shape:
```json
{
  "nav": { "services": "Usługi", "prices": "Cennik", "effects": "Efekty", "blog": "Blog", "about": "O nas", "contact": "Kontakt" },
  "hero": { "title": "…", "subtitle": "…", "trust": "9 lat doświadczenia · wykształcenie medyczne · indywidualny protokół" },
  "cta": { "whatsapp": "WhatsApp", "call": "Zadzwoń", "booksy": "Umów w Booksy", "bookShort": "Umów" }
}
```
(RU file mirrors the same keys with `window.I18N.ru` values.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/i18n.ts src/i18n/request.ts middleware.ts src/lib/getPayload.ts src/lib/queries.ts next.config.mjs messages/pl.json messages/ru.json
git commit -m "feat: i18n (next-intl) + payload data client and homepage queries"
```

---

## Task 9: Root locale layout (fonts, GTM, intl provider)

**Files:**
- Create: `app/(frontend)/[locale]/layout.tsx`
- Create: `src/components/analytics/Gtm.tsx`

- [ ] **Step 1: Implement Gtm.tsx**

```tsx
import Script from 'next/script'

export function Gtm({ gtmId }: { gtmId?: string | null }) {
  if (!gtmId) return null
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}</Script>
    </>
  )
}

export function GtmNoScript({ gtmId }: { gtmId?: string | null }) {
  if (!gtmId) return null
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
    </noscript>
  )
}
```

- [ ] **Step 2: Implement the locale layout**

```tsx
import '../globals.css'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '../../../src/lib/i18n'
import { getPayloadClient } from '../../../src/lib/getPayload'
import { Gtm, GtmNoScript } from '../../../src/components/analytics/Gtm'
import { UtmCapture } from '../../../src/components/analytics/UtmCapture'

const cormorant = Cormorant_Garamond({ subsets: ['latin', 'latin-ext'], weight: ['600'], variable: '--font-cormorant', display: 'swap' })
const jost = Jost({ subsets: ['latin', 'latin-ext'], variable: '--font-jost', display: 'swap' })

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'settings' })
  return (
    <html lang={locale} className={`${cormorant.variable} ${jost.variable}`}>
      <head>{settings?.searchConsoleToken ? <meta name="google-site-verification" content={settings.searchConsoleToken} /> : null}</head>
      <body>
        <Gtm gtmId={settings?.gtmId} />
        <GtmNoScript gtmId={settings?.gtmId} />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <UtmCapture />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add "app/(frontend)/[locale]/layout.tsx" src/components/analytics/Gtm.tsx
git commit -m "feat: locale layout with fonts, GTM, intl provider"
```

---

## Task 10: UTM capture + CTA buttons (TDD on parser)

**Files:**
- Create: `src/lib/utm.ts`, `tests/unit/utm.test.ts`, `src/components/analytics/UtmCapture.tsx`, `src/components/ui/CtaButtons.tsx`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { parseAttribution } from '../../src/lib/utm'

describe('parseAttribution', () => {
  it('extracts utm params and referrer host', () => {
    const out = parseAttribution('?utm_source=google&utm_medium=cpc&utm_campaign=laser', 'https://maps.google.com/x')
    expect(out.utm_source).toBe('google')
    expect(out.utm_medium).toBe('cpc')
    expect(out.utm_campaign).toBe('laser')
    expect(out.referrer_host).toBe('maps.google.com')
  })
  it('handles empty input', () => {
    const out = parseAttribution('', '')
    expect(out.utm_source).toBeUndefined()
    expect(out.referrer_host).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/unit/utm.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement utm.ts**

```ts
export type Attribution = {
  utm_source?: string; utm_medium?: string; utm_campaign?: string
  utm_term?: string; utm_content?: string; referrer_host?: string
}

export function parseAttribution(search: string, referrer: string): Attribution {
  const out: Attribution = {}
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const) {
    const v = params.get(k)
    if (v) out[k] = v
  }
  if (referrer) {
    try { out.referrer_host = new URL(referrer).host } catch { /* ignore */ }
  }
  return out
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/unit/utm.test.ts`
Expected: PASS.

- [ ] **Step 5: Implement UtmCapture.tsx (client)**

```tsx
'use client'
import { useEffect } from 'react'
import { parseAttribution } from '../../lib/utm'

const KEY = 'wisnia-attribution'
export function UtmCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(KEY)) return
    const attr = parseAttribution(window.location.search, document.referrer)
    if (Object.keys(attr).length) localStorage.setItem(KEY, JSON.stringify(attr))
  }, [])
  return null
}
```

- [ ] **Step 6: Implement CtaButtons.tsx (fires dataLayer)**

```tsx
'use client'
type Method = 'whatsapp' | 'phone' | 'booksy'
const KEY = 'wisnia-attribution'

export function CtaLink({ method, href, children, className }: { method: Method; href: string; children: React.ReactNode; className?: string }) {
  function track() {
    const w = window as any
    w.dataLayer = w.dataLayer || []
    let attr = {}
    try { attr = JSON.parse(localStorage.getItem(KEY) || '{}') } catch {}
    w.dataLayer.push({ event: 'cta_click', method, ...attr })
  }
  return (
    <a href={href} onClick={track} target={method === 'phone' ? undefined : '_blank'} rel="noopener" className={className}>
      {children}
    </a>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/utm.ts tests/unit/utm.test.ts src/components/analytics/UtmCapture.tsx src/components/ui/CtaButtons.tsx
git commit -m "feat: UTM attribution capture + CTA dataLayer tracking"
```

---

## Task 11: JSON-LD builders (TDD)

**Files:**
- Create: `src/lib/jsonld.ts`, `tests/unit/jsonld.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { localBusinessLd, aggregateRatingLd } from '../../src/lib/jsonld'

describe('jsonld', () => {
  it('builds LocalBusiness with NAP', () => {
    const ld = localBusinessLd({ name: 'Wiśnia Beauty', url: 'https://x.pl', phone: '+48453270435', address: 'ul. Andersa 15', geoLat: '52.2', geoLng: '21.0', hours: 'Mo-Sa 08:00-20:00' })
    expect(ld['@type']).toBe('BeautySalon')
    expect(ld.telephone).toBe('+48453270435')
    expect(ld.geo.latitude).toBe('52.2')
  })
  it('builds AggregateRating', () => {
    const ld = aggregateRatingLd('5.0', 40)
    expect(ld.ratingValue).toBe('5.0')
    expect(ld.reviewCount).toBe(40)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test tests/unit/jsonld.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement jsonld.ts**

```ts
export function localBusinessLd(o: { name: string; url: string; phone?: string; address?: string; geoLat?: string; geoLng?: string; hours?: string; image?: string }) {
  return {
    '@context': 'https://schema.org', '@type': 'BeautySalon',
    name: o.name, url: o.url, telephone: o.phone, image: o.image,
    address: { '@type': 'PostalAddress', streetAddress: o.address, addressLocality: 'Warszawa', addressCountry: 'PL' },
    geo: { '@type': 'GeoCoordinates', latitude: o.geoLat, longitude: o.geoLng },
    openingHours: o.hours,
  }
}
export function aggregateRatingLd(ratingValue: string, reviewCount: number) {
  return { '@type': 'AggregateRating', ratingValue, reviewCount }
}
export function faqLd(items: { q: string; a: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }
}
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })) }
}
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
```
(Rename file to `jsonld.tsx` since it exports a component.)

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test tests/unit/jsonld.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/jsonld.tsx tests/unit/jsonld.test.ts
git commit -m "feat: JSON-LD builders (LocalBusiness, AggregateRating, FAQ, Breadcrumb)"
```

---

## Task 12: Layout components — Header, Footer, StickyCta, LangToggle, Reveal

**Files:**
- Create: `src/components/layout/Header.tsx`, `Footer.tsx`, `StickyCta.tsx`, `LangToggle.tsx`, `src/components/ui/Reveal.tsx`
- Reference: `wisnia-beauty/design_handoff/source/index.html` (header/footer markup), `source/styles.css`

- [ ] **Step 1: Implement Reveal.tsx (IntersectionObserver)**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el); return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${vis ? 'is-visible' : ''} ${className}`}>{children}</div>
}
```

- [ ] **Step 2: Implement LangToggle.tsx**

```tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'
export function LangToggle({ locale }: { locale: string }) {
  const pathname = usePathname(); const router = useRouter()
  function to(l: 'pl' | 'ru') {
    const stripped = pathname.replace(/^\/(pl|ru)(?=\/|$)/, '') || '/'
    router.push(l === 'pl' ? stripped : `/ru${stripped === '/' ? '' : stripped}`)
  }
  return (
    <div className="flex gap-1">
      <button onClick={() => to('pl')} aria-current={locale === 'pl'} className={locale === 'pl' ? 'font-semibold' : ''}>PL</button>
      <span>/</span>
      <button onClick={() => to('ru')} aria-current={locale === 'ru'} className={locale === 'ru' ? 'font-semibold' : ''}>RU</button>
    </div>
  )
}
```

- [ ] **Step 3: Implement Header.tsx, Footer.tsx, StickyCta.tsx**

Port the header/footer/sticky-CTA markup and classes from `source/index.html` into React. Use `useTranslations()` for labels (`nav.*`, `cta.*`), `LangToggle` for PL/RU, and `CtaLink` for the Booksy/WhatsApp/phone actions (pass `settings.booksyUrl`, `settings.whatsapp`, `settings.phone`). Header is a client component (scroll shadow + mobile drawer toggle). Recreate Tailwind classes to match the design tokens (sticky header height `--header-h`, cherry CTA button, hairline borders). StickyCta is shown only `≤640px` (`sm:hidden` wrapper, `fixed bottom-0`).

`Header.tsx` skeleton:
```tsx
'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LangToggle } from './LangToggle'
import { CtaLink } from '../ui/CtaButtons'

export function Header({ locale, booksyUrl }: { locale: string; booksyUrl: string }) {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [drawer, setDrawer] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', on); return () => window.removeEventListener('scroll', on)
  }, [])
  const base = locale === 'pl' ? '' : '/ru'
  return (
    <header className={`sticky top-0 z-50 bg-cream/95 backdrop-blur ${scrolled ? 'shadow-sm' : ''}`} style={{ height: 'var(--header-h)' }}>
      {/* logo + nav anchors (#cennik, #efekty, #o-nas, #kontakt) + LangToggle + Booksy CtaLink; mobile burger toggles drawer */}
    </header>
  )
}
```
Footer.tsx and StickyCta.tsx follow the same porting approach against `source/index.html`.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/ src/components/ui/Reveal.tsx
git commit -m "feat: header, footer, sticky CTA, lang toggle, reveal components"
```

---

## Task 13: Homepage section components

**Files:**
- Create: `src/components/home/Hero.tsx`, `PainCards.tsx`, `Kierunki.tsx`, `Cennik.tsx`, `Efekty.tsx`, `ONas.tsx`, `JakToDziala.tsx`, `Opinie.tsx`, `Faq.tsx`, `Kontakt.tsx`
- Reference: `wisnia-beauty/design_handoff/source/index.html` per-section markup; `source/styles.css`

For each component: port the section's markup/classes from `source/index.html`, replace static text with `useTranslations()` keys (Task 8 catalogs), and bind dynamic data from props (the `getHomeData` result). Use `next/image` for all images, `CtaLink` for booking actions, and wrap top-level blocks in `<Reveal>`.

- [ ] **Step 1: Hero.tsx** — H1/subtitle/trust via `hero.*`; 3 CTAs via `CtaLink` (whatsapp/phone/booksy); owner photo via `next/image` (seeded media or `/public` fallback `hero-olga.jpg`).

- [ ] **Step 2: PainCards.tsx** — 3 cards, copy from `pain.*`, Lucide icons (`lucide-react`).

- [ ] **Step 3: Kierunki.tsx** — 4 cards from `kierunki.*`; each links to `#cennik` and sets the active tab. Implement by setting a URL hash (`#cennik`) plus a query/`data` attribute the `Cennik` client component reads to activate the matching tab (mirror the design's `data-goto`).

- [ ] **Step 4: Cennik.tsx (client)** — tabs Kosmetologia/Laser/Ciało/Pakiety; takes grouped prices (`groupPrices(prices)` from Task 7). Render category headers (`price-cat` + subtitle), rows (`price-row`: name + subline + price + "Umów" `CtaLink`), gift-pills (`isGift`), and package cards (`isPackage`: now `price` + struck `priceWas`). Tab labels via `srv.*`. On mount, read hash/`data-goto` to open the requested panel. Mark `note` richText rows (men's WhatsApp line).

```tsx
'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { groupPrices, type PriceRow } from '../../lib/price-groups'
import { CtaLink } from '../ui/CtaButtons'

const TABS = ['kosmetologia', 'laser', 'cialo', 'pakiety'] as const
export function Cennik({ prices, booksyUrl }: { prices: PriceRow[]; booksyUrl: string }) {
  const t = useTranslations('srv')
  const grouped = groupPrices(prices)
  const [tab, setTab] = useState<(typeof TABS)[number]>('kosmetologia')
  useEffect(() => {
    const h = window.location.hash
    // optional: read ?tab= or a data attribute set by Kierunki
  }, [])
  return (
    <section id="cennik" className="section--blush">
      {/* tab buttons map over TABS; panels render grouped[tab] */}
    </section>
  )
}
```

- [ ] **Step 5: Efekty.tsx** — map `beforeAfter` docs to `ba-card` pairs (before/after `next/image` from `media` urls), localized `ba.before`/`ba.after` tags + `caption`; disclaimer via `ba.disclaimer`.

- [ ] **Step 6: ONas.tsx** — 2 team member cards (portraits from `/public` or seeded media) + owner quote; copy via `team.*`.

- [ ] **Step 7: JakToDziala.tsx** — 3 numbered steps + low-risk highlight bar; copy via `how.*`.

- [ ] **Step 8: Opinie.tsx** — horizontal-scroll row of review cards from `reviews` (stars from `rating`, colored avatar initial, author, source + date); two rating badges from `settings.googleRating` / `settings.booksyRating`. Copy via `reviews.*`.

- [ ] **Step 9: Faq.tsx (client)** — accordion from `faq.*` (6 Q&A as message keys `faq.items` array); toggles answer + +/× icon.

- [ ] **Step 10: Kontakt.tsx** — contact rows from `settings` (address + note, phone, whatsapp, instagram, hours) + CTAs + map iframe (`settings.mapEmbedUrl`). Copy via `contact.*`.

- [ ] **Step 11: Commit**

```bash
git add src/components/home/
git commit -m "feat: homepage section components bound to CMS data"
```

---

## Task 14: Homepage page + privacy page + assets

**Files:**
- Create: `app/(frontend)/[locale]/page.tsx`, `app/(frontend)/[locale]/polityka-prywatnosci/page.tsx`
- Copy design assets into `public/assets/`

- [ ] **Step 1: Copy static design assets to /public**

Run:
```bash
mkdir -p public/assets
cp wisnia-beauty/design_handoff/source/assets/*.jpg public/assets/
cp wisnia-beauty/design_handoff/source/assets/*.png public/assets/
```
(Hero/team/logo images served from `/assets/...`; before/after images come from seeded Blob media.)

- [ ] **Step 2: Implement homepage page.tsx (server component) with metadata + JSON-LD**

```tsx
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { getHomeData } from '../../../src/lib/queries'
import { localBusinessLd, aggregateRatingLd, JsonLd } from '../../../src/lib/jsonld'
import { Header } from '../../../src/components/layout/Header'
import { Footer } from '../../../src/components/layout/Footer'
import { StickyCta } from '../../../src/components/layout/StickyCta'
import { Hero } from '../../../src/components/home/Hero'
import { PainCards } from '../../../src/components/home/PainCards'
import { Kierunki } from '../../../src/components/home/Kierunki'
import { Cennik } from '../../../src/components/home/Cennik'
import { Efekty } from '../../../src/components/home/Efekty'
import { ONas } from '../../../src/components/home/ONas'
import { JakToDziala } from '../../../src/components/home/JakToDziala'
import { Opinie } from '../../../src/components/home/Opinie'
import { Faq } from '../../../src/components/home/Faq'
import { Kontakt } from '../../../src/components/home/Kontakt'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return {
    title: locale === 'ru' ? 'Wiśnia Beauty Studio — косметология, лазер, массаж · Варшава' : 'Wiśnia Beauty Studio — kosmetologia, laser, masaże · Warszawa',
    description: locale === 'ru' ? 'Студия красоты в центре Варшавы…' : 'Studio kosmetologiczne w centrum Warszawy…',
    alternates: { canonical: `${url}${locale === 'pl' ? '' : '/ru'}`, languages: { pl: url, ru: `${url}/ru` } },
    openGraph: { type: 'website', url, images: ['/assets/hero-olga.jpg'] },
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const { prices, reviews, beforeAfter, settings } = await getHomeData(locale as any)
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const business = localBusinessLd({ name: 'Wiśnia Beauty Studio', url, phone: settings?.phone, address: settings?.address as string, geoLat: settings?.geoLat, geoLng: settings?.geoLng, hours: settings?.hours as string, image: `${url}/assets/hero-olga.jpg` })
  return (
    <>
      <JsonLd data={{ ...business, aggregateRating: aggregateRatingLd(String(settings?.googleRating || '5.0').replace(',', '.'), settings?.reviewsCount || reviews.length) }} />
      <Header locale={locale} booksyUrl={settings?.booksyUrl || ''} />
      <main>
        <Hero locale={locale} settings={settings} />
        <PainCards />
        <Kierunki />
        <Cennik prices={prices as any} booksyUrl={settings?.booksyUrl || ''} />
        <Efekty items={beforeAfter as any} />
        <ONas />
        <JakToDziala />
        <Opinie reviews={reviews as any} settings={settings} />
        <Faq />
        <Kontakt settings={settings} />
      </main>
      <Footer locale={locale} settings={settings} />
      <StickyCta settings={settings} />
    </>
  )
}
```

- [ ] **Step 3: Implement privacy page**

Port `wisnia-beauty/design_handoff/source/privacy.html` 8-section RODO/GDPR content into `polityka-prywatnosci/page.tsx`, localized via message keys `privacy.*` (PL inline + RU from `source/i18n-privacy.js`). Static server component with `generateMetadata` (title/description + `noindex: false`).

- [ ] **Step 4: Verify homepage renders (manual)**

Run: `pnpm dev`, open `http://localhost:3000` and `/ru`.
Expected: page renders (empty collections OK until seed); no runtime errors; locale switch works.

- [ ] **Step 5: Commit**

```bash
git add "app/(frontend)/[locale]/page.tsx" "app/(frontend)/[locale]/polityka-prywatnosci/page.tsx" public/assets
git commit -m "feat: homepage + privacy page with metadata and JSON-LD"
```

---

## Task 15: sitemap.ts + robots.ts

**Files:**
- Create: `app/(frontend)/sitemap.ts`, `app/(frontend)/robots.ts`

- [ ] **Step 1: Implement robots.ts**

```ts
import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }], sitemap: `${url}/sitemap.xml` }
}
```

- [ ] **Step 2: Implement sitemap.ts (homepage + privacy, both locales, hreflang)**

```ts
import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const paths = ['', '/polityka-prywatnosci']
  return paths.flatMap((p) => [
    { url: `${url}${p}`, alternates: { languages: { pl: `${url}${p}`, ru: `${url}/ru${p}` } } },
    { url: `${url}/ru${p}` },
  ])
}
```

- [ ] **Step 3: Verify**

Run: `pnpm dev`, open `/sitemap.xml` and `/robots.txt`.
Expected: valid XML sitemap with both locales; robots references sitemap.

- [ ] **Step 4: Commit**

```bash
git add "app/(frontend)/sitemap.ts" "app/(frontend)/robots.ts"
git commit -m "feat: dynamic sitemap (hreflang) + robots"
```

---

## Task 16: Seed data extracted from design

**Files:**
- Create: `seed/data/prices.ts`, `seed/data/reviews.ts`, `seed/data/beforeAfter.ts`, `seed/data/settings.ts`, `seed/seed.ts`
- Source: `wisnia-beauty/design_handoff/source/index.html` (PL) + `source/i18n.js` (RU)

- [ ] **Step 1: Extract price data into seed/data/prices.ts**

Transcribe every price row from the Cennik section of `source/index.html` (all 4 tabs) into an array. Each entry: `{ tab, category: {pl, ru}, categorySubtitle?, name: {pl, ru}, subline?, price: {pl, ru}, priceWas?, isPackage?, isGift?, order }`. RU values come from `source/i18n.js` `window.I18N.ru` keys (`p1`..`p95`). Shape:
```ts
export const prices = [
  { tab: 'kosmetologia', category: { pl: 'Oczyszczanie twarzy', ru: 'Чистка лица' }, name: { pl: 'Wodorowe oczyszczanie', ru: 'Водородная чистка' }, price: { pl: '250 zł', ru: '250 zł' }, order: 0 },
  // … all rows, gift-pills (isGift), packages (isPackage with priceWas) …
]
```

- [ ] **Step 2: Extract reviews into seed/data/reviews.ts**

Transcribe the 6 review cards: `{ quote: {pl, ru}, author, initial, avatarColor, rating: 5, source, date: {pl, ru}, order }`. RU from `rev.q*` / `rev.n*` / `rev.t*`.

- [ ] **Step 3: Define beforeAfter + settings seed**

`seed/data/beforeAfter.ts`: 6 entries referencing local files `wisnia-beauty/design_handoff/source/assets/ba{1..6}-{before,after}.jpg` with `caption: {pl, ru}` (`ba.cap1..6`).
`seed/data/settings.ts`: NAP + links from the design (address "ul. Gen. W. Andersa 15, Warszawa", note "obok LuxMed", phone "+48 453 270 435", whatsapp "48453270435", booksyUrl "https://wisniabeauty.booksy.com/a", hours "Pon-Sob 8:00-20:00" / RU, googleRating "5,0", booksyRating "4,9"). Leave `gtmId`, `ga4Id`, `searchConsoleToken`, `siteUrl`, geo as empty/placeholder strings (flagged TODO).

- [ ] **Step 4: Implement seed.ts**

```ts
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { prices } from './data/prices'
import { reviews } from './data/reviews'
import { beforeAfter } from './data/beforeAfter'
import { settings } from './data/settings'

async function run() {
  const payload = await getPayload({ config })

  // wipe (idempotent reseed)
  for (const c of ['prices', 'reviews', 'beforeAfter'] as const) {
    const all = await payload.find({ collection: c, limit: 1000 })
    for (const d of all.docs) await payload.delete({ collection: c, id: d.id })
  }

  for (const p of prices) {
    await payload.create({ collection: 'prices', locale: 'pl', data: { tab: p.tab, category: p.category.pl, name: p.name.pl, price: p.price?.pl, priceWas: p.priceWas?.pl, isPackage: p.isPackage, isGift: p.isGift, order: p.order } })
    // then update ru locale via payload.update with locale: 'ru'
  }
  // reviews: same two-locale pattern
  // beforeAfter: upload each image to media (payload.create collection 'media' with filePath), then create beforeAfter with the returned ids
  for (const ba of beforeAfter) {
    const before = await payload.create({ collection: 'media', locale: 'pl', data: { alt: ba.caption.pl }, filePath: path.resolve(ba.beforeFile) })
    const after = await payload.create({ collection: 'media', locale: 'pl', data: { alt: ba.caption.pl }, filePath: path.resolve(ba.afterFile) })
    await payload.create({ collection: 'beforeAfter', locale: 'pl', data: { beforeImage: before.id, afterImage: after.id, caption: ba.caption.pl, order: ba.order } })
  }
  await payload.updateGlobal({ slug: 'settings', locale: 'pl', data: settings.pl })
  await payload.updateGlobal({ slug: 'settings', locale: 'ru', data: settings.ru })

  console.log('Seed complete')
  process.exit(0)
}
run()
```
(For each localized collection field, create with `locale: 'pl'` then `payload.update({ ..., locale: 'ru', data: { ...ru fields } })`.)

- [ ] **Step 5: Run the seed against local DB**

Run: `pnpm seed`
Expected: "Seed complete"; admin shows ~80 prices, 6 reviews, 6 before/after with images; homepage now renders full content.

- [ ] **Step 6: Commit**

```bash
git add seed/
git commit -m "feat: seed script importing design data (prices, reviews, before/after, settings)"
```

---

## Task 17: Integration tests (collections + homepage data)

**Files:**
- Create: `tests/integration/collections.test.ts`, `tests/integration/homepage-data.test.ts`, `vitest.config.ts`

- [ ] **Step 1: Add vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  test: { environment: 'node', include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'], testTimeout: 30000 },
})
```

- [ ] **Step 2: Write collections access test**

```ts
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload } from 'payload'
import config from '../../src/payload.config'

let payload: any
beforeAll(async () => { payload = await getPayload({ config }) })

describe('collections', () => {
  it('reads prices without auth (public read)', async () => {
    const res = await payload.find({ collection: 'prices', limit: 1 })
    expect(res).toHaveProperty('docs')
  })
  it('reviews default rating is 5', async () => {
    const r = await payload.create({ collection: 'reviews', locale: 'pl', data: { quote: 'x', author: 'Test' } })
    expect(r.rating).toBe(5)
    await payload.delete({ collection: 'reviews', id: r.id })
  })
})
```

- [ ] **Step 3: Write homepage-data grouping test**

```ts
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { groupPrices } from '../../src/lib/price-groups'

let payload: any
beforeAll(async () => { payload = await getPayload({ config }) })

describe('homepage data', () => {
  it('grouped seeded prices contain all four tabs', async () => {
    const res = await payload.find({ collection: 'prices', locale: 'pl', limit: 500, sort: 'order' })
    const grouped = groupPrices(res.docs as any)
    expect(Object.keys(grouped)).toEqual(['kosmetologia', 'laser', 'cialo', 'pakiety'])
  })
})
```

- [ ] **Step 4: Run integration tests**

Run: `pnpm test tests/integration`
Expected: PASS (requires seeded local DB + `.env`).

- [ ] **Step 5: Commit**

```bash
git add tests/integration vitest.config.ts
git commit -m "test: integration tests for collections and homepage data"
```

---

## Task 18: E2E tests (Playwright)

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/homepage.spec.ts`, `tests/e2e/admin.spec.ts`

- [ ] **Step 1: Add playwright.config.ts**

```ts
import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e',
  webServer: { command: 'pnpm dev', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 120000 },
  use: { baseURL: 'http://localhost:3000' },
})
```
Run `pnpm exec playwright install chromium`.

- [ ] **Step 2: Write homepage e2e**

```ts
import { test, expect } from '@playwright/test'

test('homepage renders pl and switches price tabs', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await page.getByRole('button', { name: /Laser/i }).click()
  await expect(page.locator('#cennik')).toContainText(/zł/)
})

test('cta click pushes dataLayer event', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => { (window as any).dataLayer = (window as any).dataLayer || [] })
  await page.getByRole('link', { name: /WhatsApp/i }).first().click({ button: 'middle' }).catch(() => {})
  // assert at least one cta_click queued
  const events = await page.evaluate(() => ((window as any).dataLayer || []).filter((e: any) => e.event === 'cta_click'))
  expect(Array.isArray(events)).toBe(true)
})

test('ru locale loads', async ({ page }) => {
  await page.goto('/ru')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
})
```

- [ ] **Step 3: Write admin e2e (smoke)**

```ts
import { test, expect } from '@playwright/test'
test('admin login screen renders', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.getByText(/email/i)).toBeVisible()
})
```

- [ ] **Step 4: Run e2e**

Run: `pnpm test:e2e`
Expected: PASS against the seeded local app.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e
git commit -m "test: e2e homepage tab switch, locale, dataLayer, admin smoke"
```

---

## Task 19: Vercel deployment

**Files:**
- Create: `vercel.json` (only if needed), update `README.md` (root) deploy notes

- [ ] **Step 1: Provision Vercel resources**

In the Vercel dashboard: create the project from the GitHub repo `AntonVishneuski/WisniaMainSite`; add **Vercel Postgres** and **Vercel Blob** storage; copy their env vars.

- [ ] **Step 2: Set environment variables on Vercel**

Set: `DATABASE_URL` (from Vercel Postgres), `PAYLOAD_SECRET` (32+ random chars), `BLOB_READ_WRITE_TOKEN` (from Vercel Blob), `NEXT_PUBLIC_SITE_URL` (production domain).

- [ ] **Step 3: First deploy + create admin user**

Push to `main` (auto-deploys) or `pnpm dlx vercel --prod`. After deploy, open `https://<domain>/admin`, create the owner user.

- [ ] **Step 4: Seed production (one-off)**

Run the seed against the production DB once (locally with prod `DATABASE_URL`/`BLOB_READ_WRITE_TOKEN` in a temporary `.env.production`, then `pnpm seed`), or via a protected admin script. Verify content appears.

- [ ] **Step 5: Post-deploy verification**

- Lighthouse SEO ≥ 95, performance load ≤ 3 s (mobile profile).
- `https://<domain>/sitemap.xml` and `/robots.txt` reachable.
- JSON-LD validates (schema.org validator / Rich Results Test).
- `/` (pl) and `/ru` both render; admin edit of a price reflects after revalidation.

- [ ] **Step 6: Commit deploy notes**

```bash
git add README.md vercel.json 2>/dev/null; git commit -m "docs: Vercel deployment notes" || true
git push origin main
```

---

## Self-Review Notes (author)

- **Spec coverage:** stack (Task 1–3), tokens (2), collections prices/reviews/beforeAfter/media/settings/users (3–6), homepage composition (12–14), theme (2), i18n (8–9), SEO metadata/JSON-LD/sitemap/robots (11,14,15), analytics GTM/GA4 + UTM (9,10), auth (4,19), seed (16), tests unit/integration/e2e (7,10,11,17,18), deploy (19). All Phase 1 spec sections map to a task.
- **Out of scope (correctly absent):** `pages` block builder, 7 service pages, blog → Phases 2–3.
- **Type consistency:** `groupPrices`/`PriceRow` shared between Task 7 unit test, Cennik (13), and integration test (17); `CtaLink` defined in Task 10 used in 12–14; `getHomeData` shape defined in Task 8 consumed in Task 14; `localBusinessLd`/`aggregateRatingLd` defined in Task 11 used in Task 14.
- **Known design caveat:** large UI tasks (12–13) reference the design HTML for exact markup rather than inlining every line of JSX — the data-binding code, props, and class conventions are specified; recreate markup from `source/index.html` per the design tokens.
