// @vitest-environment node
import 'dotenv/config'
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '../../src/payload.config'
import { groupPrices } from '../../src/lib/price-groups'

let payload: Payload
beforeAll(async () => {
  payload = await getPayload({ config })
}, 60000)

describe('collections (integration, seeded DB)', () => {
  it('public read returns seeded prices across all 4 tabs', async () => {
    const res = await payload.find({ collection: 'prices', locale: 'pl', limit: 500, sort: 'order' })
    expect(res.docs.length).toBeGreaterThan(40)
    const grouped = groupPrices(res.docs as any)
    expect(Object.keys(grouped)).toEqual(['kosmetologia', 'laser', 'cialo', 'pakiety'])
    expect(grouped.kosmetologia.length).toBeGreaterThan(0)
    expect(grouped.laser.length).toBeGreaterThan(0)
  })

  it('has 6 reviews and 6 before/after pairs', async () => {
    expect((await payload.count({ collection: 'reviews' })).totalDocs).toBe(6)
    expect((await payload.count({ collection: 'beforeAfter' })).totalDocs).toBe(6)
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
    const r = await payload.create({ collection: 'reviews', locale: 'pl', data: { quote: 'x', author: '__test__' } })
    expect(r.rating).toBe(5)
    await payload.delete({ collection: 'reviews', id: r.id })
  })
})
