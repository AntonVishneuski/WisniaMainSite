// @vitest-environment node
import 'dotenv/config'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayloadClient } from '@/lib/getPayload'
import { getPublishedPosts, getPost, getPostParams } from '@/lib/queries'

let authorId: number

describe('blog queries', () => {
  beforeAll(async () => {
    const payload = await getPayloadClient()

    // Clean up any leftover data from a previous run (idempotency)
    const existingPosts = await payload.find({
      collection: 'posts',
      where: { slug: { in: ['pub-test', 'draft-test'] } },
      limit: 10, depth: 0,
    })
    for (const post of existingPosts.docs) {
      await payload.delete({ collection: 'posts', id: post.id })
    }
    const existingAuthors = await payload.find({
      collection: 'authors',
      where: { name: { equals: 'Test Autor' } },
      limit: 10, depth: 0, locale: 'pl',
    })
    for (const author of existingAuthors.docs) {
      await payload.delete({ collection: 'authors', id: author.id })
    }

    const a = await payload.create({ collection: 'authors', locale: 'pl', data: { name: 'Test Autor' } })
    authorId = a.id as number
    const minBody = { root: { type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const,
      children: [{ type: 'paragraph', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const,
        children: [{ type: 'text', text: 'x', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] }] } }
    await payload.create({
      collection: 'posts', locale: 'pl',
      data: { title: 'Pub', slug: 'pub-test', status: 'published', category: 'poradniki-faq',
        author: authorId, body: minBody },
    })
    await payload.create({
      collection: 'posts', locale: 'pl',
      data: { title: 'Draft', slug: 'draft-test', status: 'draft', category: 'poradniki-faq',
        author: authorId, body: minBody },
    })
  }, 60000)

  afterAll(async () => {
    const payload = await getPayloadClient()
    const posts = await payload.find({
      collection: 'posts',
      where: { slug: { in: ['pub-test', 'draft-test'] } },
      limit: 10, depth: 0,
    })
    for (const post of posts.docs) {
      await payload.delete({ collection: 'posts', id: post.id })
    }
    if (authorId) {
      await payload.delete({ collection: 'authors', id: authorId })
    }
  }, 30000)

  it('getPublishedPosts excludes drafts', async () => {
    const docs = await getPublishedPosts('pl')
    const slugs = docs.map((d: any) => d.slug)
    expect(slugs).toContain('pub-test')
    expect(slugs).not.toContain('draft-test')
  })

  it('getPost returns published, null for draft', async () => {
    expect(await getPost('pub-test', 'pl')).toBeTruthy()
    expect(await getPost('draft-test', 'pl')).toBeNull()
  })

  it('getPostParams returns only published slugs', async () => {
    const params = await getPostParams()
    expect(params).toContain('pub-test')
    expect(params).not.toContain('draft-test')
  })
})
