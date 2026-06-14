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
