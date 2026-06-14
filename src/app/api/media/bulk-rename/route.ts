import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayload'
import { headers } from 'next/headers'
import { copy, del } from '@vercel/blob'

const ALLOWED_COLLECTIONS = ['media', 'media-videos'] as const

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
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return NextResponse.json({ error: 'Blob token not configured' }, { status: 500 })

  let ids: string[], collection: string, find: string, replace: string
  try {
    const body = await req.json()
    ids = body.ids
    collection = body.collection
    find = body.find
    replace = body.replace ?? ''
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (
    !Array.isArray(ids) ||
    ids.length > 200 ||
    ids.some(id => typeof id !== 'string' || !id) ||
    typeof collection !== 'string' ||
    !collection ||
    typeof find !== 'string' ||
    !find
  ) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!ALLOWED_COLLECTIONS.includes(collection as typeof ALLOWED_COLLECTIONS[number])) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
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
    } catch (err) {
      console.error(`bulk-rename failed for ${collection}/${id}:`, err)
      failed.push(id)
    }
  }

  return NextResponse.json({ renamed, failed })
}
