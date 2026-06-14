# Hero video — design spec

Date: 2026-06-14
Status: Approved (pending plan)

## Goal

Allow the two site "heroes" to show an uploaded **video** instead of (or as a richer
version of) the current photo, fully editable from the Payload CMS — no code change
to swap media:

- **Home hero** — `src/components/home/Hero.tsx` (today: hardcoded `/assets/hero-olga.jpg`).
- **Service hero** — `src/components/service/ServiceHero.tsx` (today: CMS `heroImage`, with a
  "photo soon" placeholder when empty).

When no video is set, behaviour is **identical to today** (photo / placeholder).

## Decisions (locked)

- **Source:** uploaded file (`video/*`, e.g. MP4/WebM), self-hosted via the existing
  Vercel Blob storage. No YouTube/Vimeo embeds → no third-party cookies, clean for RODO.
- **Playback:** decorative "living photo" — `autoplay + muted + loop + playsinline`,
  no controls. Respects `prefers-reduced-motion` (motion-averse users see the poster
  image, video does not autoplay).
- **Poster / fallback:** the hero photo is the poster. It shows instantly (no layout
  shift), under reduced-motion, and if the video fails to load.
- **Storage model:** dedicated `media-videos` collection (Approach A), so image-only
  upload fields (`heroImage`, `ogImage`, `beforeImage`, `afterImage`) stay image-only and
  the media library doesn't mix types. (Rejected: widening `media` to `image/*,video/*`.)

## CMS model

### New collection `media-videos`
- `src/collections/MediaVideos.ts`, slug `media-videos`, admin label "Wideo", group `Treść`.
- `upload: { mimeTypes: ['video/*'] }`, no `imageSizes` (no resizing for video).
- `access: { read: () => true }` (public), `afterChange`/`afterDelete` → revalidate hooks
  (same as `Media`).
- Field: `alt` (text, localized, optional) — accessible description / internal label.
- Register in `payload.config.ts` `vercelBlobStorage({ collections: { media: true, 'media-videos': true } })`.
- Add to `collections: [...]` array in `payload.config.ts`.

### `ServicePages` (`src/collections/ServicePages.ts`)
- Add `heroVideo` upload field (`relationTo: 'media-videos'`) directly after `heroImage`.
- `admin.description`: "Opcjonalnie. Jeśli ustawione — w hero odtwarza się wideo (bez
  dźwięku, w pętli); zdjęcie służy jako poster i zapas."
- `heroImage` keeps its role; description updated to note it is the poster/fallback.

### `Settings` global (`src/globals/Settings.ts`)
- New collapsible "Hero (strona główna)" with one field: `heroVideo` upload
  (`relationTo: 'media-videos'`).
- Home poster stays the hardcoded `/assets/hero-olga.jpg` (out of scope to make it
  CMS-editable — YAGNI; can be added later).

## Shared component: `HeroMedia`

`src/components/ui/HeroMedia.tsx` — one presentational unit, used by **both** heroes. Single
responsibility: render the hero media slot.

Props:
```
{ videoUrl?: string | null; posterUrl?: string | null; alt: string;
  priority?: boolean; sizes?: string; placeholder?: React.ReactNode }
```

Behaviour:
- Renders into a parent-provided sized box (`relative aspect-[4/5] rounded-[var(--radius-xl)]
  overflow-hidden`); the media fills it with `object-cover`.
- **Client component** (`'use client'`) so it can read `prefers-reduced-motion`:
  - SSR + first client render → render the **poster `<Image fill>`** (matches server →
    no hydration mismatch).
  - After mount, if `videoUrl` is set AND motion is allowed → upgrade to
    `<video autoPlay muted loop playsInline preload="metadata" poster={posterUrl}>`.
  - `onError` on the video → fall back to the poster image.
- If no `videoUrl` → `<Image>` (today's behaviour).
- If neither video nor poster → render `placeholder` (ServiceHero passes the existing
  "photoSoon" box; the home hero always has a poster, so it never hits this).

Both heroes are refactored to render their media column through `HeroMedia`. The home hero
switches its fixed `420×525` `<Image>` to a `fill` image inside a `max-w-[420px] aspect-[4/5]`
box — visually identical (the jpg is already 4:5).

## Data flow

- Home: `page.tsx` already fetches the `settings` global → pass `settings.heroVideo?.url`
  and poster `/assets/hero-olga.jpg` into `Hero` → `HeroMedia`.
- Service: `ServicePage.tsx` passes `page.heroVideo?.url` (video) and `page.heroImage?.url`
  (poster) into `ServiceHero` → `HeroMedia`.
- Default Payload query depth already populates `upload` relations to `.url` (as `heroImage`
  is today), so no depth changes needed.

## Migration & types

- New table `media_videos` + `hero_video_id` columns (with FKs) on `service_pages` and
  `settings`. Generate a migration in the existing `src/migrations/` style.
- Regenerate `src/payload-types.ts` (adds `MediaVideo` interface + `heroVideo` fields).
- Seed unchanged — `heroVideo` defaults empty → today's photo behaviour preserved.

## Testing

Unit test `tests/unit/hero-media.test.tsx` (Vitest + Testing Library + jsdom), mocking
`window.matchMedia`:
- `videoUrl` + motion allowed → renders `<video>` with `muted`, `loop`, `playsinline`,
  `autoplay` and the `poster` set to `posterUrl`.
- `videoUrl` + `prefers-reduced-motion: reduce` → renders the poster image, **no** `<video>`.
- no `videoUrl`, poster present → renders the image.
- neither → renders the provided `placeholder`.

## Performance & edge cases

- Fixed `aspect-[4/5]` box → no layout shift; poster carries `priority` for LCP.
- `preload="metadata"` to limit upfront bandwidth; muted+playsinline → iOS autoplay works.
- Video load failure → poster remains (native `poster` + `onError` fallback).

## Out of scope (YAGNI)

- CMS-editable poster for the home hero (stays hardcoded jpg).
- External video embeds (YouTube/Vimeo).
- Multiple encoded sources / transcoding pipeline (single uploaded file; browser plays
  whatever `video/*` was uploaded — recommend MP4/H.264 for max compatibility).
- Click-to-play / sound / controls.
