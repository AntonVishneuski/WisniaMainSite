# Admin Media Management: Bulk Delete & Rename

**Date:** 2026-06-14  
**Branch:** `worktree-feature+admin-media-manage`  
**Collections affected:** `media` (images), `media-videos` (videos)

---

## Goal

Add bulk delete and bulk rename (find/replace on filename) actions to the Payload Admin media list views for both `media` and `media-videos` collections.

---

## Architecture

### New files

```
src/
  components/admin/
    BulkDeleteAction.tsx      — "Удалить" button + confirmation modal
    BulkRenameAction.tsx      — "Переименовать" button + find/replace modal with preview
  app/api/media/
    bulk-delete/route.ts      — POST handler: deletes via Payload local API
    bulk-rename/route.ts      — POST handler: copy+del blob + update DB record
```

### Collection changes

Add `admin.components.actions` to both `Media.ts` and `MediaVideos.ts`:

```ts
admin: {
  group: 'Treść',
  components: {
    actions: [
      'src/components/admin/BulkDeleteAction',
      'src/components/admin/BulkRenameAction',
    ],
  },
},
```

### Selected IDs

Components use `useSelection()` from `@payloadcms/ui` which returns `{ selected: Set<string>, selectAll: boolean }`. Buttons are disabled when `selected.size === 0`.

---

## Data Flow

### Bulk Delete

1. User selects files → clicks "Удалить" → confirmation modal shows filenames
2. `POST /api/media/bulk-delete` with `{ ids: string[], collection: 'media' | 'media-videos' }`
3. For each ID: `payload.delete({ collection, id })` — storage plugin handles blob deletion automatically
4. Returns `{ deleted: string[], failed: string[] }` → toast + list refresh

### Bulk Rename

1. User selects files → clicks "Переименовать" → modal with find/replace inputs
2. Live preview table shows `currentName → newName` for each selected file
3. `POST /api/media/bulk-rename` with `{ ids: string[], find: string, replace: string, collection: string }`
4. For each file on the server:
   - Fetch current doc: `filename`, `url`, `sizes` (images only)
   - Compute `newFilename = filename.replaceAll(find, replace)`
   - Skip if `find` not found in filename (no error)
   - **Images (`media`):** `copy + del` for main blob + `thumb` + `card` + `hero` (4 blobs), update `sizes` URLs
   - **Videos (`media-videos`):** `copy + del` for 1 blob
   - `payload.update({ collection, id, data: { filename: newFilename, url: newUrl, sizes: newSizes } })`
5. Returns `{ renamed: string[], failed: string[] }` → toast + list refresh

### Authentication

API routes verify the user session via `getPayload` + `payload.auth()`. Only authenticated admin users can call these endpoints.

---

## UI

Two buttons appear in the list header when at least one file is selected:

```
[ ✓ 3 выбрано ]  [ Удалить ]  [ Переименовать ]
```

**Delete modal:**
- Title: «Удалить X файлов?»
- List of selected filenames
- Warning: «Действие нельзя отменить»
- Buttons: Отмена / Удалить (destructive)
- After: toast «Удалено N, ошибок M»

**Rename modal:**
- Two inputs: «Найти» / «Заменить на»
- Live preview table: Current name → New name
- Duplicate detection: highlight conflicts yellow, block "Переименовать" button (checks within the selected batch only — if two selected files would get the same name after rename)
- After: toast «Переименовано N, ошибок M»

UI components: use `@payloadcms/ui` primitives (`Button`, `useModal`, `toast`) to stay consistent with Payload admin styling.

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Partial failure (some blobs fail) | Don't rollback successes; report `{ renamed, failed }` |
| `find` not in filename | Skip silently (not an error) |
| Two selected files resolve to same new name | Detected client-side in preview, confirm blocked |
| Network error | Generic toast «Что-то пошло не так, попробуйте снова» |
| Unauthenticated request | API returns 401 |

---

## Constraints

- `@vercel/blob` has no `rename()` — every rename is `copy(oldUrl, newPath) + del(oldUrl)`
- Image thumbnails are separate blobs; all 4 variants must be renamed to keep URLs consistent
- `clientUploads: true` is set in `vercelBlobStorage` — rename happens server-side only (no client-side blob ops)
