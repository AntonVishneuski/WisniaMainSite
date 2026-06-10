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
