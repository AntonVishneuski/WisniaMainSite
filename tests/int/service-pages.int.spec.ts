// @vitest-environment node
import 'dotenv/config'
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '../../src/payload.config'
import { getServicePage, getServicePageParams, getPublishedServicePages } from '../../src/lib/queries'

let payload: Payload
beforeAll(async () => { payload = await getPayload({ config }) }, 60000)

describe('servicePages (integration, seeded)', () => {
  it('has 7 published pages', async () => {
    const res = await payload.find({ collection: 'servicePages', where: { status: { equals: 'published' } }, limit: 100 })
    expect(res.totalDocs).toBe(7)
  })
  it('a page resolves linked priceItems at depth 2', async () => {
    const res = await payload.find({ collection: 'servicePages', where: { slug: { equals: 'depilacja-laserowa-warszawa' } }, depth: 2, locale: 'pl', limit: 1 })
    const doc: any = res.docs[0]
    expect(doc).toBeTruthy()
    expect(Array.isArray(doc.priceItems)).toBe(true)
    expect(doc.priceItems.length).toBeGreaterThan(0)
    expect(typeof doc.priceItems[0]).toBe('object')   // resolved object, not just an id
    expect(doc.priceItems[0].price).toBeTruthy()
  })
  it('pl and ru titles both present for the same slug/id', async () => {
    const pl = await payload.find({ collection: 'servicePages', where: { slug: { equals: 'depilacja-laserowa-warszawa' } }, locale: 'pl', limit: 1 })
    const ru = await payload.find({ collection: 'servicePages', where: { slug: { equals: 'depilacja-laserowa-warszawa' } }, locale: 'ru', limit: 1 })
    expect(pl.docs[0]?.title).toBeTruthy()
    expect(ru.docs[0]?.title).toBeTruthy()
    expect(pl.docs[0]?.id).toBe(ru.docs[0]?.id)
  })
  it('public read is allowed (read: () => true) without auth', async () => {
    const res = await payload.find({ collection: 'servicePages', limit: 1, overrideAccess: false })
    expect(res).toHaveProperty('docs')
  })

  it('pl and ru content actually differ (no RU→PL fallback regression)', async () => {
    const pl = await payload.find({ collection: 'servicePages', where: { slug: { equals: 'depilacja-laserowa-warszawa' } }, locale: 'pl', limit: 1 })
    const ru = await payload.find({ collection: 'servicePages', where: { slug: { equals: 'depilacja-laserowa-warszawa' } }, locale: 'ru', limit: 1 })
    const plDoc = pl.docs[0] as any
    const ruDoc = ru.docs[0] as any
    expect(plDoc?.title).toBeTruthy()
    expect(ruDoc?.title).toBeTruthy()
    // Title must be different — 'Depilacja laserowa' vs 'Лазерная эпиляция'
    expect(plDoc.title).not.toBe(ruDoc.title)
    // Heading must also differ
    expect(plDoc.heading).not.toBe(ruDoc.heading)
  })

  it('draft pages are excluded from public queries', async () => {
    const draftSlug = '__pf7_draft__'
    let createdId: string | number | null = null
    try {
      // Create a minimal draft doc
      const created = await payload.create({
        collection: 'servicePages',
        data: {
          title: 'PF7 Draft Test',
          slug: draftSlug,
          status: 'draft',
        } as any,
      })
      createdId = created.id

      // getServicePage should return null for draft
      const page = await getServicePage(draftSlug, 'pl')
      expect(page).toBeNull()

      // getServicePageParams should not include the draft slug
      const params = await getServicePageParams()
      expect(params).not.toContain(draftSlug)

      // getPublishedServicePages should not include the draft
      const published = await getPublishedServicePages('pl')
      const slugs = (published as any[]).map((d) => d.slug)
      expect(slugs).not.toContain(draftSlug)
    } finally {
      // Always clean up so the count==7 test stays valid
      if (createdId !== null) {
        await payload.delete({ collection: 'servicePages', id: createdId })
      }
    }
  })
})
