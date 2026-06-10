import 'dotenv/config'
import { getPayload } from 'payload'
import path from 'path'
import config from '../src/payload.config'
import { prices } from './data/prices'
import { reviews } from './data/reviews'
import { beforeAfter } from './data/beforeAfter'
import { settings } from './data/settings'
import { servicePages } from './data/service-pages'

const abs = (p: string) => path.resolve(process.cwd(), p)

/** Convert plain text (paragraphs separated by \n\n) to minimal Payload Lexical richText value */
function textToLexical(str?: string | null) {
  const paras = (str ?? '').split('\n\n').filter(Boolean)
  const fmt = '' as ''
  return {
    root: {
      type: 'root',
      format: fmt,
      indent: 0,
      version: 1,
      direction: 'ltr' as 'ltr',
      children: paras.length
        ? paras.map((p) => ({
            type: 'paragraph',
            format: fmt,
            indent: 0,
            version: 1,
            direction: 'ltr' as 'ltr',
            children: [
              {
                type: 'text',
                text: p,
                format: 0,
                detail: 0,
                mode: 'normal' as const,
                style: '',
                version: 1,
              },
            ],
          }))
        : [
            {
              type: 'paragraph',
              format: fmt,
              indent: 0,
              version: 1,
              direction: 'ltr' as 'ltr',
              children: [] as never[],
            },
          ],
    },
  }
}

