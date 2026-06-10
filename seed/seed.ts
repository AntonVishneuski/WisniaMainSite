import 'dotenv/config'
import { getPayload } from 'payload'
import path from 'path'
import config from '../src/payload.config'
import { prices } from './data/prices'
import { reviews } from './data/reviews'
import { beforeAfter } from './data/beforeAfter'
import { settings } from './data/settings'

const abs = (p: string) => path.resolve(process.cwd(), p)

async function run() {
  const payload = await getPayload({ config })

  // idempotent wipe
  for (const c of ['prices', 'reviews', 'beforeAfter', 'media'] as const) {
    const all = await payload.find({ collection: c, limit: 1000, depth: 0 })
    for (const d of all.docs) await payload.delete({ collection: c, id: d.id })
  }

  // prices (pl then ru)
  let pOrder = 0
  for (const p of prices) {
    const created = await payload.create({
      collection: 'prices',
      locale: 'pl',
      data: {
        tab: p.tab,
        category: p.category?.pl,
        categorySubtitle: p.categorySubtitle?.pl,
        name: p.name.pl,
        subline: p.subline?.pl,
        price: p.price?.pl,
        priceWas: p.priceWas?.pl,
        isPackage: !!p.isPackage,
        isGift: !!p.isGift,
        order: p.order ?? pOrder++,
      },
    })
    await payload.update({
      collection: 'prices',
      id: created.id,
      locale: 'ru',
      data: {
        category: p.category?.ru,
        categorySubtitle: p.categorySubtitle?.ru,
        name: p.name.ru,
        subline: p.subline?.ru,
        price: p.price?.ru,
        priceWas: p.priceWas?.ru,
      },
    })
  }

  // reviews
  for (const r of reviews) {
    const created = await payload.create({
      collection: 'reviews',
      locale: 'pl',
      data: {
        quote: r.quote.pl,
        author: r.author,
        initial: r.initial,
        avatarColor: r.avatarColor,
        rating: r.rating ?? 5,
        source: r.source,
        date: r.date.pl,
        order: r.order,
      },
    })
    await payload.update({
      collection: 'reviews',
      id: created.id,
      locale: 'ru',
      data: { quote: r.quote.ru, date: r.date.ru },
    })
  }

  // before/after (upload images to media, then create pair)
  for (const ba of beforeAfter) {
    const before = await payload.create({
      collection: 'media',
      locale: 'pl',
      data: { alt: ba.caption.pl },
      filePath: abs(ba.beforeFile),
    })
    const after = await payload.create({
      collection: 'media',
      locale: 'pl',
      data: { alt: ba.caption.pl },
      filePath: abs(ba.afterFile),
    })
    const created = await payload.create({
      collection: 'beforeAfter',
      locale: 'pl',
      data: {
        beforeImage: before.id,
        afterImage: after.id,
        caption: ba.caption.pl,
        order: ba.order,
      },
    })
    await payload.update({
      collection: 'beforeAfter',
      id: created.id,
      locale: 'ru',
      data: { caption: ba.caption.ru },
    })
  }

  // settings global
  await payload.updateGlobal({ slug: 'settings', locale: 'pl', data: settings.pl })
  await payload.updateGlobal({ slug: 'settings', locale: 'ru', data: settings.ru })

  const pc = await payload.count({ collection: 'prices' })
  const rc = await payload.count({ collection: 'reviews' })
  const bc = await payload.count({ collection: 'beforeAfter' })
  console.log(
    `Seed complete — prices:${pc.totalDocs} reviews:${rc.totalDocs} beforeAfter:${bc.totalDocs}`,
  )
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
