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

export async function getServicesNav(locale: Locale): Promise<{ slug: string; title: string }[]> {
  try {
    const docs = await getPublishedServicePages(locale)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (docs as any[]).map((d) => ({ slug: d.slug as string, title: d.title as string }))
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPublishedPosts(locale: Locale, opts?: { category?: string }) {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: { equals: 'published' } }
  if (opts?.category) where.category = { equals: opts.category }
  const res = await payload.find({ collection: 'posts', locale, where, sort: '-publishedAt', limit: 100, depth: 1 })
  return res.docs
}

export async function getPost(slug: string, locale: Locale) {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts', locale,
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1, depth: 2,
  })
  return res.docs[0] ?? null
}

export async function getPostParams() {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 200, depth: 0, locale: 'pl' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.docs.map((d: any) => d.slug as string)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getRelatedPosts(post: any, locale: Locale) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const explicit = (post?.relatedPosts ?? []).filter((p: any) => typeof p === 'object' && p?.status === 'published')
  if (explicit.length >= 3) return explicit.slice(0, 3)
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'posts', locale,
    where: { status: { equals: 'published' }, category: { equals: post.category }, slug: { not_equals: post.slug } },
    sort: '-publishedAt', limit: 3, depth: 1,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seen = new Set(explicit.map((p: any) => p.slug))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filler = res.docs.filter((d: any) => !seen.has(d.slug))
  return [...explicit, ...filler].slice(0, 3)
}
