# Hero video (uploaded MP4/WebM) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let both site heroes (home `Hero`, service `ServiceHero`) show an uploaded, CMS-editable video (autoplay/muted/loop) with the existing photo as poster/fallback; behaviour with no video is unchanged.

**Architecture:** A dedicated `media-videos` upload collection (Vercel Blob) holds the video files. A new `heroVideo` upload field is added to `ServicePages` and the `Settings` global. A single shared client component `HeroMedia` renders the media slot — video when present and motion is allowed, else the poster image, else a placeholder — and both heroes render their media column through it.

**Tech Stack:** Next.js 16 (App Router), Payload CMS 3, Postgres, Vercel Blob storage, next-intl, Vitest + Testing Library (jsdom), Tailwind.

**Prerequisites:** Tasks 4–5 (Payload migration + type generation) require a working DB connection — set `DATABASE_URL` (or `POSTGRES_URL`) and `PAYLOAD_SECRET` in `.env`. The component tasks (Task 1) and final unit-test/typecheck gates run without a DB.

**Spec:** `docs/superpowers/specs/2026-06-14-hero-video-design.md`

---

## File structure

- Create `src/components/ui/HeroMedia.tsx` — the shared media-slot component (video/image/placeholder + reduced-motion). One responsibility.
- Create `tests/unit/hero-media.test.tsx` — unit tests for `HeroMedia`.
- Create `src/collections/MediaVideos.ts` — the `media-videos` upload collection.
- Modify `src/payload.config.ts` — register collection + Vercel Blob.
- Modify `src/collections/ServicePages.ts` — add `heroVideo` field.
- Modify `src/globals/Settings.ts` — add "Hero (strona główna)" section with `heroVideo`.
- Create `src/migrations/<timestamp>_hero_video.ts` + modify `src/migrations/index.ts` — generated.
- Modify `src/payload-types.ts` — generated.
- Modify `src/components/service/ServiceHero.tsx` + `src/components/service/ServicePage.tsx` — wire video.
- Modify `src/components/home/Hero.tsx` — wire video through `HeroMedia`.

---

### Task 1: `HeroMedia` shared component (TDD, no DB)

**Files:**
- Create: `src/components/ui/HeroMedia.tsx`
- Test: `tests/unit/hero-media.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/hero-media.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { HeroMedia } from '../../src/components/ui/HeroMedia'

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

afterEach(() => cleanup())

describe('HeroMedia', () => {
  it('plays the video (muted/loop/playsinline/autoplay + poster) when motion is allowed', () => {
    mockReducedMotion(false)
    const { container } = render(
      <HeroMedia videoUrl="/v.mp4" posterUrl="/p.jpg" alt="hero" sizes="420px" />,
    )
    const video = container.querySelector('video') as HTMLVideoElement | null
    expect(video).toBeTruthy()
    expect(video!.muted).toBe(true)
    expect(video!.loop).toBe(true)
    expect(video!.autoplay).toBe(true)
    expect(video!.playsInline).toBe(true)
    expect(video!.getAttribute('preload')).toBe('metadata')
    expect(video!.getAttribute('poster')).toBe('/p.jpg')
    expect(video!.querySelector('source')?.getAttribute('src')).toBe('/v.mp4')
  })

  it('shows the poster image (no video) under prefers-reduced-motion', () => {
    mockReducedMotion(true)
    const { container } = render(
      <HeroMedia videoUrl="/v.mp4" posterUrl="/p.jpg" alt="hero" sizes="420px" />,
    )
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img')).toBeTruthy()
  })

  it('shows the image when there is no video', () => {
    mockReducedMotion(false)
    const { container } = render(
      <HeroMedia posterUrl="/p.jpg" alt="hero" sizes="420px" />,
    )
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img')).toBeTruthy()
  })

  it('renders the placeholder when neither video nor poster is set', () => {
    mockReducedMotion(false)
    const { container, getByText } = render(
      <HeroMedia alt="hero" placeholder={<span>brak</span>} />,
    )
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('img')).toBeNull()
    expect(getByText('brak')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run tests/unit/hero-media.test.tsx`
