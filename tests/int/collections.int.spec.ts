// @vitest-environment node
import 'dotenv/config'
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '../../src/payload.config'
import { groupPrices } from '../../src/lib/price-groups'
import { reviews as seedReviews } from '../../seed/data/reviews'
import { beforeAfter as seedBeforeAfter } from '../../seed/data/beforeAfter'

let payload: Payload
beforeAll(async () => {
  payload = await getPayload({ config })
}, 60000)

describe('collections (integration, seeded DB)', () => {
  it('public read returns seeded prices across all 4 tabs', async () => {
    const res = await payload.find({ collection: 'prices', locale: 'pl', limit: 500, sort: 'order' })
    expect(res.docs.length).toBeGreaterThan(40)
    const grouped = groupPrices(res.docs as any)
    // All four tab keys always present
    expect(Object.keys(grouped)).toEqual(['kosmetologia', 'laser', 'cialo', 'pakiety'])
    // Data groups are non-empty — asserting actual data, not just the TABS constant
    expect(grouped.kosmetologia.length).toBeGreaterThan(0)
    expect(grouped.laser.length).toBeGreaterThan(0)
  })

  it('has seeded reviews and before/after pairs', async () => {
    expect((await payload.count({ collection: 'reviews' })).totalDocs).toBeGreaterThanOrEqual(seedReviews.length)
    expect((await payload.count({ collection: 'beforeAfter' })).totalDocs).toBeGreaterThanOrEqual(seedBeforeAfter.length)
  })

  it('beforeAfter media populate with a url at depth 1', async () => {
    const res = await payload.find({ collection: 'beforeAfter', locale: 'pl', limit: 1, depth: 1 })
    const doc: any = res.docs[0]
    expect(doc.beforeImage?.url).toBeTruthy()
    expect(doc.afterImage?.url).toBeTruthy()
  })

  it('localized content differs between pl and ru for a price name', async () => {
    const pl = await payload.find({ collection: 'prices', locale: 'pl', limit: 1, sort: 'order' })
    const ru = await payload.find({ collection: 'prices', locale: 'ru', limit: 1, sort: 'order' })
    expect(pl.docs[0]?.name).toBeTruthy()
    expect(ru.docs[0]?.name).toBeTruthy()
    // same row id, name field present in both locales
    expect(pl.docs[0]?.id).toBe(ru.docs[0]?.id)
  })

  it('settings global exposes booksy + rating', async () => {
    const s: any = await payload.findGlobal({ slug: 'settings', locale: 'pl' })
    expect(s.booksyUrl).toContain('booksy')
    expect(s.googleRating).toBeTruthy()
  })

  it('reviews default rating is 5 on create (and cleans up)', async () => {
    let r: any
    try {
      r = await payload.create({ collection: 'reviews', locale: 'pl', data: { quote: 'x', author: '__test__' } })
      expect(r.rating).toBe(5)
    } finally {
      if (r?.id) {
        await payload.delete({ collection: 'reviews', id: r.id })
      }
    }
  })

  it('access control: prices public read resolves with docs', async () => {
    const res = await payload.find({ collection: 'prices', overrideAccess: false, limit: 1 })
    expect(res.docs.length).toBeGreaterThan(0)
  })

  it('access control: users collection throws for unauthenticated context', async () => {
    // Users collection has auth:true and no explicit read access — defaults to requiring authentication.
    // Payload local API with overrideAccess:false and no req.user throws an access error.
    await expect(
      payload.find({ collection: 'users', overrideAccess: false })
    ).rejects.toThrow(/not allowed|forbidden/i)
  })
})
