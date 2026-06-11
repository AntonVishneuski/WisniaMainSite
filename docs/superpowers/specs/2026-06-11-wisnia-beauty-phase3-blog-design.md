# Wiśnia Beauty — Phase 3: Expert Blog — Design Spec

**Date:** 2026-06-11
**Status:** Approved (design); pending spec review
**Depends on:** Phase 1 (homepage + admin + SEO/analytics base) and Phase 2 (service pages + CMS page management), both built and deployed.

## Goal

Add an SEO-focused **expert blog** (bilingual pl/ru) managed entirely through Payload CMS. The blog captures informational Polish-language search demand around the studio's services (laser hair removal, IPL, RF lifting, vascular lesion removal, facial cleansing, mesotherapy) and funnels readers to the commercial service pages, while signaling expertise (E-E-A-T) for this YMYL-adjacent topic.

## Success criteria

- Owner can create / edit / publish / unpublish / delete articles and authors from `/admin`, in pl and ru.
- `/blog` index renders a card grid with a working category filter; `/blog/[slug]` renders a full article. Russian variants at `/ru/blog` and `/ru/blog/[slug]`.
- Each article emits `MedicalWebPage` + nested `BlogPosting` JSON-LD with author (Person), medical reviewer (`reviewedBy`), `datePublished`, `dateModified`, `lastReviewed`, `image`, `publisher`, and `about` (the related procedure). `BreadcrumbList` JSON-LD too.
- Per-article SEO metadata: title, description, self-referencing canonical per locale, reciprocal hreflang pl/ru + x-default, Open Graph.
- `sitemap.xml` includes `/blog` and every published article (both locales, with hreflang). RSS feeds at `/blog/rss.xml` (pl) and `/ru/blog/rss.xml` (ru).
- Article page includes: cover hero, author byline, reading time, auto table of contents, body, "reviewed by + last reviewed" line, related-service CTA band, 3 related posts, breadcrumb.
- Drafts and unknown slugs return 404 to anonymous users; admins can preview.
- Lighthouse SEO ≥ 95; ISR `revalidate = 3600`; on-demand revalidation on content change.
- Integration + e2e tests green; `tsc`, unit, and build pass.

## Decisions (locked with the owner)

1. **E-E-A-T / authorship:** dedicated `Authors` collection + a medical `reviewedBy` reference per article. Schema is `MedicalWebPage` wrapping `BlogPosting`.
2. **Categories:** 6 fixed categories as a `select` field on `Posts` (no editable `Categories` collection in v1, no per-category archive pages). Localized labels come from the next-intl message catalog. A category filter on the index (client-side, no extra URLs).
3. **Bilingual:** every article is fully bilingual (pl + ru both required). Single pl-based slug shared across locales.
4. **Extra blocks (all enabled):** auto table of contents, reading time, related posts (3), RSS feed. The related-service CTA band is part of the handoff design and is always present when `relatedService` is set.
5. **CMS, not MDX:** articles live in a Payload collection (owner-editable), consistent with Phase 2.

## Architecture

Mirror the Phase 2 service-page architecture. Next.js 16 App Router with a `[locale]` segment, Payload CMS 3 collections, Postgres, Vercel Blob, next-intl (localePrefix `as-needed` → pl unprefixed, ru `/ru`), ISR + on-demand revalidation hooks.

## Data model

### Collection `Posts` (slug `posts`, label "Artykuły / Статьи")
Template: `src/collections/ServicePages.ts`.

| Field | Type | Notes |
|---|---|---|
| `title` | text, **localized**, required | H1, nav, metadata |
| `slug` | text, unique, indexed, required | pl-based, shared across locales |
| `status` | select `draft`/`published`, default `draft` | gates public read |
| `publishedAt` | date | shown in meta; used for sort + `datePublished` |
| `lastReviewed` | date, optional | E-E-A-T "last medically reviewed" |
| `category` | select (6 fixed values), required | card tag + filter; labels via messages |
| `excerpt` | textarea, **localized** | card text + meta-description fallback |
| `cover` | upload → `media`, alt localized | hero + OG fallback |
| `body` | richText (lexical), **localized**, required | article content |
| `author` | relationship → `authors`, required | byline + JSON-LD `author` |
| `reviewedBy` | relationship → `authors`, optional | medical reviewer + JSON-LD `reviewedBy` |
| `relatedService` | relationship → `servicePages`, optional | CTA band + JSON-LD `about` |
| `relatedPosts` | relationship → `posts`, hasMany, optional | "related"; auto-fill 3 by category when empty |
| SEO (collapsible) | `metaTitle` (loc), `metaDescription` (loc), `ogImage` (upload), `noindex` (checkbox) | flat fields at doc top level (collapsible = flat) |

