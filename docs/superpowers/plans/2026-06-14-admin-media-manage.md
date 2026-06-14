# Admin Media Bulk Delete & Rename — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add bulk-delete and bulk-rename (find/replace on filename) actions to the Payload Admin list views for the `media` and `media-videos` collections.

**Architecture:** Two Next.js API routes handle server-side logic (auth check → Payload local API + Vercel Blob operations). Two React client components (`BulkDeleteAction`, `BulkRenameAction`) are registered via `admin.components.actions` in both collection configs; they read the selection state via `useSelection()` from `@payloadcms/ui` and display modals.

**Tech Stack:** Next.js App Router, PayloadCMS 3.x, `@payloadcms/ui` (`useSelection`), `@vercel/blob` (`copy`, `del`), Vitest + Testing Library (unit tests).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/app/api/media/bulk-delete/route.ts` | Create | POST handler: auth check → `payload.delete` per id |
| `src/app/api/media/bulk-rename/route.ts` | Create | POST handler: auth check → blob copy+del → `payload.update` |
| `src/components/admin/BulkDeleteAction.tsx` | Create | Delete button + confirmation modal, uses `useSelection` |
| `src/components/admin/BulkRenameAction.tsx` | Create | Rename button + find/replace modal with live preview, uses `useSelection` |
| `src/collections/Media.ts` | Modify | Add `admin.components.actions` pointing to both components |
| `src/collections/MediaVideos.ts` | Modify | Same as above |
| `tests/unit/bulk-delete-route.test.ts` | Create | Unit tests for bulk-delete route |
| `tests/unit/bulk-rename-route.test.ts` | Create | Unit tests for bulk-rename route |
| `tests/unit/BulkDeleteAction.test.tsx` | Create | Unit tests for delete component |
| `tests/unit/BulkRenameAction.test.tsx` | Create | Unit tests for rename component |

---

## Task 1: Add `@vercel/blob` as direct dependency

`@vercel/blob` is currently a transitive dep only. The bulk-rename route imports `copy` and `del` from it directly.

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
pnpm add @vercel/blob@^2.3.1
```

Expected output: `@vercel/blob 2.3.1` appears in `dependencies` in `package.json`.

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): add @vercel/blob as direct dependency"
```

---

## Task 2: Bulk Delete API Route (TDD)

**Files:**
- Create: `tests/unit/bulk-delete-route.test.ts`
- Create: `src/app/api/media/bulk-delete/route.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/bulk-delete-route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockDelete = vi.fn().mockResolvedValue({ id: 'x' })
const mockAuth = vi.fn()

vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    delete: mockDelete,
    auth: mockAuth,
  }),
}))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

// Dynamic import AFTER mocks are set up
const { POST } = await import('../../src/app/api/media/bulk-delete/route')

