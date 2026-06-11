# Wiśnia Beauty — Phase 3: Expert Blog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual (pl/ru), SEO-optimized expert blog managed in Payload CMS — `posts` + `authors` collections, `/blog` index and `/blog/[slug]` article routes, E-E-A-T signals, `MedicalWebPage`+`BlogPosting` JSON-LD, TOC / reading time / related posts / RSS, seeded from the design handoff.

**Architecture:** Mirror the Phase 2 service-page architecture exactly. Next.js 16 App Router with a `[locale]` segment, Payload CMS 3 collections (Postgres + Vercel Blob), next-intl (localePrefix `as-needed`: pl unprefixed, ru `/ru`), ISR `revalidate=3600` + on-demand revalidation hooks, JSON-LD via the existing escaping `JsonLd` wrapper.

**Tech Stack:** Next.js 16.2.6, React 19, Payload 3.85 (`@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/storage-vercel-blob`), next-intl 4, Tailwind v4, Vitest, Playwright, pnpm.

---

## Conventions (apply to every task)

- **Working dir:** `/Users/antonvishneuski/Projects/WisniaMainSite/.claude/worktrees/phase1-core` (branch `worktree-phase1-core`, == main). Use **pnpm**.
- **Postgres bin:** `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"` before any seed/migrate/test that touches the DB.
- **Git identity** is already configured (`anton.vishneuskij@gmail.com`). **Never add co-author / "Generated with" trailers** to commit messages.
- **No `pnpm dev`** during implementation; verify with `pnpm exec tsc --noEmit`, `pnpm test`, `pnpm build`.
- **Locale prefixing:** pl is unprefixed (`/blog`), ru is `/ru/blog`. Single pl-based `slug` shared across both locales.
- **Collapsible = flat fields** at the doc top level (e.g. `post.metaTitle`); **group = nested** (e.g. not used here). Match ServicePages.
- **Category enum values (canonical, used everywhere):** `depilacja-laserowa`, `odmlodzenie-twarzy`, `czyszczenie-pielegnacja`, `zabiegi-specjalistyczne`, `poradniki-faq`, `sezonowo-trendy`.
- **Design source:** `wisnia-beauty/design_handoff/source/styles.css` + `preview/blog/*.html`. Port classes to Tailwind v4 + `@theme` tokens (cherry `#8B1A3A`, rose-gold-dk `#B07E55`, blush `#F5EDE3`, graphite `#1A1A1A`, gray `#5A5A5A`, gray-soft `#8A8079`, serif = Cormorant, `--radius-lg`=22px, shadow-sm/md).

---

## File Structure

**Create:**
- `src/collections/Authors.ts` — authors collection (E-E-A-T person data).
- `src/collections/Posts.ts` — blog posts collection.
- `src/lib/reading-time.ts` — word-count → minutes from a Lexical body.
- `src/lib/lexical-headings.ts` — `slugify()` + `extractHeadings()` (h2/h3 → `{id,text,level}`).
- `src/components/blog/PostCard.tsx` — index card.
- `src/components/blog/BlogIndex.tsx` — grid + category filter (client).
- `src/components/blog/PostMeta.tsx` — date + reading time + author byline.
- `src/components/blog/AuthorBio.tsx` — author + reviewer block.
- `src/components/blog/TableOfContents.tsx` — TOC list (server) from `extractHeadings`.
- `src/components/blog/HeadingAnchors.tsx` — client: assigns slug ids to rendered h2/h3 so TOC anchors resolve.
- `src/components/blog/RelatedPosts.tsx` — 3 related cards.
- `src/components/blog/PostCta.tsx` — related-service CTA band.
- `src/components/blog/BlogPost.tsx` — article assembler (async server component).
- `src/app/(frontend)/[locale]/blog/page.tsx` — index route.
- `src/app/(frontend)/[locale]/blog/[slug]/page.tsx` — article route.
- `src/app/(frontend)/blog/rss.xml/route.ts` — pl RSS.
- `src/app/(frontend)/ru/blog/rss.xml/route.ts` — ru RSS.
- `seed/data/authors.ts` + `seed/data/posts.ts` — seed data.
- `src/migrations/<timestamp>_blog.ts` — generated migration.
- `tests/int/blog.int.spec.ts`, `tests/int/blog-utils.test.ts`, `tests/e2e/blog.spec.ts`.

**Modify:**
- `src/payload.config.ts` — register `Authors`, `Posts`.
- `src/lib/queries.ts` — add post queries.
- `src/lib/jsonld.tsx` — add `medicalWebPageLd`.
- `src/app/sitemap.ts` — add blog paths.
- `src/components/layout/Header.tsx` + `Footer.tsx` — add "Blog" nav link.
- `messages/pl.json` + `messages/ru.json` — add `nav.blog` + `blog.*` keys (aligned).
- `seed/seed.ts` — wire authors + posts seeding (`SEED_ONLY=posts`, `SEED_WIPE_POSTS`).

---

## Task 1: `Authors` collection

**Files:**
- Create: `src/collections/Authors.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Create the collection.** `src/collections/Authors.ts`:

```typescript
import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Authors: CollectionConfig = {
  slug: 'authors',
  access: { read: () => true },
  admin: { group: 'Treść', useAsTitle: 'name', defaultColumns: ['name', 'jobTitle'] },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'jobTitle', type: 'text', localized: true },
    { name: 'credentials', type: 'text', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea', localized: true },
  ],
}
```

- [ ] **Step 2: Register it.** In `src/payload.config.ts` add the import next to the other collection imports:

```typescript
import { Authors } from './collections/Authors'
```

and add `Authors` to the `collections` array (before `Posts`, which is added in Task 2):

```typescript
collections: [Users, Media, Prices, Reviews, BeforeAfter, ServicePages, Authors],
```

- [ ] **Step 3: Verify it type-checks.**

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 4: Commit.**

```bash
git add src/collections/Authors.ts src/payload.config.ts
git commit -m "feat(p3): Authors collection (E-E-A-T person data)"
```

---

## Task 2: `Posts` collection

**Files:**
- Create: `src/collections/Posts.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Create the collection.** `src/collections/Posts.ts`:

```typescript
import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const CATEGORY_VALUES = [
  'depilacja-laserowa',
  'odmlodzenie-twarzy',
  'czyszczenie-pielegnacja',
  'zabiegi-specjalistyczne',
  'poradniki-faq',
  'sezonowo-trendy',
] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
  },
  admin: {
    group: 'Treść',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'status', 'publishedAt'],
  },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'Polski slug, wspólny dla obu języków, np. depilacja-laserowa-latem' },
    },
    {
      name: 'status', type: 'select', defaultValue: 'draft',
      options: [
        { label: 'Szkic', value: 'draft' },
        { label: 'Opublikowana', value: 'published' },
      ],
    },
    { name: 'publishedAt', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'lastReviewed', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
    {
      name: 'category', type: 'select', required: true,
      options: [
        { label: 'Depilacja laserowa', value: 'depilacja-laserowa' },
        { label: 'Odmłodzenie twarzy', value: 'odmlodzenie-twarzy' },
        { label: 'Czyszczenie i pielęgnacja', value: 'czyszczenie-pielegnacja' },
        { label: 'Zabiegi specjalistyczne', value: 'zabiegi-specjalistyczne' },
        { label: 'Poradniki i FAQ', value: 'poradniki-faq' },
        { label: 'Sezonowo i trendy', value: 'sezonowo-trendy' },
      ],
    },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', localized: true, required: true },
    { name: 'author', type: 'relationship', relationTo: 'authors', required: true },
    { name: 'reviewedBy', type: 'relationship', relationTo: 'authors' },
    { name: 'relatedService', type: 'relationship', relationTo: 'servicePages' },
    { name: 'relatedPosts', type: 'relationship', relationTo: 'posts', hasMany: true },
    { type: 'collapsible', label: 'SEO', fields: [
      { name: 'metaTitle', type: 'text', localized: true },
      { name: 'metaDescription', type: 'textarea', localized: true },
      { name: 'ogImage', type: 'upload', relationTo: 'media' },
      { name: 'noindex', type: 'checkbox', defaultValue: false },
    ] },
  ],
}
```