- **Hooks:** `afterChange` / `afterDelete` → revalidate `/blog`, `/ru/blog`, `/blog/<slug>`, `/ru/blog/<slug>` (reuse the Phase 2 revalidation pattern).
- **Access:** `read: ({req}) => req.user ? true : { status: { equals: 'published' } }` (same as service pages). `dateModified` uses Payload's automatic `updatedAt`.

**Category values:** `depilacja-laserowa`, `odmlodzenie-twarzy`, `czyszczenie-pielegnacja`, `zabiegi-specjalistyczne`, `poradniki-faq`, `sezonowo-trendy`. Frontend labels via `blog.category.<value>` messages (pl/ru).

### Collection `Authors` (slug `authors`, label "Autorzy / Авторы")
| Field | Type | Notes |
|---|---|---|
| `name` | text, **localized**, required | allows Cyrillic ru spelling |
| `jobTitle` | text, **localized** | e.g. "Kosmetolog dyplomowany" / "Дипломированный косметолог" |
| `credentials` | text, **localized** | certifications / experience |
| `photo` | upload → `media`, optional | byline avatar |
| `bio` | textarea, **localized**, optional | short bio under article |

No author archive pages in v1. Author/reviewer data renders in the article and in JSON-LD as a `Person`.

## Routes (`src/app/(frontend)/[locale]/blog/`)

- **`/blog` index** (`page.tsx`): subhero header + `.blog-grid` (3-col) of `PostCard`s + client-side category filter chips. Lists `published` posts for the locale, sorted by `publishedAt` desc. `generateMetadata` (title/description/hreflang). ISR `revalidate = 3600`.
- **`/blog/[slug]`** (`[slug]/page.tsx`): breadcrumb → cover hero → H1 → `PostMeta` (date + reading time + author byline) → `TableOfContents` → body (`RichText`, `.post__wrap` max 760px) → reviewer + lastReviewed line → `PostCta` (related-service band) → `RelatedPosts` (3) → back link. `generateStaticParams` over published slugs × locales. `generateMetadata` (canonical self, hreflang pl/ru + x-default, OG). `MedicalWebPage`+`BlogPosting` and `BreadcrumbList` JSON-LD. ISR `revalidate = 3600`. `notFound()` for draft/missing.
- **RSS:** `/blog/rss.xml` (pl) and `/ru/blog/rss.xml` (ru) as route handlers returning `application/rss+xml`; latest published posts, title/excerpt/link/pubDate.
- **Navigation:** add "Blog" to Header nav and a Footer link, both localized (`nav.blog`).

## Components (`src/components/blog/`)

- `PostCard.tsx` — card (cover, category tag, title, excerpt, "read more").
- `BlogIndex.tsx` — grid + category filter (client component).
- `BlogPost.tsx` — article assembler (async server component).
- `PostMeta.tsx` — date + reading time + author byline.
- `TableOfContents.tsx` — built from body headings.
- `AuthorBio.tsx` — author (+ reviewer) block with photo/credentials.
- `RelatedPosts.tsx` — 3 related post cards.
- `PostCta.tsx` — related-service CTA band (`.post__cta`).
- Reuse: `Breadcrumb`, `Reveal`, `CtaLink`.
- Utilities: `lib/reading-time.ts` (word count from lexical body → minutes); `lib/lexical-headings.ts` (extract h2/h3 → slugged ids; a custom RichText heading converter injects matching `id`s so TOC anchors resolve).

## Queries (`src/lib/queries.ts`)

Add (catch-guarded, returning safe fallbacks, mirroring service-page queries):
- `getPublishedPosts(locale, { category? })` — depth 1 (cover + author), sort `-publishedAt`, limit 100.
- `getPost(slug, locale)` — depth 2 (cover, author, reviewedBy, relatedService, relatedPosts).
- `getPostParams()` — published slugs for `generateStaticParams`.
- `getRelatedPosts(post, locale)` — explicit `relatedPosts` or fallback to same-category, excluding self, limit 3.

