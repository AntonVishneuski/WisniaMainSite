import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockFindByID = vi.fn()
const mockUpdate = vi.fn().mockResolvedValue({})
const mockAuth = vi.fn()
const mockCopy = vi.fn().mockResolvedValue({ url: 'https://blob.vercel-storage.com/photo-after-2.jpg' })
const mockDel = vi.fn().mockResolvedValue(undefined)

vi.mock('@/lib/getPayload', () => ({
  getPayloadClient: vi.fn().mockResolvedValue({
    findByID: mockFindByID,
    update: mockUpdate,
    auth: mockAuth,
  }),
}))
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
      'ba4-after-2.jpg'.replaceAll('ba4', 'photo'),
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