- [ ] **Step 2: Register it.** In `src/payload.config.ts` add:

```typescript
import { Posts } from './collections/Posts'
```

and update the array:

```typescript
collections: [Users, Media, Prices, Reviews, BeforeAfter, ServicePages, Authors, Posts],
```

- [ ] **Step 3: Generate Payload types.**

Run: `pnpm generate:types`
Expected: `src/payload-types.ts` regenerates with `Post` and `Author` interfaces, exit 0.

- [ ] **Step 4: Verify type-check.**

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 5: Commit.**

```bash
git add src/collections/Posts.ts src/payload.config.ts src/payload-types.ts
git commit -m "feat(p3): Posts collection (bilingual, category, E-E-A-T refs, SEO)"
```

---

## Task 3: DB migration for `posts` + `authors`

**Files:**
- Create: `src/migrations/<timestamp>_blog.ts` (generated)
- Modify: `src/migrations/index.ts` (auto-updated by the generator)

- [ ] **Step 1: Reset local DB cleanly (no precious local data).**

```bash
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
dropdb wisnia 2>/dev/null; createdb wisnia
```

- [ ] **Step 2: Run existing migrations, then create the new one.**

```bash
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
pnpm payload migrate
pnpm payload migrate:create blog
```
Expected: a new file `src/migrations/20260611_HHMMSS_blog.ts` with `CREATE TABLE "posts"`, `"posts_locales"`, `"authors"`, `"authors_locales"`, `"posts_rels"`, and the `enum_posts_status` / `enum_posts_category` enums; `src/migrations/index.ts` updated to import it.

- [ ] **Step 3: Apply it.**

```bash
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
pnpm payload migrate
```
Expected: migration applies, exit 0.

- [ ] **Step 4: Commit.**

```bash
git add src/migrations/
git commit -m "feat(p3): DB migration for posts + authors"
```

---

## Task 4: Post queries

**Files:**
- Modify: `src/lib/queries.ts`
- Test: `tests/int/blog.int.spec.ts`

- [ ] **Step 1: Write a failing integration test.** `tests/int/blog.int.spec.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayloadClient } from '@/lib/getPayload'
import { getPublishedPosts, getPost, getPostParams } from '@/lib/queries'

let authorId: number

describe('blog queries', () => {
  beforeAll(async () => {
    const payload = await getPayloadClient()
    const a = await payload.create({ collection: 'authors', locale: 'pl', data: { name: 'Test Autor' } })
    authorId = a.id as number
    await payload.create({
      collection: 'posts', locale: 'pl',
      data: { title: 'Pub', slug: 'pub-test', status: 'published', category: 'poradniki-faq',
        author: authorId, body: { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [] } } },
    })
    await payload.create({
      collection: 'posts', locale: 'pl',
      data: { title: 'Draft', slug: 'draft-test', status: 'draft', category: 'poradniki-faq',
        author: authorId, body: { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: [] } } },
    })
  })

  it('getPublishedPosts excludes drafts', async () => {
    const docs = await getPublishedPosts('pl')
    const slugs = docs.map((d: any) => d.slug)
    expect(slugs).toContain('pub-test')
    expect(slugs).not.toContain('draft-test')
  })

  it('getPost returns published, null for draft', async () => {
    expect(await getPost('pub-test', 'pl')).toBeTruthy()
    expect(await getPost('draft-test', 'pl')).toBeNull()
  })

  it('getPostParams returns only published slugs', async () => {
    const params = await getPostParams()
    expect(params).toContain('pub-test')
    expect(params).not.toContain('draft-test')
  })
})
```

- [ ] **Step 2: Run it; expect failure.**

Run: `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH" && pnpm test:int -- blog.int`
Expected: FAIL — `getPublishedPosts`/`getPost`/`getPostParams` are not exported.

- [ ] **Step 3: Add the queries.** Append to `src/lib/queries.ts`:

```typescript
export async function getPublishedPosts(locale: Locale, opts?: { category?: string }) {
  const payload = await getPayloadClient()
  const where: any = { status: { equals: 'published' } }
  if (opts?.category) where.category = { equals: opts.category }
  const res = await payload.find({ collection: 'posts', locale, where, sort: '-publishedAt', limit: 100, depth: 1 })
  return res.docs
}

export async function getPost(slug: string, locale: Locale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts', locale,
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1, depth: 2,
  })
  return res.docs[0] ?? null
}

export async function getPostParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 200, depth: 0, locale: 'pl' })
  return res.docs.map((d: any) => d.slug as string)
}

export async function getRelatedPosts(post: any, locale: Locale) {
  const explicit = (post?.relatedPosts ?? []).filter((p: any) => typeof p === 'object' && p?.status === 'published')
  if (explicit.length >= 3) return explicit.slice(0, 3)
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts', locale,
    where: { status: { equals: 'published' }, category: { equals: post.category }, slug: { not_equals: post.slug } },
    sort: '-publishedAt', limit: 3, depth: 1,
  })
  const seen = new Set(explicit.map((p: any) => p.slug))
  const filler = res.docs.filter((d: any) => !seen.has(d.slug))
  return [...explicit, ...filler].slice(0, 3)
}
```

- [ ] **Step 4: Run the test; expect pass.**

Run: `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH" && pnpm test:int -- blog.int`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit.**

```bash
git add src/lib/queries.ts tests/int/blog.int.spec.ts
git commit -m "feat(p3): post queries (published/single/params/related) + int tests"
```

---

## Task 5: Reading-time utility (TDD)

**Files:**
- Create: `src/lib/reading-time.ts`
- Test: `tests/int/blog-utils.test.ts`

- [ ] **Step 1: Write the failing test.** `tests/int/blog-utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readingMinutes } from '@/lib/reading-time'

const body = (text: string) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr',
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] }] } })

describe('readingMinutes', () => {
  it('returns at least 1 minute for short text', () => {
    expect(readingMinutes(body('a few words here'))).toBe(1)
  })
  it('scales with word count (~200 wpm)', () => {
    const words = Array.from({ length: 600 }, () => 'słowo').join(' ')
    expect(readingMinutes(body(words))).toBe(3)
  })
  it('handles empty/nullish body', () => {
    expect(readingMinutes(null)).toBe(1)
  })
})
```

- [ ] **Step 2: Run it; expect failure.**

Run: `pnpm test -- blog-utils`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement.** `src/lib/reading-time.ts`:

```typescript
type LexNode = { type?: string; text?: string; children?: LexNode[] }

function collectText(node: LexNode | undefined): string {
  if (!node) return ''
  let out = node.text ?? ''
  for (const c of node.children ?? []) out += ' ' + collectText(c)
  return out
}

export function readingMinutes(body: { root?: LexNode } | null | undefined, wpm = 200): number {
  const text = collectText(body?.root).trim()
  const words = text ? text.split(/\s+/).length : 0
  return Math.max(1, Math.round(words / wpm))
}
```

- [ ] **Step 4: Run the test; expect pass.**

Run: `pnpm test -- blog-utils`
Expected: PASS.

- [ ] **Step 5: Commit.**

```bash
git add src/lib/reading-time.ts tests/int/blog-utils.test.ts
git commit -m "feat(p3): reading-time util (TDD)"
```

---

## Task 6: Lexical headings utility (TDD)

**Files:**
- Create: `src/lib/lexical-headings.ts`
- Test: `tests/int/blog-utils.test.ts` (extend)

- [ ] **Step 1: Add failing tests** to `tests/int/blog-utils.test.ts`:

```typescript
import { slugify, extractHeadings } from '@/lib/lexical-headings'

const heading = (tag: string, text: string) => ({
  type: 'heading', tag, format: '', indent: 0, version: 1, direction: 'ltr',
  children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] })

describe('slugify', () => {
  it('slugifies Polish diacritics', () => {
    expect(slugify('Jak przygotować się do zabiegu')).toBe('jak-przygotowac-sie-do-zabiegu')
  })
})

describe('extractHeadings', () => {
  it('extracts h2/h3 with ids and levels', () => {
    const data = { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
      children: [heading('h2', 'Pierwszy'), heading('h3', 'Drugi'), heading('h4', 'Ignored')] } }
    const out = extractHeadings(data)
    expect(out).toEqual([
      { id: 'pierwszy', text: 'Pierwszy', level: 2 },
      { id: 'drugi', text: 'Drugi', level: 3 },
    ])
  })
})
```

- [ ] **Step 2: Run; expect failure.**

Run: `pnpm test -- blog-utils`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement.** `src/lib/lexical-headings.ts`:

```typescript
type LexNode = { type?: string; tag?: string; text?: string; children?: LexNode[] }

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l').replace(/Ł/g, 'l')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function nodeText(node: LexNode): string {
  let out = node.text ?? ''
  for (const c of node.children ?? []) out += nodeText(c)
  return out
}

export type Heading = { id: string; text: string; level: number }

export function extractHeadings(body: { root?: LexNode } | null | undefined): Heading[] {
  const out: Heading[] = []
  for (const node of body?.root?.children ?? []) {
    if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
      const text = nodeText(node).trim()
      if (text) out.push({ id: slugify(text), text, level: node.tag === 'h2' ? 2 : 3 })
    }
  }
  return out
}
```

- [ ] **Step 4: Run; expect pass.**

Run: `pnpm test -- blog-utils`
Expected: PASS.

- [ ] **Step 5: Commit.**

```bash
git add src/lib/lexical-headings.ts tests/int/blog-utils.test.ts
git commit -m "feat(p3): lexical-headings util (slugify + extractHeadings, TDD)"
```

---

## Task 7: `medicalWebPageLd` JSON-LD builder (TDD)

**Files:**
- Modify: `src/lib/jsonld.tsx`
- Test: `tests/int/blog-utils.test.ts` (extend)

- [ ] **Step 1: Add a failing test.**

```typescript
import { medicalWebPageLd } from '@/lib/jsonld'

describe('medicalWebPageLd', () => {
  it('emits MedicalWebPage with nested BlogPosting fields', () => {
    const ld: any = medicalWebPageLd({
      headline: 'RF lifting', description: 'opis', url: 'https://x/blog/rf',
      datePublished: '2026-01-01', dateModified: '2026-02-01', lastReviewed: '2026-02-01',
      authorName: 'Dr A', authorJobTitle: 'Kosmetolog', authorUrl: 'https://x/o-nas',
      reviewerName: 'Dr B', image: 'https://x/i.webp', publisherName: 'Wiśnia',
      aboutName: 'RF lifting', inLanguage: 'pl',
    })
    expect(ld['@type']).toBe('MedicalWebPage')
    expect(ld.author.name).toBe('Dr A')
    expect(ld.reviewedBy.name).toBe('Dr B')
    expect(ld.datePublished).toBe('2026-01-01')
    expect(ld.mainEntityOfPage).toBe('https://x/blog/rf')
  })
})
```

- [ ] **Step 2: Run; expect failure.** `pnpm test -- blog-utils` → FAIL (not exported).

- [ ] **Step 3: Implement.** Add to `src/lib/jsonld.tsx` (before the `JsonLd` component):

```typescript
export function medicalWebPageLd(o: {
  headline: string
  description?: string
  url: string
  datePublished?: string
  dateModified?: string
  lastReviewed?: string
  authorName: string
  authorJobTitle?: string
  authorUrl?: string
  reviewerName?: string
  reviewerJobTitle?: string
  image?: string
  publisherName: string
  publisherUrl?: string
  aboutName?: string
  inLanguage: string
}) {
  const author = { '@type': 'Person', name: o.authorName, jobTitle: o.authorJobTitle, url: o.authorUrl }
  const reviewedBy = o.reviewerName
    ? { '@type': 'Person', name: o.reviewerName, jobTitle: o.reviewerJobTitle }
    : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: o.headline,
    description: o.description,
    inLanguage: o.inLanguage,
    url: o.url,
    mainEntityOfPage: o.url,
    datePublished: o.datePublished,
    dateModified: o.dateModified || o.datePublished,
    lastReviewed: o.lastReviewed,
    specialty: 'CosmeticProcedure',
    audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    author,
    reviewedBy,
    image: o.image ? { '@type': 'ImageObject', url: o.image } : undefined,
    publisher: { '@type': 'Organization', name: o.publisherName, url: o.publisherUrl },
    about: o.aboutName ? { '@type': 'MedicalProcedure', name: o.aboutName } : undefined,
  }
}
```

- [ ] **Step 4: Run; expect pass.** `pnpm test -- blog-utils` → PASS.

- [ ] **Step 5: Commit.**

```bash
git add src/lib/jsonld.tsx tests/int/blog-utils.test.ts
git commit -m "feat(p3): medicalWebPageLd JSON-LD builder (TDD)"
```

---

## Task 8: i18n message keys (pl/ru aligned)

**Files:**
- Modify: `messages/pl.json`, `messages/ru.json`

- [ ] **Step 1: Add `nav.blog`** to both files inside the existing `nav` group.
  - pl: `"blog": "Blog"`  ru: `"blog": "Блог"`

- [ ] **Step 2: Add a new top-level `blog` group** to `messages/pl.json`:

```json
"blog": {
  "lead": "Eksperckie artykuły o kosmetologii, depilacji laserowej i pielęgnacji skóry.",
  "readMore": "Czytaj dalej",
  "readingTime": "Czas czytania: {min} min",
  "publishedOn": "Opublikowano",
  "updatedOn": "Aktualizacja",
  "author": "Autor",
  "reviewedBy": "Recenzja merytoryczna",
  "toc": "Spis treści",
  "relatedPosts": "Podobne artykuły",
  "relatedServiceCtaTitle": "Umów się na zabieg",
  "relatedServiceCtaButton": "Zobacz usługę",
  "allCategories": "Wszystkie",
  "backToBlog": "Wróć do bloga",
  "category": {
    "depilacja-laserowa": "Depilacja laserowa",
    "odmlodzenie-twarzy": "Odmłodzenie twarzy",
    "czyszczenie-pielegnacja": "Czyszczenie i pielęgnacja",
    "zabiegi-specjalistyczne": "Zabiegi specjalistyczne",
    "poradniki-faq": "Poradniki i FAQ",
    "sezonowo-trendy": "Sezonowo i trendy"
  }
}
```

- [ ] **Step 3: Add the aligned `blog` group** to `messages/ru.json`:

```json
"blog": {
  "lead": "Экспертные статьи о косметологии, лазерной эпиляции и уходе за кожей.",
  "readMore": "Читать далее",
  "readingTime": "Время чтения: {min} мин",
  "publishedOn": "Опубликовано",
  "updatedOn": "Обновлено",
  "author": "Автор",
  "reviewedBy": "Научная редактура",
  "toc": "Содержание",
  "relatedPosts": "Похожие статьи",
  "relatedServiceCtaTitle": "Запишитесь на процедуру",
  "relatedServiceCtaButton": "Смотреть услугу",
  "allCategories": "Все",
  "backToBlog": "Назад в блог",
  "category": {
    "depilacja-laserowa": "Лазерная эпиляция",
    "odmlodzenie-twarzy": "Омоложение лица",
    "czyszczenie-pielegnacja": "Чистка и уход",
    "zabiegi-specjalistyczne": "Специальные процедуры",
    "poradniki-faq": "Гайды и FAQ",
    "sezonowo-trendy": "Сезонно и тренды"
  }
}
```

- [ ] **Step 4: Validate JSON + alignment.**

