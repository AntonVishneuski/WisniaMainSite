import type { Locale } from './i18n'
import { getPayloadClient } from './getPayload'

export async function getHomeData(locale: Locale) {
  const payload = await getPayloadClient()
  const [prices, reviews, beforeAfter, settings] = await Promise.all([
    payload.find({ collection: 'prices', locale, limit: 500, sort: 'order' }),
    payload.find({ collection: 'reviews', locale, limit: 100, sort: 'order' }),
    payload.find({ collection: 'beforeAfter', locale, limit: 100, sort: 'order', depth: 1 }),
    payload.findGlobal({ slug: 'settings', locale }),
  ])
  return { prices: prices.docs, reviews: reviews.docs, beforeAfter: beforeAfter.docs, settings }
}

export async function getPublishedServicePages(locale: Locale) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'servicePages', locale, where: { status: { equals: 'published' } }, sort: 'order', limit: 100, depth: 0 })
  return res.docs
}

export async function getServicePage(slug: string, locale: Locale) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'servicePages', locale, where: { slug: { equals: slug }, status: { equals: 'published' } }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
}

export async function getServicePageParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'servicePages', where: { status: { equals: 'published' } }, limit: 100, depth: 0, locale: 'pl' })
  return res.docs.map((d: any) => d.slug as string)
}
