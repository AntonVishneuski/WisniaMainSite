# Video: rename label + title field + delete

Date: 2026-06-14

## Scope

Two independent changes to the `media-videos` Payload collection:

1. **Label rename** — replace Polish "Wideo" / "wideo" with "Video" everywhere in the codebase.
2. **Title field** — add a required `title` text field so editors can give videos a human-readable name instead of seeing the raw filename (e.g. `men_epilacja.mov`) in the admin list.

Delete is **already working** via `@payloadcms/storage-vercel-blob`. No code changes needed — the plugin's `handleDelete` calls `del()` from `@vercel/blob` automatically when a record is deleted in admin. No additional UI or hooks required.

## Changes

### 1. Label rename (3 files, no migration)

| File | Change |
|------|--------|
| `src/collections/MediaVideos.ts` | `labels: { singular: 'Video', plural: 'Video' }` |
| `src/globals/Settings.ts` | description: "wideo" → "video" |
| `src/collections/ServicePages.ts` | descriptions: "wideo" → "video" (2 occurrences) |

### 2. Title field in MediaVideos

Add to `src/collections/MediaVideos.ts`:

```ts
admin: {
  useAsTitle: 'title',   // shows title in admin list instead of filename
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
```

`title` is non-localized (one name per video, language-independent).

### 3. Migration

New DB column: `media_videos.title text NOT NULL`.

Because existing rows will have no value, the migration sets a default of `''` (empty string) for existing records — editors will need to fill in titles for videos already uploaded.

The migration file follows the existing pattern in `src/migrations/`.

## What is NOT in scope

- Physical file rename in Vercel Blob (changing filename on storage)
- Custom delete confirmation UI (Payload admin already has one)
- Bulk operations
