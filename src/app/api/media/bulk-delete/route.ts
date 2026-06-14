import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayload'
import { headers } from 'next/headers'

const ALLOWED_COLLECTIONS = ['media', 'media-videos'] as const

export async function POST(req: NextRequest) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let ids: string[], collection: string
  try {
    const body = await req.json()
    ids = body.ids
    collection = body.collection
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!Array.isArray(ids) || typeof collection !== 'string' || !collection) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!ALLOWED_COLLECTIONS.includes(collection as typeof ALLOWED_COLLECTIONS[number])) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  const deleted: string[] = []
  const failed: string[] = []

  for (const id of ids) {
    try {
      await payload.delete({ collection, id, overrideAccess: false, user })
      deleted.push(id)
    } catch (err) {
      console.error(`bulk-delete failed for ${collection}/${id}:`, err)
      failed.push(id)
    }
  }

  return NextResponse.json({ deleted, failed })
}