describe('POST /api/media/bulk-delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ user: { id: 'user1' } })
  })

  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue({ user: null })
    const req = new NextRequest('http://localhost/api/media/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids: ['1'], collection: 'media' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('calls payload.delete for each id and returns results', async () => {
    const req = new NextRequest('http://localhost/api/media/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids: ['1', '2'], collection: 'media' }),
    })
    const res = await POST(req)
    const body = await res.json()
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(body.deleted).toEqual(['1', '2'])
    expect(body.failed).toEqual([])
  })

  it('reports failed ids when delete throws', async () => {
    mockDelete.mockRejectedValueOnce(new Error('not found'))
    const req = new NextRequest('http://localhost/api/media/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids: ['bad', 'good'], collection: 'media' }),
    })
    const res = await POST(req)
    const body = await res.json()
    expect(body.deleted).toEqual(['good'])
    expect(body.failed).toEqual(['bad'])
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL (module not found)**

```bash
pnpm test -- bulk-delete-route
```

Expected: `Error: Cannot find module '../../src/app/api/media/bulk-delete/route'`

- [ ] **Step 3: Create the directory and implement the route**

```bash
mkdir -p src/app/api/media/bulk-delete
```

Create `src/app/api/media/bulk-delete/route.ts`:

```ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids, collection } = (await req.json()) as { ids: string[]; collection: string }

  const deleted: string[] = []
  const failed: string[] = []

  for (const id of ids) {
    try {
      await payload.delete({ collection, id, overrideAccess: false, user })
      deleted.push(id)
    } catch {
      failed.push(id)
    }
  }

  return NextResponse.json({ deleted, failed })
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test -- bulk-delete-route
```

Expected: `3 passed`

- [ ] **Step 5: Commit**

```bash
git add src/app/api/media/bulk-delete/route.ts tests/unit/bulk-delete-route.test.ts
git commit -m "feat(api): bulk-delete route for media collections"
```

---

## Task 3: Bulk Rename API Route (TDD)

**Files:**
- Create: `tests/unit/bulk-rename-route.test.ts`
- Create: `src/app/api/media/bulk-rename/route.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/bulk-rename-route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockFindByID = vi.fn()
const mockUpdate = vi.fn().mockResolvedValue({})
const mockAuth = vi.fn()
const mockCopy = vi.fn().mockResolvedValue({ url: 'https://blob.vercel-storage.com/photo-after-2.jpg' })
const mockDel = vi.fn().mockResolvedValue(undefined)

vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    findByID: mockFindByID,
    update: mockUpdate,
    auth: mockAuth,
  }),
}))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))
vi.mock('@vercel/blob', () => ({ copy: mockCopy, del: mockDel }))

const { POST } = await import('../../src/app/api/media/bulk-rename/route')

const BLOB_TOKEN = 'vercel_blob_rw_test'
const DOC = {
  id: '1',
  filename: 'ba4-after-2.jpg',
  url: 'https://abc.public.blob.vercel-storage.com/ba4-after-2.jpg',
}

function makeReq(body: object) {
  return new NextRequest('http://localhost/api/media/bulk-rename', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

describe('POST /api/media/bulk-rename', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', BLOB_TOKEN)
    mockAuth.mockResolvedValue({ user: { id: 'user1' } })
    mockFindByID.mockResolvedValue(DOC)
  })

  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue({ user: null })
    const res = await POST(makeReq({ ids: ['1'], collection: 'media', find: 'ba4', replace: 'photo' }))
    expect(res.status).toBe(401)
  })

  it('copies blob to new pathname and deletes old', async () => {
    await POST(makeReq({ ids: ['1'], collection: 'media', find: 'ba4', replace: 'photo' }))
    expect(mockCopy).toHaveBeenCalledWith(
      'https://abc.public.blob.vercel-storage.com/ba4-after-2.jpg',
      'photo-after-2.jpg',
      { access: 'public', token: BLOB_TOKEN },
    )
    expect(mockDel).toHaveBeenCalledWith(
      'https://abc.public.blob.vercel-storage.com/ba4-after-2.jpg',
      { token: BLOB_TOKEN },
    )
  })

  it('updates payload doc with new filename and url', async () => {
    await POST(makeReq({ ids: ['1'], collection: 'media', find: 'ba4', replace: 'photo' }))
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'media',
        id: '1',
        data: expect.objectContaining({
          filename: 'photo-after-2.jpg',
          url: 'https://blob.vercel-storage.com/photo-after-2.jpg',
        }),
      }),
    )
  })

  it('skips file when find string not in filename — no blob ops, still reports renamed', async () => {
    mockFindByID.mockResolvedValue({ id: '1', filename: 'hero.jpg', url: 'https://abc.public.blob.vercel-storage.com/hero.jpg' })
    const res = await POST(makeReq({ ids: ['1'], collection: 'media', find: 'ba4', replace: 'photo' }))
    const body = await res.json()
    expect(mockCopy).not.toHaveBeenCalled()
    expect(body.renamed).toEqual(['1'])
  })

  it('renames size variants for image collection', async () => {
    mockFindByID.mockResolvedValue({
      ...DOC,
      sizes: {
        thumb: { url: 'https://abc.public.blob.vercel-storage.com/ba4-after-2-400x300.jpg', filename: 'ba4-after-2-400x300.jpg' },
      },
    })
    mockCopy
      .mockResolvedValueOnce({ url: 'https://blob/photo-after-2.jpg' })
      .mockResolvedValueOnce({ url: 'https://blob/photo-after-2-400x300.jpg' })

    await POST(makeReq({ ids: ['1'], collection: 'media', find: 'ba4', replace: 'photo' }))
    expect(mockCopy).toHaveBeenCalledTimes(2)
  })

  it('reports failed ids when blob copy throws', async () => {
    mockCopy.mockRejectedValueOnce(new Error('network error'))
    const res = await POST(makeReq({ ids: ['1'], collection: 'media', find: 'ba4', replace: 'photo' }))
    const body = await res.json()
    expect(body.failed).toEqual(['1'])
    expect(body.renamed).toEqual([])
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL (module not found)**

```bash
pnpm test -- bulk-rename-route
```

Expected: `Error: Cannot find module '../../src/app/api/media/bulk-rename/route'`

- [ ] **Step 3: Create the directory and implement the route**

```bash
mkdir -p src/app/api/media/bulk-rename
```

Create `src/app/api/media/bulk-rename/route.ts`:

```ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { copy, del } from '@vercel/blob'

type MediaDoc = {
  id: string
  filename: string
  url: string
  sizes?: Record<string, { url: string; filename: string } | null | undefined>
}

async function renameBlobAndSizes(
  doc: MediaDoc,
  find: string,
  replace: string,
  token: string,
): Promise<{ url: string; filename: string; sizes?: Record<string, unknown> }> {
  const oldPathname = new URL(doc.url).pathname.slice(1)
  const newPathname = oldPathname.replaceAll(find, replace)
  const { url: newUrl } = await copy(doc.url, newPathname, { access: 'public', token })
  await del(doc.url, { token })

  if (!doc.sizes) {
    return { url: newUrl, filename: doc.filename.replaceAll(find, replace) }
  }

  const newSizes: Record<string, unknown> = {}
  for (const [sizeName, sizeData] of Object.entries(doc.sizes)) {
    if (!sizeData?.url || !sizeData?.filename) {
      newSizes[sizeName] = sizeData
      continue
    }
    const oldSizePathname = new URL(sizeData.url).pathname.slice(1)
    const newSizePathname = oldSizePathname.replaceAll(find, replace)
    const { url: newSizeUrl } = await copy(sizeData.url, newSizePathname, { access: 'public', token })
    await del(sizeData.url, { token })
    newSizes[sizeName] = {
      ...sizeData,
      url: newSizeUrl,
      filename: sizeData.filename.replaceAll(find, replace),
    }
  }

  return { url: newUrl, filename: doc.filename.replaceAll(find, replace), sizes: newSizes }
}

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return NextResponse.json({ error: 'Blob token not configured' }, { status: 500 })

  const { ids, collection, find, replace } = (await req.json()) as {
    ids: string[]
    collection: string
    find: string
    replace: string
  }

  const renamed: string[] = []
  const failed: string[] = []

  for (const id of ids) {
    try {
      const doc = (await payload.findByID({ collection, id, depth: 0 })) as MediaDoc

      if (!doc.filename.includes(find)) {
        renamed.push(id)
        continue
      }

      const { url: newUrl, filename: newFilename, sizes: newSizes } = await renameBlobAndSizes(
        doc,
        find,
        replace,
        token,
      )

      await payload.update({
        collection,
        id,
        data: {
          filename: newFilename,
          url: newUrl,
          ...(newSizes ? { sizes: newSizes } : {}),
        },
        overrideAccess: true,
      })

      renamed.push(id)
    } catch {
      failed.push(id)
    }
  }

  return NextResponse.json({ renamed, failed })
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test -- bulk-rename-route
```

Expected: `6 passed`

- [ ] **Step 5: Commit**

```bash
git add src/app/api/media/bulk-rename/route.ts tests/unit/bulk-rename-route.test.ts
git commit -m "feat(api): bulk-rename route — blob copy+del + payload.update"
```

---

## Task 4: BulkDeleteAction Component (TDD)

**Files:**
- Create: `tests/unit/BulkDeleteAction.test.tsx`
- Create: `src/components/admin/BulkDeleteAction.tsx`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/BulkDeleteAction.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import BulkDeleteAction from '../../src/components/admin/BulkDeleteAction'

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/collections/media',
}))

const mockUseSelection = vi.fn()
vi.mock('@payloadcms/ui', () => ({
  useSelection: () => mockUseSelection(),
}))

afterEach(() => cleanup())

describe('BulkDeleteAction', () => {
  it('renders nothing when count is 0', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: [], count: 0 })
    const { container } = render(<BulkDeleteAction />)
    expect(container.firstChild).toBeNull()
  })

  it('shows delete button when files are selected', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1', '2'], count: 2 })
    const { getByText } = render(<BulkDeleteAction />)
    expect(getByText('Удалить (2)')).toBeTruthy()
  })

  it('opens confirmation dialog on button click', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1 })
    const { getByText } = render(<BulkDeleteAction />)
    fireEvent.click(getByText('Удалить (1)'))
    expect(getByText(/Удалить 1 файл/)).toBeTruthy()
    expect(getByText(/нельзя отменить/)).toBeTruthy()
  })

  it('closes dialog on cancel click', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1 })
    const { getByText, queryByText } = render(<BulkDeleteAction />)
    fireEvent.click(getByText('Удалить (1)'))
    fireEvent.click(getByText('Отмена'))
    expect(queryByText(/Удалить 1 файл/)).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test -- BulkDeleteAction
```

Expected: `Error: Cannot find module '../../src/components/admin/BulkDeleteAction'`

- [ ] **Step 3: Create component**

Create `src/components/admin/BulkDeleteAction.tsx`:

```tsx
'use client'
import { useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSelection } from '@payloadcms/ui'

export default function BulkDeleteAction() {
  const { selectedIDs, count } = useSelection()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const collection = pathname.split('/admin/collections/')[1]?.split('/')[0]

  const handleDelete = useCallback(async () => {
    if (!collection) return
    setLoading(true)
    try {
      await fetch('/api/media/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIDs, collection }),
        credentials: 'include',
      })
    } finally {
      setLoading(false)
      setOpen(false)
      window.location.reload()
    }
  }, [selectedIDs, collection])

  if (count === 0) return null

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Удалить ({count})
      </button>
      {open && (
        <dialog open>
          <p>Удалить {count} файл(ов)? Действие нельзя отменить.</p>
          <div>
            <button type="button" onClick={() => setOpen(false)} disabled={loading}>
              Отмена
            </button>
            <button type="button" onClick={handleDelete} disabled={loading}>
              {loading ? 'Удаляю...' : 'Удалить'}
            </button>
          </div>
        </dialog>
      )}
    </>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test -- BulkDeleteAction
```

Expected: `4 passed`

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/BulkDeleteAction.tsx tests/unit/BulkDeleteAction.test.tsx
git commit -m "feat(admin): BulkDeleteAction component with confirmation modal"
```

---

## Task 5: BulkRenameAction Component (TDD)

**Files:**
- Create: `tests/unit/BulkRenameAction.test.tsx`
- Create: `src/components/admin/BulkRenameAction.tsx`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/BulkRenameAction.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import BulkRenameAction from '../../src/components/admin/BulkRenameAction'

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/collections/media',
}))

const mockUseSelection = vi.fn()
vi.mock('@payloadcms/ui', () => ({
  useSelection: () => mockUseSelection(),
}))

// fetch is not called in these tests (modal only opens, no network)
afterEach(() => cleanup())

describe('BulkRenameAction', () => {
  it('renders nothing when count is 0', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: [], count: 0 })
    const { container } = render(<BulkRenameAction />)
    expect(container.firstChild).toBeNull()
  })

  it('shows rename button when files are selected', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1 })
    const { getByText } = render(<BulkRenameAction />)
    expect(getByText('Переименовать (1)')).toBeTruthy()
  })

  it('opens modal on button click', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1 })
    const { getByText } = render(<BulkRenameAction />)
    fireEvent.click(getByText('Переименовать (1)'))
    expect(getByText(/Переименовать 1 файл/)).toBeTruthy()
  })

  it('confirm button is disabled when find is empty', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1 })
    const { getByText } = render(<BulkRenameAction />)
    fireEvent.click(getByText('Переименовать (1)'))
    const btn = getByText('Переименовать') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('confirm button is enabled after typing find value', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1 })
    const { getByText, getByPlaceholderText } = render(<BulkRenameAction />)
    fireEvent.click(getByText('Переименовать (1)'))
    fireEvent.change(getByPlaceholderText('Найти'), { target: { value: 'ba4' } })
    const btn = getByText('Переименовать') as HTMLButtonElement
    expect(btn.disabled).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test -- BulkRenameAction
```

Expected: `Error: Cannot find module '../../src/components/admin/BulkRenameAction'`

- [ ] **Step 3: Create component**

Create `src/components/admin/BulkRenameAction.tsx`:

```tsx
'use client'
import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSelection } from '@payloadcms/ui'

type DocPreview = { id: string; filename: string }

export default function BulkRenameAction() {
  const { selectedIDs, count } = useSelection()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [docs, setDocs] = useState<DocPreview[]>([])
  const [loading, setLoading] = useState(false)

  const collection = pathname.split('/admin/collections/')[1]?.split('/')[0]

  useEffect(() => {
    if (!open || !collection || selectedIDs.length === 0) return
    setDocs([])
    const idsParam = selectedIDs.join(',')
    fetch(`/api/${collection}?where[id][in]=${idsParam}&limit=100&depth=0`, {
      credentials: 'include',
    })
      .then(r => r.json())
      .then(data =>
        setDocs(
          (data.docs as { id: string; filename: string }[])?.map(d => ({
            id: d.id,
            filename: d.filename,
          })) ?? [],
        ),
      )
  }, [open, collection, selectedIDs])

  const preview = docs.map(d => ({
    id: d.id,
    from: d.filename,
    to: find ? d.filename.replaceAll(find, replace) : d.filename,
  }))

  const hasDuplicates =
    preview.length > 1 && new Set(preview.map(p => p.to)).size < preview.length

  const handleRename = useCallback(async () => {
    if (!collection || !find) return
    setLoading(true)
    try {
      await fetch('/api/media/bulk-rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIDs, collection, find, replace }),
        credentials: 'include',
      })
    } finally {
      setLoading(false)
      setOpen(false)
      window.location.reload()
    }
  }, [selectedIDs, collection, find, replace])

  if (count === 0) return null

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Переименовать ({count})
      </button>
      {open && (
        <dialog open>
          <h3>Переименовать {count} файл(ов)</h3>
          <div>
            <label>
              Найти
              <input
                placeholder="Найти"
                value={find}
                onChange={e => setFind(e.target.value)}
              />
            </label>
            <label>
              Заменить
              <input
                placeholder="Заменить"
                value={replace}
                onChange={e => setReplace(e.target.value)}
              />
            </label>
          </div>
          {preview.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Текущее</th>
                  <th>Новое</th>
                </tr>
              </thead>
              <tbody>
                {preview.map(p => (
                  <tr key={p.id}>
                    <td>{p.from}</td>
                    <td>{p.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {hasDuplicates && <p>Конфликт имён — исправьте перед переименованием</p>}
          <div>
            <button type="button" onClick={() => setOpen(false)} disabled={loading}>
              Отмена
            </button>
            <button
              type="button"
              onClick={handleRename}
              disabled={loading || !find || hasDuplicates}
            >
              Переименовать
            </button>
          </div>
        </dialog>
      )}
    </>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test -- BulkRenameAction
```

Expected: `5 passed`

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/BulkRenameAction.tsx tests/unit/BulkRenameAction.test.tsx
git commit -m "feat(admin): BulkRenameAction component with find/replace modal and live preview"
```

---

## Task 6: Wire Components into Collections + Regenerate Import Map

**Files:**
- Modify: `src/collections/Media.ts`
- Modify: `src/collections/MediaVideos.ts`

- [ ] **Step 1: Update `src/collections/Media.ts`**

Replace the `admin` block:

```ts
  admin: {
    group: 'Treść',
    components: {
      actions: [
        '/src/components/admin/BulkDeleteAction',
        '/src/components/admin/BulkRenameAction',
      ],
    },
  },
```

Full file after change:

```ts
import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Treść',
    components: {
      actions: [
        '/src/components/admin/BulkDeleteAction',
        '/src/components/admin/BulkRenameAction',
      ],
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
  upload: {
    imageSizes: [
      { name: 'thumb', width: 400 },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1600 },
    ],
    mimeTypes: ['image/*'],
  },
}
```

- [ ] **Step 2: Update `src/collections/MediaVideos.ts`**

Replace only the `admin` block (leave `labels` at top level unchanged):

```ts
  admin: {
    group: 'Treść',
    components: {
      actions: [
        '/src/components/admin/BulkDeleteAction',
        '/src/components/admin/BulkRenameAction',
      ],
    },
  },