Expected: FAIL — `Failed to resolve import ".../src/components/ui/HeroMedia"`.

- [ ] **Step 3: Write the component**

Create `src/components/ui/HeroMedia.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type Props = {
  videoUrl?: string | null
  posterUrl?: string | null
  alt: string
  priority?: boolean
  sizes?: string
  placeholder?: React.ReactNode
}

// Renders the hero media slot into a parent-provided sized box
// (relative aspect-[4/5] rounded overflow-hidden). SSR + first client render show
// the poster image (no hydration mismatch); after mount we upgrade to an
// autoplay/muted/loop video unless the visitor prefers reduced motion or the
// video errors. With no video the image renders as today; with neither, the
// caller's placeholder is shown.
export function HeroMedia({ videoUrl, posterUrl, alt, priority, sizes, placeholder }: Props) {
  const [playVideo, setPlayVideo] = useState(false)

  useEffect(() => {
    if (!videoUrl) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (!reduce) setPlayVideo(true)
  }, [videoUrl])

  if (videoUrl && playVideo) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterUrl ?? undefined}
        aria-label={alt}
        onError={() => setPlayVideo(false)}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} />
      </video>
    )
  }

  if (posterUrl) {
    return <Image src={posterUrl} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
  }

  return <>{placeholder ?? null}</>
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm exec vitest run tests/unit/hero-media.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/HeroMedia.tsx tests/unit/hero-media.test.tsx
git commit -m "feat(ui): HeroMedia — video/image hero slot with reduced-motion + poster fallback" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: `media-videos` upload collection

**Files:**
- Create: `src/collections/MediaVideos.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Create the collection**

Create `src/collections/MediaVideos.ts`:

```ts
import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const MediaVideos: CollectionConfig = {
  slug: 'media-videos',
  labels: { singular: 'Wideo', plural: 'Wideo' },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Treść',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
  ],
  upload: {
    mimeTypes: ['video/*'],
  },
}
```

- [ ] **Step 2: Register it in the Payload config**

In `src/payload.config.ts`, add the import after the `Media` import (line 10):

```ts
import { MediaVideos } from './collections/MediaVideos'
```

Add it to the `collections` array (line 29) right after `Media`:

```ts
  collections: [Users, Media, MediaVideos, Prices, Reviews, BeforeAfter, ServicePages, Authors, Posts],
```

Enable Vercel Blob for it (line 53):

```ts
      collections: { media: true, 'media-videos': true },
```

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0 (no errors).

- [ ] **Step 4: Commit**

```bash
git add src/collections/MediaVideos.ts src/payload.config.ts
git commit -m "feat(cms): add media-videos upload collection (video/*) on Vercel Blob" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: `heroVideo` fields on `ServicePages` + `Settings`

**Files:**
- Modify: `src/collections/ServicePages.ts` (the `Hero` collapsible)
- Modify: `src/globals/Settings.ts`

- [ ] **Step 1: Add `heroVideo` to the ServicePages Hero group**

In `src/collections/ServicePages.ts`, replace the `Hero` collapsible block:

```ts
    { type: 'collapsible', label: 'Hero', fields: [
      { name: 'heroImage', type: 'upload', relationTo: 'media' },
      { name: 'heading', type: 'text', localized: true },
      { name: 'intro', type: 'textarea', localized: true },
      { name: 'priceFrom', type: 'text', localized: true,
        admin: { description: 'Opcjonalna cena „od” obok CTA w hero, np. „od 550 zł” / „от 550 zł”' } },
    ] },