Run: `node -e "const p=require('./messages/pl.json'),r=require('./messages/ru.json');const keys=o=>Object.keys(o).flatMap(k=>o[k]&&typeof o[k]==='object'?Object.keys(o[k]).map(s=>k+'.'+s):[k]);const a=new Set(keys(p)),b=new Set(keys(r));const miss=[...a].filter(k=>!b.has(k)).concat([...b].filter(k=>!a.has(k)));if(miss.length){console.error('UNALIGNED',miss);process.exit(1)}console.log('aligned')"`
Expected: `aligned`. Also run `pnpm test` if a messages-alignment test exists — it must stay green.

- [ ] **Step 5: Commit.**

```bash
git add messages/pl.json messages/ru.json
git commit -m "feat(p3): blog i18n keys (nav.blog + blog.* incl. categories), pl/ru aligned"
```

---

## Task 9: Presentational components — PostCard, PostMeta, AuthorBio, PostCta

**Files:**
- Create: `src/components/blog/PostCard.tsx`, `PostMeta.tsx`, `AuthorBio.tsx`, `PostCta.tsx`

> These are server components (no hooks). Labels are passed in as props from the route/assembler (which has `getTranslations`). Match design tokens.

- [ ] **Step 1: `PostCard.tsx`** (ports `.post-card`):

```typescript
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export type PostCardData = {
  slug: string
  title: string
  excerpt?: string | null
  categoryLabel: string
  cover?: { url?: string | null; alt?: string | null } | null
}

export function PostCard({ post, href, readMore }: { post: PostCardData; href: string; readMore: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white border border-[var(--line,rgba(26,26,26,0.10))] rounded-[var(--radius-lg)] shadow-[0_2px_8px_rgba(110,18,44,0.06)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(110,18,44,0.08)]"
    >
      {post.cover?.url && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image src={post.cover.url} alt={post.cover.alt ?? post.title} fill className="object-cover" sizes="(max-width:960px) 100vw, 33vw" />
        </div>
      )}
      <div className="flex flex-col flex-1 p-[26px]">
        <span className="text-[12px] tracking-[0.1em] uppercase text-rose-gold-dk mb-2.5">{post.categoryLabel}</span>
        <h3 className="font-serif text-[23px] leading-[1.2] text-graphite mb-2.5">{post.title}</h3>
        {post.excerpt && <p className="text-[15px] text-gray flex-1">{post.excerpt}</p>}
        <span className="mt-4 inline-flex items-center gap-[7px] text-cherry text-[13px] tracking-[0.08em] uppercase font-medium">
          {readMore}
          <ArrowRight className="w-[14px] h-[14px] transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: `PostMeta.tsx`** (date + reading time + author byline):

```typescript
import Image from 'next/image'

export function PostMeta({
  dateLabel, minutes, readingTimeLabel, authorName, authorJobTitle, authorPhoto,
}: {
  dateLabel?: string | null
  minutes: number
  readingTimeLabel: string
  authorName?: string | null
  authorJobTitle?: string | null
  authorPhoto?: { url?: string | null; alt?: string | null } | null
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-gray-soft mb-8">
      {authorName && (
        <span className="flex items-center gap-2">
          {authorPhoto?.url && (
            <Image src={authorPhoto.url} alt={authorPhoto.alt ?? authorName} width={32} height={32} className="rounded-full object-cover" />
          )}
          <span className="text-graphite font-medium">{authorName}</span>
          {authorJobTitle && <span>· {authorJobTitle}</span>}
        </span>
      )}
      {dateLabel && <span>{dateLabel}</span>}
      <span>{readingTimeLabel.replace('{min}', String(minutes))}</span>
    </div>
  )
}
```

- [ ] **Step 3: `AuthorBio.tsx`** (author + reviewer block, after body):

```typescript
import Image from 'next/image'

type Person = { name?: string | null; jobTitle?: string | null; credentials?: string | null; bio?: string | null; photo?: { url?: string | null; alt?: string | null } | null } | null