async function run() {
  const payload = await getPayload({ config })

  // idempotent wipe (servicePages added)
  for (const c of ['servicePages', 'prices', 'reviews', 'beforeAfter', 'media'] as const) {
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

  // ─── Service pages ────────────────────────────────────────────────────────

  // Build price name → id map (supports "name [category]" disambiguation)
  const priceDocsResult = await payload.find({ collection: 'prices', locale: 'pl', limit: 1000 })
  // Primary map: exact name → id (last wins for duplicates; see below for disambiguation)
  const priceByName = new Map<string, number>()
  // Disambiguation map: "name [mężczyźni]" → id for men's laser prices (category contains "mężczyzn")
  const priceByNameMen = new Map<string, number>()
  for (const doc of priceDocsResult.docs) {
    const name = (doc as { name?: string }).name ?? ''
    const id = doc.id as number
    const cat: string = (doc as { category?: string }).category ?? ''
    priceByName.set(name, id)
    if (cat.toLowerCase().includes('mężczyzn')) {
      priceByNameMen.set(name, id)
    }
  }

  /**
   * Resolve a priceNames entry to a DB id.
   * Supports the disambiguation suffix "[mężczyźni]" for men's-specific prices.
   */
  function resolvePriceId(entry: string): number | null {
    if (entry.endsWith(' [mężczyźni]')) {
      const baseName = entry.slice(0, -' [mężczyźni]'.length)
      return priceByNameMen.get(baseName) ?? priceByName.get(baseName) ?? null
    }
    return priceByName.get(entry) ?? null
  }

  // FIRST PASS — create all 7 pages without crossLinks
  const slugToId = new Map<string, number>()

  for (const sp of servicePages) {
    // Upload hero image if present
    let heroId: number | null = null
    if (sp.heroFile) {
      const heroMedia = await payload.create({
        collection: 'media',
        locale: 'pl',
        data: { alt: sp.heading.pl },
        filePath: abs(sp.heroFile),
      })
      heroId = heroMedia.id as number
    }

    // Upload before/after images
    const baMediaRefs: Array<{ beforeImage: number; afterImage: number; caption: string }> = []
    for (const ba of sp.beforeAfter) {
      const beforeMedia = await payload.create({
        collection: 'media',
        locale: 'pl',
        data: { alt: ba.caption.pl },
        filePath: abs(ba.beforeFile),
      })
      const afterMedia = await payload.create({
        collection: 'media',
        locale: 'pl',
        data: { alt: ba.caption.pl },
        filePath: abs(ba.afterFile),
      })
      baMediaRefs.push({
        beforeImage: beforeMedia.id as number,
        afterImage: afterMedia.id as number,
        caption: ba.caption.pl,
      })
    }

    // Resolve price ids
    const priceIds = sp.priceNames
      .map((n) => resolvePriceId(n))
      .filter((id): id is number => id !== null)

    // Create PL
    const created = await payload.create({
      collection: 'servicePages',
      locale: 'pl',
      data: {
        slug: sp.slug,
        order: sp.order,
        status: 'published',
        title: sp.title.pl,
        heading: sp.heading.pl,
        intro: sp.intro.pl,
        about: textToLexical(sp.about.pl),
        forWhom: sp.forWhom ? textToLexical(sp.forWhom.pl) : undefined,
        results: sp.results ? textToLexical(sp.results.pl) : undefined,
        steps: sp.steps.map((s) => ({ title: s.title.pl, text: s.text.pl })),
        priceItems: priceIds,
        packagePromo: {
          enabled: sp.packagePromo.enabled,
          badge: sp.packagePromo.badge,
          title: sp.packagePromo.title.pl,
          desc: sp.packagePromo.desc.pl,
          nowPrice: sp.packagePromo.nowPrice.pl,
          wasPrice: sp.packagePromo.wasPrice.pl,
          link: sp.packagePromo.link,
        },
        reviews: sp.reviews.map((r) => ({
          quote: r.quote.pl,
          author: r.author,
          initial: r.initial,
          avatarColor: r.avatarColor,
          rating: r.rating,
          source: r.source,
          date: r.date.pl,
        })),
        beforeAfter: baMediaRefs,
        ...(heroId ? { heroImage: heroId } : {}),
        metaTitle: sp.metaTitle.pl,
        metaDescription: sp.metaDescription.pl,
        serviceName: sp.title.pl,
        serviceDescription: sp.intro.pl,
      },
    })

    const createdId = created.id as number
    slugToId.set(sp.slug, createdId)

    // Fetch the PL document to get array row IDs (needed for correct locale update)
    const createdDoc = await payload.findByID({
      collection: 'servicePages',
      id: createdId,
      locale: 'pl',
      depth: 0,
    })
    type ArrayRow = { id?: string | null }
    const reviewIds = ((createdDoc.reviews ?? []) as ArrayRow[]).map((r) => r.id)
    const baIds = ((createdDoc.beforeAfter ?? []) as ArrayRow[]).map((b) => b.id)
    const stepIds = ((createdDoc.steps ?? []) as ArrayRow[]).map((s) => s.id)

    // Update RU locale — pass row IDs to preserve PL data in non-localized fields
    await payload.update({
      collection: 'servicePages',
      id: createdId,
      locale: 'ru',
      data: {
        title: sp.title.ru,
        heading: sp.heading.ru,
        intro: sp.intro.ru,
        about: textToLexical(sp.about.ru),
        ...(sp.forWhom ? { forWhom: textToLexical(sp.forWhom.ru) } : {}),
        ...(sp.results ? { results: textToLexical(sp.results.ru) } : {}),
        steps: sp.steps.map((s, i) => ({
          id: stepIds[i],
          title: s.title.ru,
          text: s.text.ru,
        })),
        packagePromo: {
          enabled: sp.packagePromo.enabled,
          badge: sp.packagePromo.badge,
          title: sp.packagePromo.title.ru,
          desc: sp.packagePromo.desc.ru,
          nowPrice: sp.packagePromo.nowPrice.ru,
          wasPrice: sp.packagePromo.wasPrice.ru,
          link: sp.packagePromo.link,
        },
        reviews: sp.reviews.map((r, i) => ({
          id: reviewIds[i],
          quote: r.quote.ru,
          author: r.author,
          initial: r.initial,
          avatarColor: r.avatarColor,
          rating: r.rating,
          source: r.source,
          date: r.date.ru,
        })),
        beforeAfter: baMediaRefs.map((ba, i) => ({
          id: baIds[i],
          ...ba,
          caption: sp.beforeAfter[i]?.caption.ru ?? ba.caption,
        })),
        metaTitle: sp.metaTitle.ru,
        metaDescription: sp.metaDescription.ru,
        serviceName: sp.title.ru,
        serviceDescription: sp.intro.ru,
      },
    })
  }

  // SECOND PASS — resolve crossLinks slugs → ids and update each page
  for (const sp of servicePages) {
    const pageId = slugToId.get(sp.slug)
    if (!pageId) continue
    const crossIds = sp.crossLinks
      .map((s) => slugToId.get(s))
      .filter((id): id is number => id !== undefined)
    if (crossIds.length > 0) {
      await payload.update({
        collection: 'servicePages',
        id: pageId,
        locale: 'pl',
        data: { crossLinks: crossIds },
      })
    }
  }

  const pc = await payload.count({ collection: 'prices' })
  const rc = await payload.count({ collection: 'reviews' })
  const bc = await payload.count({ collection: 'beforeAfter' })
  const sp = await payload.count({ collection: 'servicePages' })
  console.log(
    `Seed complete — prices:${pc.totalDocs} reviews:${rc.totalDocs} beforeAfter:${bc.totalDocs} servicePages:${sp.totalDocs}`,
  )
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