```

with:

```ts
    { type: 'collapsible', label: 'Hero', fields: [
      { name: 'heroImage', type: 'upload', relationTo: 'media',
        admin: { description: 'Zdjęcie hero. Jeśli ustawione jest też wideo — służy jako poster/zapas.' } },
      { name: 'heroVideo', type: 'upload', relationTo: 'media-videos',
        admin: { description: 'Opcjonalnie. Jeśli ustawione — w hero odtwarza się wideo (bez dźwięku, w pętli); zdjęcie służy jako poster i zapas.' } },
      { name: 'heading', type: 'text', localized: true },
      { name: 'intro', type: 'textarea', localized: true },
      { name: 'priceFrom', type: 'text', localized: true,
        admin: { description: 'Opcjonalna cena „od” obok CTA w hero, np. „od 550 zł” / „от 550 zł”' } },
    ] },
```

- [ ] **Step 2: Add the "Hero (strona główna)" section to Settings**

In `src/globals/Settings.ts`, add a new collapsible to the `fields` array, immediately after the `'Analityka / domena'` collapsible (before the closing `]` of `fields`):

```ts
    { type: 'collapsible', label: 'Hero (strona główna)', fields: [
      { name: 'heroVideo', type: 'upload', relationTo: 'media-videos',
        admin: { description: 'Opcjonalne wideo w hero strony głównej (bez dźwięku, w pętli). Bez niego pokazywane jest zdjęcie.' } },
    ] },
```

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0. (`page.heroVideo` / `settings.heroVideo` aren't referenced yet, so no type errors despite `payload-types.ts` not being regenerated until Task 4.)

- [ ] **Step 4: Commit**

```bash
git add src/collections/ServicePages.ts src/globals/Settings.ts
git commit -m "feat(cms): heroVideo field on service pages + home hero settings" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Generate migration + regenerate types (needs DB)

**Files:**
- Create: `src/migrations/<timestamp>_hero_video.ts` (generated)
- Modify: `src/migrations/index.ts` (generated)
- Modify: `src/payload-types.ts` (generated)

- [ ] **Step 1: Generate the migration**

Ensure `.env` has `DATABASE_URL` (or `POSTGRES_URL`) and `PAYLOAD_SECRET`. Then run:

Run: `pnpm payload migrate:create hero_video`
Expected: a new file `src/migrations/<timestamp>_hero_video.ts` is created and `src/migrations/index.ts` gains its entry. The SQL should `CREATE TABLE "media_videos"` (+ `"media_videos_locales"` for `alt`) and `ALTER TABLE "service_pages" ADD COLUMN "hero_video_id"` and `ALTER TABLE "settings" ADD COLUMN "hero_video_id"` with FK constraints.

- [ ] **Step 2: Regenerate Payload types**

Run: `pnpm generate:types`
Expected: `src/payload-types.ts` gains a `MediaVideo` interface and `heroVideo?: (number | null) | MediaVideo` on both `ServicePage` and `Setting`.

- [ ] **Step 3: Apply the migration locally and verify**

Run: `pnpm payload migrate`
Expected: migration applies cleanly (exit 0).

- [ ] **Step 4: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/migrations src/payload-types.ts
git commit -m "feat(cms): migration + types for media-videos and heroVideo relations" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Wire `ServiceHero` through `HeroMedia`

**Files:**
- Modify: `src/components/service/ServiceHero.tsx`
- Modify: `src/components/service/ServicePage.tsx:58-64`

- [ ] **Step 1: Update `ServiceHero` to accept a video and render via `HeroMedia`**

In `src/components/service/ServiceHero.tsx`:

Replace the imports block top:

```tsx
'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ImageIcon } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaButtons'
import { contactLinks, type ContactSettings } from '@/lib/contact-links'

export type ServiceHeroImage = {
  url?: string | null
  alt?: string | null
} | null
```

with:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { ImageIcon } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaButtons'
import { HeroMedia } from '@/components/ui/HeroMedia'
import { contactLinks, type ContactSettings } from '@/lib/contact-links'

export type ServiceHeroImage = {
  url?: string | null
  alt?: string | null
} | null