## SEO / JSON-LD (`src/lib/jsonld.tsx`)

- New `medicalWebPageLd({...})` → `@type: MedicalWebPage` with nested `BlogPosting` props: `headline`, `description`, `author` (Person + jobTitle + url), `reviewedBy` (Person), `datePublished`, `dateModified`, `lastReviewed`, `image` (ImageObject), `publisher` (Organization), `about` (MedicalProcedure from `relatedService`), `inLanguage`, `mainEntityOfPage`. Reuse the existing `JsonLd` escaping wrapper.
- Reuse `breadcrumbLd`.
- Do **not** use `FAQPage` schema (per 2026 guidance). FAQ-style content lives in the body prose.

## i18n / sitemap / migration

- `messages/{pl,ru}.json` (aligned): `nav.blog`, `breadcrumb.blog`, `blog.title`, `blog.intro`, `blog.readMore`, `blog.readingTime`, `blog.minutesShort`, `blog.publishedOn`, `blog.updatedOn`, `blog.reviewedBy`, `blog.author`, `blog.toc`, `blog.relatedPosts`, `blog.relatedServiceCtaTitle`, `blog.relatedServiceCtaButton`, `blog.allCategories`, `blog.backToBlog`, and `blog.category.<6 values>`.
- `src/app/(frontend)/sitemap.ts`: add `/blog` to static paths + map `getPostParams()` slugs to `/blog/<slug>` with pl/ru/x-default hreflang (same shape as service pages).
- `payload migrate:create` to generate the migration adding `posts` + `authors` tables; commit it. `vercel-build` already runs `payload migrate` before `next build`.

## Seed + content (`seed/`)

- `seed/data/authors.ts` — 1–2 authors. Placeholder credentials ("Zespół Wiśnia Beauty") to be replaced by the owner with a real named specialist + reviewer.
- `seed/data/posts.ts` — the 4 handoff articles (`depilacja-laserowa-latem`, `dlaczego-pojawiaja-sie-przebarwienia`, `jak-usunac-naczynka-na-twarzy`, `ipl-czy-rf-lifting`): pl body from the handoff HTML, ru from the inline i18n dictionary, category assigned, `relatedService` linked, cover where available.
- `seed/seed.ts` — add `posts`/`authors` seeding via `textToLexical`; support `SEED_ONLY=posts` and `SEED_WIPE_POSTS=1` (create-if-absent by slug by default; non-destructive for prod).

> **Owner action (non-blocking):** provide real author + medical-reviewer name / job title / credentials for full E-E-A-T benefit. Until then the seeded placeholder is used and is editable in `/admin`.

## Testing

- **Integration** (`tests/int/*.int.spec.ts`): `posts` create/read, draft excluded from public read, query helpers, `medicalWebPageLd` shape, `reading-time` util.
- **E2E** (`tests/e2e/*.spec.ts`): index renders + category filter narrows the grid; article renders H1 + author byline + TOC + related-service CTA; ru article has `lang="ru"`; draft/unknown slug → 404; `/blog/rss.xml` → 200 `application/rss+xml`.

## Design fidelity

Port `.blog-grid`, `.post-card` (+ `__tag`/`__body`/`__more`), `.post`/`.post__wrap`/`.post__meta`/`.post__cta`, `.subhero`, `.breadcrumb` from `wisnia-beauty/design_handoff/preview/blog/*` to Tailwind v4 utilities + `@theme` tokens, 1:1. New elements (author bio, TOC, reading time, related posts) are styled in the same visual language (cherry / rose-gold / Cormorant serif / Jost sans, existing radius/shadow tokens).

## Deployment

Migration runs in `vercel-build`. After deploy, seed prod with `SEED_ONLY=posts` (+ authors) using prod credentials. Push to `main` triggers the Vercel production deploy (consistent with Phases 1–2).

## Out of scope (YAGNI for v1)

Editable `Categories` collection, per-category archive pages, author archive pages, comments, `FAQPage` schema, news sitemap, machine translation, email newsletter. Revisit tags/archives only if the blog grows past ~200 articles.
