// @vitest-environment node
import 'dotenv/config'
import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '../../src/payload.config'

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
})