export function AuthorBio({
  author, reviewer, reviewedByLabel, lastReviewedLabel,
}: {
  author: Person
  reviewer: Person
  reviewedByLabel: string
  lastReviewedLabel?: string | null
}) {
  if (!author) return null
  return (
    <div className="mt-10 pt-6 border-t border-[rgba(26,26,26,0.08)] flex flex-col gap-4">
      <div className="flex items-start gap-4">
        {author.photo?.url && (
          <Image src={author.photo.url} alt={author.photo.alt ?? author.name ?? ''} width={56} height={56} className="rounded-full object-cover shrink-0" />
        )}
        <div>
          <strong className="font-serif text-[18px] text-graphite block">{author.name}</strong>
          {author.jobTitle && <span className="text-[14px] text-gray-soft">{author.jobTitle}</span>}
          {author.credentials && <p className="text-[13px] text-gray-soft mt-0.5">{author.credentials}</p>}
          {author.bio && <p className="text-[14.5px] text-gray mt-2 leading-[1.6]">{author.bio}</p>}
        </div>
      </div>
      {reviewer?.name && (
        <p className="text-[13.5px] text-gray-soft">
          {reviewedByLabel}: <span className="text-graphite">{reviewer.name}</span>
          {reviewer.jobTitle && <span> · {reviewer.jobTitle}</span>}
          {lastReviewedLabel && <span> · {lastReviewedLabel}</span>}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: `PostCta.tsx`** (related-service CTA band, ports `.post__cta`):

```typescript
import { CtaLink } from '@/components/ui/CtaButtons'

export function PostCta({
  title, buttonLabel, serviceHref, booksyHref,
}: {
  title: string
  buttonLabel: string
  serviceHref?: string | null
  booksyHref: string
}) {
  return (
    <div className="mt-16 p-7 bg-blush rounded-[var(--radius-lg)] text-center">
      <h3 className="font-serif text-[26px] text-graphite mb-4">{title}</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {serviceHref && (
          <a href={serviceHref} className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-cherry text-cherry text-[14px] font-medium transition-colors hover:bg-cherry hover:text-cream">
            {buttonLabel}
          </a>
        )}
        <CtaLink method="booksy" href={booksyHref} className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-cherry text-cream text-[14px] font-medium transition-colors hover:bg-cherry-deep">
          Booksy
        </CtaLink>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify type-check + commit.**

Run: `pnpm exec tsc --noEmit` (expect 0).
```bash
git add src/components/blog/PostCard.tsx src/components/blog/PostMeta.tsx src/components/blog/AuthorBio.tsx src/components/blog/PostCta.tsx
git commit -m "feat(p3): blog presentational components (card, meta, author bio, CTA band)"
```

---

## Task 10: TOC + HeadingAnchors + RelatedPosts

**Files:**
- Create: `src/components/blog/TableOfContents.tsx`, `HeadingAnchors.tsx`, `RelatedPosts.tsx`

- [ ] **Step 1: `TableOfContents.tsx`** (server; uses `extractHeadings`):

```typescript
import type { Heading } from '@/lib/lexical-headings'

export function TableOfContents({ headings, title }: { headings: Heading[]; title: string }) {
  if (headings.length < 2) return null
  return (
    <nav aria-label={title} className="my-6 p-5 bg-cream border border-[rgba(201,149,108,0.25)] rounded-[var(--radius-md)]">
      <p className="text-[13px] tracking-[0.08em] uppercase text-rose-gold-dk mb-3">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
            <a href={`#${h.id}`} className="text-[14.5px] text-cherry hover:underline underline-offset-2">{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 2: `HeadingAnchors.tsx`** (client; assigns slug ids to the rendered h2/h3 so TOC anchors resolve regardless of the RichText converter API):

```typescript
'use client'
import { useEffect } from 'react'
import { slugify } from '@/lib/lexical-headings'

export function HeadingAnchors({ containerId }: { containerId: string }) {
  useEffect(() => {
    const root = document.getElementById(containerId)
    if (!root) return
    root.querySelectorAll('h2, h3').forEach((el) => {
      if (!el.id) el.id = slugify(el.textContent ?? '')
    })
  }, [containerId])
  return null
}
```

- [ ] **Step 3: `RelatedPosts.tsx`** (reuses `PostCard`):

```typescript
import { PostCard, type PostCardData } from './PostCard'

export function RelatedPosts({
  posts, heading, readMore, hrefFor,
}: {
  posts: PostCardData[]
  heading: string
  readMore: string
  hrefFor: (slug: string) => string
}) {
  if (!posts.length) return null
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-[clamp(40px,6vw,72px)]">
      <h2 className="font-serif text-2xl text-graphite mb-5">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[960px]:grid-cols-3 gap-5">
        {posts.map((p) => <PostCard key={p.slug} post={p} href={hrefFor(p.slug)} readMore={readMore} />)}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Verify type-check + commit.**

Run: `pnpm exec tsc --noEmit` (expect 0).
```bash
git add src/components/blog/TableOfContents.tsx src/components/blog/HeadingAnchors.tsx src/components/blog/RelatedPosts.tsx
git commit -m "feat(p3): TOC + heading anchors + related posts components"
```

---

## Task 11: `BlogIndex` (grid + category filter, client)

**Files:**
- Create: `src/components/blog/BlogIndex.tsx`

- [ ] **Step 1: Implement.** `BlogIndex.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { PostCard, type PostCardData } from './PostCard'

export type IndexPost = PostCardData & { category: string }

export function BlogIndex({
  posts, categories, allLabel, readMore, hrefFor,
}: {
  posts: IndexPost[]
  categories: { value: string; label: string }[]
  allLabel: string
  readMore: string
  hrefFor: (slug: string) => string
}) {
  const [active, setActive] = useState<string>('')
  const present = new Set(posts.map((p) => p.category))
  const chips = [{ value: '', label: allLabel }, ...categories.filter((c) => present.has(c.value))]
  const shown = active ? posts.filter((p) => p.category === active) : posts

  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-[clamp(56px,9vw,112px)]">
      <div className="flex flex-wrap gap-2.5 mb-8">
        {chips.map((c) => (
          <button
            key={c.value || 'all'}
            onClick={() => setActive(c.value)}
            className={`px-4 py-2 rounded-full text-[13.5px] border transition-colors ${
              active === c.value
                ? 'bg-cherry text-cream border-cherry'
                : 'bg-transparent text-graphite border-[rgba(201,149,108,0.4)] hover:border-cherry hover:text-cherry'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 min-[960px]:grid-cols-3 gap-[26px]">
          {shown.map((p) => <PostCard key={p.slug} post={p} href={hrefFor(p.slug)} readMore={readMore} />)}
        </div>
      ) : (
        <p className="text-gray">—</p>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Verify type-check + commit.**

Run: `pnpm exec tsc --noEmit` (expect 0).
```bash
git add src/components/blog/BlogIndex.tsx
git commit -m "feat(p3): BlogIndex grid + client category filter"
```

---

## Task 12: `BlogPost` assembler

**Files:**
- Create: `src/components/blog/BlogPost.tsx`

- [ ] **Step 1: Implement.** Assembles the article body. `BlogPost.tsx`:

```typescript
import { getFormatter, getTranslations } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Reveal } from '@/components/ui/Reveal'
import { Breadcrumb } from '@/components/service/Breadcrumb'
import { PostMeta } from './PostMeta'
import { TableOfContents } from './TableOfContents'
import { HeadingAnchors } from './HeadingAnchors'
import { AuthorBio } from './AuthorBio'
import { PostCta } from './PostCta'
import { contactLinks } from '@/lib/contact-links'
import { readingMinutes } from '@/lib/reading-time'
import { extractHeadings } from '@/lib/lexical-headings'

const BODY_ID = 'post-body'

export async function BlogPost({
  post, settings, locale, blogLabel,
}: {
  post: any
  settings: any
  locale: string
  blogLabel: string
}) {
  const t = await getTranslations({ locale })
  const format = await getFormatter({ locale })
  const isRu = locale === 'ru'
  const homeHref = isRu ? '/ru' : '/'
  const blogHref = isRu ? '/ru/blog' : '/blog'
  const { booksyHref } = contactLinks(settings)

  const headings = extractHeadings(post.body)
  const minutes = readingMinutes(post.body)
  const author = typeof post.author === 'object' ? post.author : null
  const reviewer = typeof post.reviewedBy === 'object' ? post.reviewedBy : null
  const service = typeof post.relatedService === 'object' ? post.relatedService : null
  const serviceHref = service ? (isRu ? `/ru/uslugi/${service.slug}` : `/uslugi/${service.slug}`) : null
  const dateLabel = post.publishedAt ? format.dateTime(new Date(post.publishedAt), { year: 'numeric', month: 'long', day: 'numeric' }) : null
  const lastReviewedLabel = post.lastReviewed
    ? `${t('blog.updatedOn')}: ${format.dateTime(new Date(post.lastReviewed), { year: 'numeric', month: 'long', day: 'numeric' })}`
    : null

  return (
    <article>
      <div className="max-w-[1200px] mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: 'Wiśnia', href: homeHref }, { label: blogLabel, href: blogHref }, { label: post.title }]} />
      </div>

      {post.cover?.url && (
        <div className="max-w-[1000px] mx-auto px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover.url} alt={post.cover.alt ?? post.title} className="w-full aspect-[16/9] object-cover rounded-[var(--radius-xl)]" />
        </div>
      )}

      <div className="max-w-[760px] mx-auto px-6 py-[clamp(32px,5vw,56px)]">
        <Reveal>
          <h1 className="font-serif text-[clamp(30px,4.5vw,46px)] font-semibold text-graphite leading-[1.12] mb-4">{post.title}</h1>
          <PostMeta
            dateLabel={dateLabel}
            minutes={minutes}
            readingTimeLabel={t('blog.readingTime')}
            authorName={author?.name}
            authorJobTitle={author?.jobTitle}
            authorPhoto={author?.photo}
          />
        </Reveal>

        <TableOfContents headings={headings} title={t('blog.toc')} />

        <div id={BODY_ID} className="prose max-w-none">
          <RichText data={post.body} />
        </div>
        <HeadingAnchors containerId={BODY_ID} />

        <AuthorBio author={author} reviewer={reviewer} reviewedByLabel={t('blog.reviewedBy')} lastReviewedLabel={lastReviewedLabel} />

        <PostCta
          title={t('blog.relatedServiceCtaTitle')}
          buttonLabel={t('blog.relatedServiceCtaButton')}
          serviceHref={serviceHref}
          booksyHref={booksyHref}
        />
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Verify type-check + commit.**

Run: `pnpm exec tsc --noEmit` (expect 0).
```bash
git add src/components/blog/BlogPost.tsx
git commit -m "feat(p3): BlogPost article assembler"
```

---

## Task 13: Routes — `/blog` index + `/blog/[slug]` article

**Files:**
- Create: `src/app/(frontend)/[locale]/blog/page.tsx`, `src/app/(frontend)/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Index route.** `src/app/(frontend)/[locale]/blog/page.tsx`:

```typescript
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { locales } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import { getPublishedPosts, getServicesNav } from '@/lib/queries'
import { getPayloadClient } from '@/lib/getPayload'
import { breadcrumbLd, JsonLd } from '@/lib/jsonld'
import { CATEGORY_VALUES } from '@/collections/Posts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { Reveal } from '@/components/ui/Reveal'
import { Breadcrumb } from '@/components/service/Breadcrumb'
import { BlogIndex, type IndexPost } from '@/components/blog/BlogIndex'

export const revalidate = 3600
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const isRu = locale === 'ru'
  const title = `Blog · Wiśnia Beauty Studio`
  const description = t('blog.lead')
  const canonical = isRu ? `${SITE}/ru/blog` : `${SITE}/blog`
  return {
    metadataBase: new URL(SITE),
    title, description,
    alternates: { canonical, languages: { pl: `${SITE}/blog`, ru: `${SITE}/ru/blog` } },
    openGraph: {
      type: 'website', url: canonical, title, description, siteName: 'Wiśnia Beauty Studio',
      locale: isRu ? 'ru_RU' : 'pl_PL', alternateLocale: isRu ? 'pl_PL' : 'ru_RU',
      images: [{ url: '/assets/hero-olga.jpg', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/assets/hero-olga.jpg'] },
  }
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })
  const isRu = locale === 'ru'
  const base = isRu ? `${SITE}/ru` : SITE
  const homeHref = isRu ? '/ru' : '/'

  const payload = await getPayloadClient()
  const settings: any = await payload.findGlobal({ slug: 'settings', locale: locale as Locale }).catch(() => null)
  const [services, posts] = await Promise.all([
    getServicesNav(locale as Locale),
    getPublishedPosts(locale as Locale).catch(() => [] as any[]),
  ])

  const indexPosts: IndexPost[] = (posts as any[]).map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category,
    categoryLabel: t(`blog.category.${p.category}` as any),
    cover: typeof p.cover === 'object' ? p.cover : null,
  }))
  const categories = CATEGORY_VALUES.map((v) => ({ value: v, label: t(`blog.category.${v}` as any) }))
  const hrefFor = (slug: string) => (isRu ? `/ru/blog/${slug}` : `/blog/${slug}`)

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Wiśnia', url: base }, { name: 'Blog', url: `${base}/blog` }])} />
      <Header locale={locale} settings={settings} services={services} />
      <main>
        <div className="max-w-[1200px] mx-auto px-6 pt-6">
          <Breadcrumb items={[{ label: 'Wiśnia', href: homeHref }, { label: 'Blog' }]} />
        </div>
        <Reveal>
          <section className="max-w-[1200px] mx-auto px-6 pt-4 pb-10">
            <p className="eyebrow mb-3">Blog</p>
            <h1 className="font-serif text-[clamp(28px,3.5vw,48px)] font-semibold text-graphite leading-[1.12] max-w-[640px]">Blog · Wiśnia Beauty Studio</h1>
            <p className="mt-4 text-[17px] leading-[1.65] text-gray max-w-[600px]">{t('blog.lead')}</p>
          </section>
        </Reveal>
        <BlogIndex posts={indexPosts} categories={categories} allLabel={t('blog.allCategories')} readMore={t('blog.readMore')} hrefFor={hrefFor} />
      </main>
      <Footer locale={locale} settings={settings} services={services} />
      <StickyCta locale={locale} settings={settings} />
    </>
  )
}
```

- [ ] **Step 2: Article route.** `src/app/(frontend)/[locale]/blog/[slug]/page.tsx`:

```typescript
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { locales } from '@/lib/i18n'
import { getPost, getPostParams, getRelatedPosts, getServicesNav } from '@/lib/queries'
import { getPayloadClient } from '@/lib/getPayload'
import { medicalWebPageLd, breadcrumbLd, JsonLd } from '@/lib/jsonld'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { BlogPost } from '@/components/blog/BlogPost'
import { RelatedPosts } from '@/components/blog/RelatedPosts'

export const revalidate = 3600
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateStaticParams() {
  const slugs = await getPostParams()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const post: any = await getPost(slug, locale as Locale)
  if (!post) return {}
  const isRu = locale === 'ru'
  const base = isRu ? `${SITE}/ru` : SITE
  const url = `${base}/blog/${slug}`
  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || undefined
  const imageUrl = post.ogImage?.url ?? post.cover?.url ?? '/assets/hero-olga.jpg'
  return {
    metadataBase: new URL(SITE),
    title, description,
    robots: post.noindex ? { index: false, follow: true } : undefined,
    alternates: { canonical: url, languages: { pl: `${SITE}/blog/${slug}`, ru: `${SITE}/ru/blog/${slug}` } },
    openGraph: {
      type: 'article', url, title, description, siteName: 'Wiśnia Beauty Studio',
      locale: isRu ? 'ru_RU' : 'pl_PL', alternateLocale: isRu ? 'pl_PL' : 'ru_RU',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  }
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post: any = await getPost(slug, locale as Locale)
  if (!post) notFound()

  const t = await getTranslations({ locale })
  const payload = await getPayloadClient()
  const settings: any = await payload.findGlobal({ slug: 'settings', locale: locale as Locale }).catch(() => null)
  const services = await getServicesNav(locale as Locale)
  const related = await getRelatedPosts(post, locale as Locale).catch(() => [] as any[])

  const isRu = locale === 'ru'
  const base = isRu ? `${SITE}/ru` : SITE
  const url = `${base}/blog/${slug}`
  const author = typeof post.author === 'object' ? post.author : null
  const reviewer = typeof post.reviewedBy === 'object' ? post.reviewedBy : null
  const service = typeof post.relatedService === 'object' ? post.relatedService : null
  const imageUrl = post.ogImage?.url ?? post.cover?.url ?? `${SITE}/assets/hero-olga.jpg`
  const hrefFor = (s: string) => (isRu ? `/ru/blog/${s}` : `/blog/${s}`)

  const relatedCards = (related as any[]).map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt,
    categoryLabel: t(`blog.category.${p.category}` as any),
    cover: typeof p.cover === 'object' ? p.cover : null,
  }))

  return (
    <>
      <JsonLd data={medicalWebPageLd({
        headline: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        url,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        lastReviewed: post.lastReviewed,
        authorName: author?.name ?? 'Wiśnia Beauty Studio',
        authorJobTitle: author?.jobTitle,
        authorUrl: `${base}`,
        reviewerName: reviewer?.name,
        reviewerJobTitle: reviewer?.jobTitle,
        image: imageUrl,
        publisherName: 'Wiśnia Beauty Studio',
        publisherUrl: SITE,
        aboutName: service?.title,
        inLanguage: isRu ? 'ru' : 'pl',
      })} />
      <JsonLd data={breadcrumbLd([
        { name: 'Wiśnia', url: base },
        { name: 'Blog', url: `${base}/blog` },
        { name: post.title, url },
      ])} />
      <Header locale={locale} settings={settings} services={services} />
      <main>
        <BlogPost post={post} settings={settings} locale={locale} blogLabel="Blog" />
        <RelatedPosts posts={relatedCards} heading={t('blog.relatedPosts')} readMore={t('blog.readMore')} hrefFor={hrefFor} />
      </main>
      <Footer locale={locale} settings={settings} services={services} />
      <StickyCta locale={locale} settings={settings} />
    </>
  )
}
```

- [ ] **Step 3: Verify type-check + build.**

Run: `pnpm exec tsc --noEmit` (expect 0). Then `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH" && pnpm build` (expect success; blog routes appear in output).

- [ ] **Step 4: Commit.**

```bash
git add "src/app/(frontend)/[locale]/blog/page.tsx" "src/app/(frontend)/[locale]/blog/[slug]/page.tsx"
git commit -m "feat(p3): /blog index + /blog/[slug] routes (ISR, metadata, JSON-LD, notFound)"
```

---

## Task 14: RSS feeds

**Files:**
- Create: `src/app/(frontend)/blog/rss.xml/route.ts` (pl), `src/app/(frontend)/ru/blog/rss.xml/route.ts` (ru)

> `.xml` paths are excluded from the next-intl middleware matcher (`.*\\..*`), so these static route handlers resolve directly. Both share a helper to avoid duplication.

- [ ] **Step 1: pl RSS.** `src/app/(frontend)/blog/rss.xml/route.ts`:

```typescript
import { getPublishedPosts } from '@/lib/queries'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export const revalidate = 3600

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function buildFeed(locale: 'pl' | 'ru') {
  const base = locale === 'ru' ? `${SITE}/ru` : SITE
  const posts = await getPublishedPosts(locale).catch(() => [] as any[])
  const items = (posts as any[]).map((p) => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid>${base}/blog/${p.slug}</guid>
      ${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}
      ${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ''}
    </item>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Wiśnia Beauty Studio — Blog</title>
  <link>${base}/blog</link>
  <description>${esc(locale === 'ru' ? 'Экспертные статьи' : 'Eksperckie artykuły')}</description>
  <language>${locale}</language>${items}
</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}

export function GET() {
  return buildFeed('pl')
}
```

- [ ] **Step 2: ru RSS.** `src/app/(frontend)/ru/blog/rss.xml/route.ts`:

```typescript
import { buildFeed } from '@/app/(frontend)/blog/rss.xml/route'

export const revalidate = 3600

export function GET() {
  return buildFeed('ru')
}
```

- [ ] **Step 3: Verify build + that the route resolves.**

Run: `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH" && pnpm build`
Expected: build success; `/blog/rss.xml` and `/ru/blog/rss.xml` appear as routes. If `/ru/blog/rss.xml` conflicts with the `[locale]` segment, instead keep only the pl handler at `src/app/(frontend)/blog/rss.xml/route.ts` and create the ru one at `src/app/(frontend)/ru/blog/rss.xml/route.ts` — Next resolves the static `ru` segment ahead of `[locale]` for this exact path. Confirm with the e2e test in Task 17.

- [ ] **Step 4: Commit.**

```bash
git add "src/app/(frontend)/blog/rss.xml/route.ts" "src/app/(frontend)/ru/blog/rss.xml/route.ts"
git commit -m "feat(p3): RSS feeds /blog/rss.xml + /ru/blog/rss.xml"
```

---

## Task 15: Sitemap + Header/Footer nav

**Files:**
- Modify: `src/app/sitemap.ts`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`

- [ ] **Step 1: Sitemap.** Edit `src/app/sitemap.ts` to import `getPostParams` and add `/blog` paths:

```typescript
import type { MetadataRoute } from 'next'
import { getServicePageParams, getPostParams } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const staticPaths = ['', '/polityka-prywatnosci', '/uslugi', '/blog']
  let slugs: string[] = []
  try { slugs = await getServicePageParams() } catch { slugs = [] }
  let postSlugs: string[] = []
  try { postSlugs = await getPostParams() } catch { postSlugs = [] }
  const servicePaths = slugs.map((s) => `/uslugi/${s}`)
  const postPaths = postSlugs.map((s) => `/blog/${s}`)
  const paths = [...staticPaths, ...servicePaths, ...postPaths]
  return paths.flatMap((p) => {
    const languages = { pl: `${url}${p}`, ru: `${url}/ru${p}`, 'x-default': `${url}${p}` }
    return [
      { url: `${url}${p}`, alternates: { languages } },
      { url: `${url}/ru${p}`, alternates: { languages } },
    ]
  })
}
```

- [ ] **Step 2: Header nav.** Read `src/components/layout/Header.tsx`. Add a "Blog" link to the primary nav list (both desktop and the mobile drawer), using `t('nav.blog')`, with `href={locale === 'ru' ? '/ru/blog' : '/blog'}`, placed right after the Usługi item. Match the existing nav-link markup/classes exactly (copy a sibling link).

- [ ] **Step 3: Footer nav.** Read `src/components/layout/Footer.tsx`. Add the same "Blog" link to the footer navigation column, matching the existing footer link markup.

- [ ] **Step 4: Verify type-check + build.**

Run: `pnpm exec tsc --noEmit` (0); `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH" && pnpm build` (success).

- [ ] **Step 5: Commit.**

```bash
git add src/app/sitemap.ts src/components/layout/Header.tsx src/components/layout/Footer.tsx
git commit -m "feat(p3): blog in sitemap + Header/Footer Blog nav"
```

---

## Task 16: Seed — authors + 4 handoff articles

**Files:**
- Create: `seed/data/authors.ts`, `seed/data/posts.ts`
- Modify: `seed/seed.ts`

> Extract pl body from each `wisnia-beauty/design_handoff/preview/blog/<slug>.html` (the `.post__wrap` content: h2/h3 + paragraphs), and ru from the inline `window.I18N_PAGE` dictionary in the same file. If a ru translation is missing for some block, translate it faithfully (do NOT leave pl text in the ru field). Bodies must include h2/h3 headings so the TOC renders.

- [ ] **Step 1: Author data.** `seed/data/authors.ts`:

```typescript
export interface AuthorRow {
  key: string
  name: { pl: string; ru: string }
  jobTitle: { pl: string; ru: string }
  credentials: { pl: string; ru: string }
  bio: { pl: string; ru: string }
  photoFile: string | null
}

// PLACEHOLDER credentials — owner to replace with a real named specialist + reviewer in /admin.
export const authors: AuthorRow[] = [
  {
    key: 'olga',
    name: { pl: 'Olga — Wiśnia Beauty', ru: 'Ольга — Wiśnia Beauty' },
    jobTitle: { pl: 'Kosmetolog, specjalista depilacji laserowej', ru: 'Косметолог, специалист по лазерной эпиляции' },
    credentials: { pl: 'Wieloletnie doświadczenie w kosmetologii estetycznej.', ru: 'Многолетний опыт в эстетической косметологии.' },
    bio: { pl: 'Prowadzi zabiegi laserowe i pielęgnacyjne w Wiśnia Beauty Studio w Warszawie.', ru: 'Проводит лазерные и уходовые процедуры в Wiśnia Beauty Studio в Варшаве.' },
    photoFile: null,
  },
  {
    key: 'reviewer',
    name: { pl: 'Zespół merytoryczny Wiśnia', ru: 'Научная редакция Wiśnia' },
    jobTitle: { pl: 'Recenzja merytoryczna', ru: 'Научная редактура' },
    credentials: { pl: 'Treści weryfikowane pod kątem aktualności i bezpieczeństwa.', ru: 'Материалы проверяются на актуальность и безопасность.' },
    bio: { pl: '', ru: '' },
    photoFile: null,
  },
]
```

- [ ] **Step 2: Post data.** `seed/data/posts.ts` — define the interface and the 4 articles. Use a `body: { pl: Block[]; ru: Block[] }` structure where each block is `{ kind: 'h2' | 'h3' | 'p'; text: string }`, so the seed builder can emit heading + paragraph Lexical nodes:

```typescript
export type Block = { kind: 'h2' | 'h3' | 'p'; text: string }

export interface PostRow {
  slug: string
  category: string
  publishedAt: string // ISO date
  lastReviewed?: string
  authorKey: string
  reviewerKey?: string
  relatedServiceSlug?: string
  relatedSlugs?: string[]
  coverFile: string | null
  title: { pl: string; ru: string }
  excerpt: { pl: string; ru: string }
  body: { pl: Block[]; ru: Block[] }
  metaTitle: { pl: string; ru: string }
  metaDescription: { pl: string; ru: string }
}

export const posts: PostRow[] = [
  // Fill the 4 handoff articles below. Each body MUST contain real pl + ru content
  // (pl from the handoff HTML .post__wrap, ru from the inline I18N_PAGE dict) with h2/h3 headings.
  {
    slug: 'depilacja-laserowa-latem',
    category: 'depilacja-laserowa',
    publishedAt: '2026-05-20',
    authorKey: 'olga',
    reviewerKey: 'reviewer',
    relatedServiceSlug: 'depilacja-laserowa-warszawa',
    relatedSlugs: ['ipl-czy-rf-lifting', 'jak-usunac-naczynka-na-twarzy'],
    coverFile: null,
    title: { pl: 'Depilacja laserowa latem — czy to bezpieczne?', ru: 'Лазерная эпиляция летом — это безопасно?' },
    excerpt: { pl: '…', ru: '…' },
    body: {
      pl: [{ kind: 'h2', text: '…' }, { kind: 'p', text: '…' }],
      ru: [{ kind: 'h2', text: '…' }, { kind: 'p', text: '…' }],
    },
    metaTitle: { pl: 'Depilacja laserowa latem | Wiśnia Beauty', ru: 'Лазерная эпиляция летом | Wiśnia Beauty' },
    metaDescription: { pl: '…', ru: '…' },
  },
  // + 3 more: 'dlaczego-pojawiaja-sie-przebarwienia', 'jak-usunac-naczynka-na-twarzy', 'ipl-czy-rf-lifting'
]
```

> The implementer MUST replace every `'…'` with the real extracted content from the handoff HTML (pl) and inline i18n (ru). Assign categories: `dlaczego-pojawiaja-sie-przebarwienia` → `czyszczenie-pielegnacja` (relatedService `oczyszczanie-twarzy-warszawa`); `jak-usunac-naczynka-na-twarzy` → `zabiegi-specjalistyczne` (relatedService `usuwanie-naczynek-warszawa`); `ipl-czy-rf-lifting` → `odmlodzenie-twarzy` (relatedService `rf-lifting-warszawa`).

- [ ] **Step 3: Seed builder + wiring.** In `seed/seed.ts`:
  - Add `import { authors } from './data/authors'` and `import { posts, type Block } from './data/posts'`.
  - Add a `blocksToLexical(blocks: Block[])` helper next to `textToLexical`:

```typescript
function blocksToLexical(blocks: { kind: 'h2' | 'h3' | 'p'; text: string }[]) {
  const fmt = '' as ''
  const textChild = (text: string) => ({ type: 'text', text, format: 0, detail: 0, mode: 'normal' as const, style: '', version: 1 })
  return {
    root: {
      type: 'root', format: fmt, indent: 0, version: 1, direction: 'ltr' as 'ltr',
      children: blocks.map((b) =>
        b.kind === 'p'
          ? { type: 'paragraph', format: fmt, indent: 0, version: 1, direction: 'ltr' as 'ltr', children: [textChild(b.text)] }
          : { type: 'heading', tag: b.kind, format: fmt, indent: 0, version: 1, direction: 'ltr' as 'ltr', children: [textChild(b.text)] },
      ),
    },
  }
}
```

  - Add a `SEED_WIPE_POSTS` block (mirror `SEED_WIPE_SERVICE_PAGES`): when `process.env.SEED_WIPE_POSTS === '1'`, delete all `posts` then all `authors` (posts first — posts reference authors) before recreating.
  - Add an authors+posts seeding section after the service-pages block. Seed authors first (pl create → ru update), building a `authorKeyToId` map. Then seed posts create-if-absent by slug:
    - upload `coverFile`/`photoFile` to `media` when present (use the existing `abs()` + `payload.create({collection:'media', filePath})` pattern),
    - resolve `relatedServiceSlug` via a `servicePages` slug→id lookup (reuse the existing `slugToId` map / a fresh `payload.find`),
    - create PL with `body: blocksToLexical(p.body.pl)`, then update RU with `body: blocksToLexical(p.body.ru)` (body is localized; no array row-ids needed since there are no localized array fields on posts),
    - second pass: resolve `relatedSlugs` → post ids and update `relatedPosts` (only for posts created this run), mirroring the crossLinks second pass.
  - Gate authors+posts seeding so `SEED_ONLY=posts` runs only this section (and `SEED_ONLY=servicePages` skips it). Pattern: `const seedPosts = fullSeed || seedOnly === 'posts'`.

- [ ] **Step 4: Run the seed locally.**

```bash
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
SEED_WIPE_POSTS=1 pnpm seed
```
Expected: logs show authors created and `posts: created slug "..."` ×4.

- [ ] **Step 5: Commit.**

```bash
git add seed/data/authors.ts seed/data/posts.ts seed/seed.ts
git commit -m "feat(p3): seed authors + 4 handoff blog articles (pl+ru, headings for TOC)"
```

---

## Task 17: E2E tests

**Files:**
- Create: `tests/e2e/blog.spec.ts`

- [ ] **Step 1: Write the e2e tests.** `tests/e2e/blog.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('blog index renders and lists articles', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.locator('h1')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible()
})

test('category filter narrows the grid', async ({ page }) => {
  await page.goto('/blog')
  const cards = page.locator('a[href*="/blog/"]')
  const before = await cards.count()
  await page.getByRole('button', { name: /Depilacja laserowa/i }).click()
  await expect(cards.first()).toBeVisible()
  expect(await cards.count()).toBeLessThanOrEqual(before)
})

test('article renders h1, author byline, CTA', async ({ page }) => {
  await page.goto('/blog/depilacja-laserowa-latem')
  await expect(page.locator('h1')).toBeVisible({ timeout: 30000 })
  await expect(page.locator('main')).toContainText('Wiśnia')
  await expect(page.locator('#post-body')).toBeVisible()
})

test('ru article has lang ru', async ({ page }) => {
  await page.goto('/ru/blog/depilacja-laserowa-latem')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
})

test('unknown post slug 404s', async ({ page }) => {
  const res = await page.goto('/blog/nie-istnieje-wpis')
  expect(res?.status()).toBe(404)
})

test('rss feed responds with xml', async ({ request }) => {
  const res = await request.get('/blog/rss.xml')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('xml')
})
```

- [ ] **Step 2: Run e2e.**

Run: `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH" && pnpm test:e2e -- blog`
Expected: all blog e2e tests pass (Playwright builds + starts the app per `playwright.config.ts`).

- [ ] **Step 3: Commit.**

```bash
git add tests/e2e/blog.spec.ts
git commit -m "test(p3): blog e2e (index, filter, article, ru, 404, rss)"
```

---

## Task 18: Full verification + final commit

- [ ] **Step 1: Type-check.** `pnpm exec tsc --noEmit` → 0 errors.
- [ ] **Step 2: Unit + integration.** `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH" && pnpm test` → all green (existing + new).
- [ ] **Step 3: Build.** `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH" && pnpm build` → success; `/[locale]/blog` and `/[locale]/blog/[slug]` and the RSS routes present.
- [ ] **Step 4: E2E full.** `pnpm test:e2e` → all green (service-page + blog).
- [ ] **Step 5:** If anything failed, fix and re-run from Step 1. No commit needed if Tasks 1–17 already committed cleanly; otherwise commit fixes with a descriptive message.

---

## Deployment (after plan execution, controller-driven)

1. The new migration runs automatically in `vercel-build` (`payload migrate && next build`).
2. Merge to `main` and push → Vercel builds the production deploy (consistent with Phases 1–2; the direct `git push origin main` is the gated step requiring user go-ahead).
3. Seed prod articles + authors with prod credentials:
   ```bash
   DATABASE_URL='<prod>' BLOB_READ_WRITE_TOKEN='<prod>' SEED_ONLY=posts NODE_ENV=production pnpm seed
   ```
4. Verify the live `/blog`, an article, `/ru/blog/<slug>`, and `/blog/rss.xml`.
5. **Owner follow-up:** replace the placeholder author/reviewer with a real named specialist + credentials in `/admin` for full E-E-A-T benefit.

---

## Self-Review (completed by planner)

**Spec coverage:** Posts+Authors collections (T1–T2) ✓; migration (T3) ✓; queries (T4) ✓; reading-time (T5) ✓; lexical-headings/TOC anchors (T6, T10) ✓; medicalWebPageLd (T7) ✓; i18n keys aligned (T8) ✓; components incl. PostCard/PostMeta/AuthorBio/PostCta/TOC/RelatedPosts/BlogIndex/BlogPost (T9–T12) ✓; routes with ISR/metadata/hreflang/canonical/JSON-LD/notFound (T13) ✓; RSS pl+ru (T14) ✓; sitemap + Header/Footer nav (T15) ✓; seed 4 articles + authors (T16) ✓; integration + e2e tests (T4, T5, T6, T7, T17) ✓; design fidelity via ported classes (T9–T13) ✓.

**Type consistency:** `CATEGORY_VALUES` exported from `Posts.ts` and consumed in the index route + BlogIndex. `PostCardData` shape shared by PostCard/RelatedPosts/BlogIndex. `Heading` type shared by lexical-headings + TableOfContents. `readingMinutes`, `slugify`, `extractHeadings`, `medicalWebPageLd` signatures match their tests. `buildFeed` exported from the pl RSS route and imported by the ru route.

**Known verification points for the implementer:** (a) confirm `/ru/blog/rss.xml` static segment resolves ahead of `[locale]` (Task 14 Step 3 + Task 17 rss test); (b) confirm the `getFormatter` date formatting renders in pl/ru; (c) ensure the messages-alignment check passes (Task 8 Step 4).