```

Full file after change (`labels` stays top-level, only `admin` is modified):

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
    components: {
      actions: [
        '/src/components/admin/BulkDeleteAction',
        '/src/components/admin/BulkRenameAction',
      ],
    },
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

- [ ] **Step 3: Regenerate the Payload import map**

```bash
pnpm generate:importmap
```

Expected: `src/app/(payload)/admin/[[...segments]]/importMap.js` is updated with imports for `BulkDeleteAction` and `BulkRenameAction`.

- [ ] **Step 4: Run all unit tests to confirm no regressions**

```bash
pnpm test
```

Expected: all previously passing tests still pass.

- [ ] **Step 5: Commit**

```bash
git add src/collections/Media.ts src/collections/MediaVideos.ts src/app/\(payload\)/admin/\[\[...segments\]\]/importMap.js
git commit -m "feat(admin): wire bulk actions into media + media-videos collections"
```

---

## Notes

- **`payload.update()` for upload fields:** `url`, `filename`, and `sizes` are stored as regular DB columns for cloud-storage collections. If `payload.update()` rejects these fields, replace with `payload.db.updateOne({ collection, id, data: { filename, url, sizes } })` in the rename route.
- **`@vercel/blob` `copy()` defaults `addRandomSuffix: false`** — the destination pathname is used as-is, no random suffix added.
- **Blob pathname extraction:** `new URL(doc.url).pathname.slice(1)` strips the leading `/` to get the blob store pathname (e.g., `ba4-after-2.jpg`).
- **Size variant URLs for images:** `doc.sizes` is populated by the storage plugin for `media` collection; `media-videos` has no sizes.
