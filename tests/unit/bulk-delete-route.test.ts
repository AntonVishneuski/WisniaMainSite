import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockDelete = vi.fn().mockResolvedValue({ id: 'x' })
const mockAuth = vi.fn()

vi.mock('@/lib/getPayload', () => ({
  getPayloadClient: vi.fn().mockResolvedValue({
    delete: mockDelete,
    auth: mockAuth,
  }),
}))
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

  it('returns 400 for invalid collection', async () => {
    const req = new NextRequest('http://localhost/api/media/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids: ['1'], collection: 'users' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 when body is malformed', async () => {
    const req = new NextRequest('http://localhost/api/media/bulk-delete', {
      method: 'POST',
      body: 'not-json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
