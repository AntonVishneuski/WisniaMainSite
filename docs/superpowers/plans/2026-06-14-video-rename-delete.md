# Video rename/title/delete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename "Wideo" labels to "Video", add a required `title` field to the `media-videos` collection so videos can be named in admin, and write the DB migration.

**Architecture:** Three independent edits — label text (no DB), collection field config + payload-types.ts (no DB), and a raw-SQL Payload migration. Delete functionality already works via vercelBlobStorage plugin's `handleDelete`.

**Tech Stack:** Payload CMS 3.x, PostgreSQL, `@payloadcms/db-postgres`, TypeScript

---

### Task 1: Rename "wideo" → "video" labels

**Files:**
- Modify: `src/collections/MediaVideos.ts`
- Modify: `src/globals/Settings.ts`
- Modify: `src/collections/ServicePages.ts`

- [ ] **Step 1: Edit `src/collections/MediaVideos.ts` — change labels**

Replace:
```ts
labels: { singular: 'Wideo', plural: 'Wideo' },
```
With:
```ts
labels: { singular: 'Video', plural: 'Video' },
```

- [ ] **Step 2: Edit `src/globals/Settings.ts` line 47 — change description**

Replace:
```ts
admin: { description: 'Opcjonalne wideo w hero strony głównej (bez dźwięku, w pętli). Bez niego pokazywane jest zdjęcie.' }
```
With:
```ts
admin: { description: 'Opcjonalne video w hero strony głównej (bez dźwięku, w pętli). Bez niego pokazywane jest zdjęcie.' }
```

- [ ] **Step 3: Edit `src/collections/ServicePages.ts` lines 27 and 29 — change 2 descriptions**

Line 27, replace:
```ts
admin: { description: 'Zdjęcie hero. Jeśli ustawione jest też wideo — służy jako poster/zapas.' }
```
With:
```ts
admin: { description: 'Zdjęcie hero. Jeśli ustawione jest też video — służy jako poster/zapas.' }
```

Line 29, replace:
```ts
admin: { description: 'Opcjonalnie. Jeśli ustawione — w hero odtwarza się wideo (bez dźwięku, w pętli); zdjęcie służy jako poster i zapas.' }
```
With:
```ts
admin: { description: 'Opcjonalnie. Jeśli ustawione — w hero odtwarza się video (bez dźwięku, w pętli); zdjęcie służy jako poster i zapas.' }
```

- [ ] **Step 4: Commit**

```bash
git add src/collections/MediaVideos.ts src/globals/Settings.ts src/collections/ServicePages.ts
git commit -m "chore(cms): rename Wideo → Video in admin labels and descriptions"
```

---

### Task 2: Add `title` field to MediaVideos + update types

**Files:**
- Modify: `src/collections/MediaVideos.ts`
- Modify: `src/payload-types.ts`

- [ ] **Step 1: Edit `src/collections/MediaVideos.ts` — add `useAsTitle` and `title` field**

Replace the entire file content with:
```ts
import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const MediaVideos: CollectionConfig = {
  slug: 'media-videos',
  labels: { singular: 'Video', plural: 'Video' },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Treść',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
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

- [ ] **Step 2: Update `src/payload-types.ts` — add `title` to `MediaVideo` interface**

Find the `MediaVideo` interface (around line 213). Replace:
```ts
export interface MediaVideo {
  id: number;
  alt?: string | null;
```
With:
```ts
export interface MediaVideo {
  id: number;
  title: string;
  alt?: string | null;
```

- [ ] **Step 3: Update `src/payload-types.ts` — add `title` to `MediaVideosSelect`**

Find the `MediaVideosSelect` interface (around line 656). Replace:
```ts
export interface MediaVideosSelect<T extends boolean = true> {
  alt?: T;
```
With:
```ts
export interface MediaVideosSelect<T extends boolean = true> {
  title?: T;
  alt?: T;
```

- [ ] **Step 4: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Run unit tests**

```bash
npm test
```

Expected: all unit tests pass (3–4 tests in `tests/unit/`).

- [ ] **Step 6: Commit**

```bash
git add src/collections/MediaVideos.ts src/payload-types.ts
git commit -m "feat(cms): add title field to media-videos collection"
```

---

### Task 3: Write migration for `title` column

**Files:**
- Create: `src/migrations/20260614_120000_media_videos_title.ts`
- Modify: `src/migrations/index.ts`

- [ ] **Step 1: Create migration file `src/migrations/20260614_120000_media_videos_title.ts`**

```ts
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media_videos" ADD COLUMN IF NOT EXISTS "title" varchar NOT NULL DEFAULT '';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media_videos" DROP COLUMN IF EXISTS "title";
  `)
}
```

> Note: `DEFAULT ''` is intentional — existing rows get an empty string. Editors will need to fill in titles for videos already uploaded. Payload's `required: true` enforces the field on new saves through the admin UI, not at the DB level for existing rows.

- [ ] **Step 2: Register migration in `src/migrations/index.ts`**

Add import at the end of the imports block:
```ts
import * as migration_20260614_120000_media_videos_title from './20260614_120000_media_videos_title';
```

Add entry at the end of the `migrations` array:
```ts
  {
    up: migration_20260614_120000_media_videos_title.up,
    down: migration_20260614_120000_media_videos_title.down,
    name: '20260614_120000_media_videos_title',
  },
```

- [ ] **Step 3: Run TypeScript check to verify migration compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/migrations/20260614_120000_media_videos_title.ts src/migrations/index.ts
git commit -m "feat(db): add title column to media_videos"
```