export type ServiceHeroVideo = {
  url?: string | null
} | null
```

Add `video` to the props. Replace the function signature/destructure:

```tsx
export function ServiceHero({
  heading,
  intro,
  image,
  settings,
  priceFrom,
}: {
  heading: string
  intro?: string | null
  image?: ServiceHeroImage
  settings: ContactSettings
  priceFrom?: string | null
}) {
```

with:

```tsx
export function ServiceHero({
  heading,
  intro,
  image,
  video,
  settings,
  priceFrom,
}: {
  heading: string
  intro?: string | null
  image?: ServiceHeroImage
  video?: ServiceHeroVideo
  settings: ContactSettings
  priceFrom?: string | null
}) {
```

Replace the entire `{/* Media column */}` block:

```tsx
        {/* Media column */}
        <div className="max-w-[420px] min-[960px]:max-w-none min-[960px]:mt-0 mt-1.5">
          {image?.url ? (
            <div className="relative aspect-[4/5] rounded-[var(--radius-xl)] overflow-hidden shadow-lg">
              <Image
                src={image.url}
                alt={image.alt ?? heading}
                fill
                className="object-cover"
                sizes="(max-width: 960px) 420px, 50vw"
              />
            </div>
          ) : (
            <div className="aspect-[4/5] rounded-[var(--radius-xl)] flex flex-col items-center justify-center gap-2.5 bg-blush border border-dashed border-[var(--line-warm)] text-gray-soft text-center px-5">
              <ImageIcon className="w-[34px] h-[34px] text-rose-gold" aria-hidden="true" />
              <span className="text-[14px] tracking-[0.04em]">{tSvc('photoSoon')}</span>
            </div>
          )}
        </div>
```

with:

```tsx
        {/* Media column */}
        <div className="max-w-[420px] min-[960px]:max-w-none min-[960px]:mt-0 mt-1.5">
          {video?.url || image?.url ? (
            <div className="relative aspect-[4/5] rounded-[var(--radius-xl)] overflow-hidden shadow-lg">
              <HeroMedia
                videoUrl={video?.url}
                posterUrl={image?.url}
                alt={image?.alt ?? heading}
                sizes="(max-width: 960px) 420px, 50vw"
              />
            </div>
          ) : (
            <div className="aspect-[4/5] rounded-[var(--radius-xl)] flex flex-col items-center justify-center gap-2.5 bg-blush border border-dashed border-[var(--line-warm)] text-gray-soft text-center px-5">
              <ImageIcon className="w-[34px] h-[34px] text-rose-gold" aria-hidden="true" />
              <span className="text-[14px] tracking-[0.04em]">{tSvc('photoSoon')}</span>
            </div>
          )}
        </div>
```

(`Image` is no longer used in this file — its import was removed above.)

- [ ] **Step 2: Pass `video` from `ServicePage`**

In `src/components/service/ServicePage.tsx`, replace the `<ServiceHero ... />` block:

```tsx
        <ServiceHero
          heading={page.heading || page.title}
          intro={page.intro ?? undefined}
          image={page.heroImage ?? undefined}
          settings={settings}
          priceFrom={page.priceFrom ?? undefined}
        />
```

with:

```tsx
        <ServiceHero
          heading={page.heading || page.title}
          intro={page.intro ?? undefined}
          image={page.heroImage ?? undefined}
          video={page.heroVideo ?? undefined}
          settings={settings}
          priceFrom={page.priceFrom ?? undefined}
        />
```

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0. (`page.heroVideo` exists after Task 4; `ServiceHeroImage`/`ServiceHeroVideo` are structurally compatible with the populated upload object's `.url`.)

- [ ] **Step 4: Run the unit suite**

Run: `pnpm exec vitest run tests/unit`
Expected: PASS (all tests, including `hero-media`).

- [ ] **Step 5: Commit**

```bash
git add src/components/service/ServiceHero.tsx src/components/service/ServicePage.tsx
git commit -m "feat(service): render service hero media via HeroMedia (video or photo)" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Wire home `Hero` through `HeroMedia`

**Files:**
- Modify: `src/components/home/Hero.tsx`

- [ ] **Step 1: Import `HeroMedia` and extend `HeroSettings`**

In `src/components/home/Hero.tsx`, replace the import + type block:

```tsx
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Award, Stethoscope, UserCheck, Star } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaButtons'
import { contactLinks, type ContactSettings } from '@/lib/contact-links'

type HeroSettings = ContactSettings & {
  whatsapp?: string | null
  phone?: string | null
  booksyUrl?: string | null
}
```

with:

```tsx
import { useTranslations } from 'next-intl'
import { Award, Stethoscope, UserCheck, Star } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaButtons'
import { HeroMedia } from '@/components/ui/HeroMedia'
import { contactLinks, type ContactSettings } from '@/lib/contact-links'

type HeroSettings = ContactSettings & {
  whatsapp?: string | null
  phone?: string | null
  booksyUrl?: string | null
  heroVideo?: { url?: string | null } | null
}
```

- [ ] **Step 2: Render the media column via `HeroMedia`**

In `src/components/home/Hero.tsx`, replace the `{/* Media column */}` block:

```tsx
        {/* Media column */}
        <div className="relative w-full max-w-[420px] mx-auto min-[960px]:mx-0">
          <Image
            src="/assets/hero-olga.jpg"
            alt="Olga Vishneuskaya przy pracy"
            width={420}
            height={525}
            priority
            className="w-full h-auto rounded-[var(--radius-xl)] object-cover shadow-[0_24px_60px_rgba(110,18,44,0.12)]"
          />
        </div>
```

with:

```tsx
        {/* Media column */}
        <div className="relative w-full max-w-[420px] mx-auto min-[960px]:mx-0 aspect-[4/5] rounded-[var(--radius-xl)] overflow-hidden shadow-[0_24px_60px_rgba(110,18,44,0.12)]">
          <HeroMedia
            videoUrl={settings?.heroVideo?.url}
            posterUrl="/assets/hero-olga.jpg"
            alt="Olga Vishneuskaya przy pracy"
            priority
            sizes="420px"
          />
        </div>
```

(`Image` is no longer used in this file — its import was removed above.)

- [ ] **Step 3: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0. (`page.tsx` already passes `s` as `any` to `Hero`, so `settings.heroVideo` is accepted.)

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.tsx
git commit -m "feat(home): render home hero media via HeroMedia (optional CMS video)" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Final verification

**Files:** none (gate only)

- [ ] **Step 1: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0.

- [ ] **Step 2: Unit tests**

Run: `pnpm test`
Expected: all unit test files pass, including `tests/unit/hero-media.test.tsx`.

- [ ] **Step 3: Build (needs DB env)**

Run: `pnpm build`
Expected: build succeeds. Confirms server components compile and the populated `heroVideo` relation type-checks end to end.

- [ ] **Step 4: Manual smoke (optional, needs DB + admin)**

In the Payload admin: upload a short MP4 under "Wideo", set it on a service page's `heroVideo` (and/or Settings → Hero), open the page — the video autoplays muted/looping; the photo shows as poster while loading and under `prefers-reduced-motion`; with no video the photo renders exactly as before.

---

## Self-review notes

- **Spec coverage:** source=upload (Task 2 collection), both heroes (Tasks 5–6), autoplay/muted/loop + reduced-motion + poster fallback (Task 1), dedicated `media-videos` collection (Task 2), heroVideo on ServicePages + Settings (Task 3), migration+types (Task 4), tests (Task 1), no-video = unchanged behaviour (Tasks 5–6 conditionals). All covered.
- **No new i18n strings:** admin descriptions are inline in collection configs; the `service.photoSoon` placeholder already exists.
- **Type consistency:** `HeroMedia` prop names (`videoUrl`, `posterUrl`, `alt`, `priority`, `sizes`, `placeholder`) are identical across Task 1 definition and Tasks 5–6 usage. `ServiceHeroVideo` defined in Task 5 matches the `{ url?: string | null }` shape used for `video`.
