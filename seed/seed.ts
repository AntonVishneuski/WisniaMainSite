import 'dotenv/config'
import { getPayload } from 'payload'
import path from 'path'
import config from '../src/payload.config'
import { prices } from './data/prices'
import { reviews } from './data/reviews'
import { beforeAfter } from './data/beforeAfter'
import { settings } from './data/settings'
import { servicePages } from './data/service-pages'
import { authors } from './data/authors'
import { posts, type Block } from './data/posts'

const abs = (p: string) => path.resolve(process.cwd(), p)

/** Convert structured heading/paragraph blocks to a minimal Payload Lexical richText value */
function blocksToLexical(blocks: Block[]) {
  const fmt = '' as ''
  const textChild = (text: string) => ({
    type: 'text',
    text,
    format: 0,
    detail: 0,
    mode: 'normal' as const,
    style: '',
    version: 1,
  })
  return {
    root: {
      type: 'root',
      format: fmt,
      indent: 0,
      version: 1,
      direction: 'ltr' as 'ltr',
      children: blocks.map((b) =>
        b.kind === 'p'
          ? {
              type: 'paragraph',
              format: fmt,
              indent: 0,
              version: 1,
              direction: 'ltr' as 'ltr',
              children: [textChild(b.text)],
            }
          : {
              type: 'heading',
              tag: b.kind,
              format: fmt,
              indent: 0,
              version: 1,
              direction: 'ltr' as 'ltr',
              children: [textChild(b.text)],
            },
      ),
    },
  }
}

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
  const seedOnly = process.env.SEED_ONLY // e.g. 'servicePages' | 'posts'
  const fullSeed = !seedOnly
  // Gate: run the authors+posts section on a full seed OR when SEED_ONLY=posts.
  const seedPosts = fullSeed || seedOnly === 'posts'
  // Gate: run the prices/reviews/beforeAfter/settings + servicePages sections on a full seed
  // OR when SEED_ONLY=servicePages — but SKIP them when SEED_ONLY=posts (the local DB already
  // has the service pages that relatedService resolves against by slug).
  const seedServicePages = fullSeed || seedOnly === 'servicePages'

  const payload = await getPayload({ config })

  // Posts wipe strategy (mirror SEED_WIPE_SERVICE_PAGES):
  //   - Default (no SEED_WIPE_POSTS): create-if-absent by slug — safe for re-runs and production.
  //   - SEED_WIPE_POSTS=1: delete all posts then all authors (posts first — posts reference
  //     authors via the author/reviewedBy relationships) before recreating.
  const wipePosts = process.env.SEED_WIPE_POSTS === '1'
  if (wipePosts) {
    console.log('[seed] SEED_WIPE_POSTS=1 — wiping all posts then authors before recreating')
    const allPosts = await payload.find({ collection: 'posts', limit: 1000, depth: 0 })
    for (const d of allPosts.docs) await payload.delete({ collection: 'posts', id: d.id })
    const allAuthors = await payload.find({ collection: 'authors', limit: 1000, depth: 0 })
    for (const d of allAuthors.docs) await payload.delete({ collection: 'authors', id: d.id })
  }

  // Service pages wipe strategy:
  //   - Default (no SEED_WIPE_SERVICE_PAGES): never wipe servicePages. The first-pass uses
  //     create-if-absent by slug — safe for both local re-runs and production.
  //   - SEED_WIPE_SERVICE_PAGES=1: wipe all servicePages first (escape hatch for local
  //     slug-definition changes). Do this BEFORE wiping media to avoid FK violations.
  const wipeServicePages = seedServicePages && process.env.SEED_WIPE_SERVICE_PAGES === '1'
  if (wipeServicePages) {
    console.log('[seed] SEED_WIPE_SERVICE_PAGES=1 — wiping all servicePages before recreating')
    const all = await payload.find({ collection: 'servicePages', limit: 1000, depth: 0 })
    for (const d of all.docs) await payload.delete({ collection: 'servicePages', id: d.id })
  }
  if (fullSeed) {
    // Collect media IDs still referenced by existing servicePages so we don't attempt to
    // delete them (service_pages_before_after.before/after_image_id are NOT NULL; the DB
    // FK is SET NULL but the column forbids NULL, so deleting referenced media fails).
    const spMediaResult = await payload.find({ collection: 'servicePages', limit: 1000, depth: 1 })
    const spMediaIds = new Set<number>()
    for (const doc of spMediaResult.docs) {
      type SPDoc = {
        heroImage?: { id: number } | number | null
        beforeAfter?: Array<{ beforeImage?: { id: number } | number | null; afterImage?: { id: number } | number | null }>
      }
      const d = doc as SPDoc
      const heroId = typeof d.heroImage === 'object' && d.heroImage ? d.heroImage.id : (d.heroImage as number | undefined)
      if (heroId) spMediaIds.add(heroId)
      for (const ba of d.beforeAfter ?? []) {
        const bId = typeof ba.beforeImage === 'object' && ba.beforeImage ? ba.beforeImage.id : (ba.beforeImage as number | undefined)
        const aId = typeof ba.afterImage === 'object' && ba.afterImage ? ba.afterImage.id : (ba.afterImage as number | undefined)
        if (bId) spMediaIds.add(bId)
        if (aId) spMediaIds.add(aId)
      }
    }
    for (const c of ['prices', 'reviews', 'beforeAfter'] as const) {
      const all = await payload.find({ collection: c, limit: 1000, depth: 0 })
      for (const d of all.docs) await payload.delete({ collection: c, id: d.id })
    }
    // Only delete media not referenced by existing servicePages
    const allMedia = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
    for (const d of allMedia.docs) {
      if (!spMediaIds.has(d.id as number)) {
        await payload.delete({ collection: 'media', id: d.id })
      }
    }
  }

  if (fullSeed) {
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
  } // end fullSeed block

  if (seedServicePages) {
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

  // FIRST PASS — create-if-absent by slug (skip existing pages to preserve admin edits).
  // If SEED_WIPE_SERVICE_PAGES=1, all pages were already wiped above so every page is new.
  const slugToId = new Map<string, number>()
  // Track which slugs were CREATED this run (crossLinks only applied to these).
  const createdSlugs = new Set<string>()

  // Pre-load all existing servicePages to build the slug→id map for crossLink resolution.
  const existingPages = await payload.find({ collection: 'servicePages', limit: 1000, depth: 0 })
  for (const doc of existingPages.docs) {
    const slug = (doc as { slug?: string }).slug ?? ''
    if (slug) slugToId.set(slug, doc.id as number)
  }

  for (const sp of servicePages) {
    // If this slug already exists, skip creation entirely.
    if (slugToId.has(sp.slug)) {
      console.log(`[seed] servicePages: skipped existing slug "${sp.slug}"`)
      continue
    }

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
        priceFrom: sp.priceFrom?.pl,
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
    createdSlugs.add(sp.slug)
    console.log(`[seed] servicePages: created slug "${sp.slug}" (id ${createdId})`)

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
        priceFrom: sp.priceFrom?.ru,
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

  // SECOND PASS — resolve crossLinks slugs → ids and update ONLY pages created this run.
  // slugToId now covers both existing and newly created pages, so cross-links resolve correctly.
  for (const sp of servicePages) {
    if (!createdSlugs.has(sp.slug)) continue // skip existing pages
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
  } // end seedServicePages block

  // ─── Authors + posts ──────────────────────────────────────────────────────
  if (seedPosts) {
    // Seed authors first (PL create → RU update), building a key → id map.
    const authorKeyToId = new Map<string, number>()
    for (const a of authors) {
      let photoId: number | null = null
      if (a.photoFile) {
        const photoMedia = await payload.create({
          collection: 'media',
          locale: 'pl',
          data: { alt: a.name.pl },
          filePath: abs(a.photoFile),
        })
        photoId = photoMedia.id as number
      }
      const createdAuthor = await payload.create({
        collection: 'authors',
        locale: 'pl',
        data: {
          name: a.name.pl,
          jobTitle: a.jobTitle.pl,
          credentials: a.credentials.pl,
          bio: a.bio.pl,
          ...(photoId ? { photo: photoId } : {}),
        },
      })
      const authorId = createdAuthor.id as number
      await payload.update({
        collection: 'authors',
        id: authorId,
        locale: 'ru',
        data: {
          name: a.name.ru,
          jobTitle: a.jobTitle.ru,
          credentials: a.credentials.ru,
          bio: a.bio.ru,
        },
      })
      authorKeyToId.set(a.key, authorId)
      console.log(`[seed] authors: created key "${a.key}" (id ${authorId})`)
    }

    // servicePages slug → id lookup for relatedService resolution.
    const postSlugToServiceId = new Map<string, number>()
    const allServicePages = await payload.find({ collection: 'servicePages', limit: 1000, depth: 0 })
    for (const doc of allServicePages.docs) {
      const slug = (doc as { slug?: string }).slug ?? ''
      if (slug) postSlugToServiceId.set(slug, doc.id as number)
    }

    // Pre-load existing posts so we create-if-absent by slug.
    const postSlugToId = new Map<string, number>()
    const existingPosts = await payload.find({ collection: 'posts', limit: 1000, depth: 0 })
    for (const doc of existingPosts.docs) {
      const slug = (doc as { slug?: string }).slug ?? ''
      if (slug) postSlugToId.set(slug, doc.id as number)
    }
    const createdPostSlugs = new Set<string>()

    for (const p of posts) {
      if (postSlugToId.has(p.slug)) {
        console.log(`[seed] posts: skipped existing slug "${p.slug}"`)
        continue
      }

      let coverId: number | null = null
      if (p.coverFile) {
        const coverMedia = await payload.create({
          collection: 'media',
          locale: 'pl',
          data: { alt: p.title.pl },
          filePath: abs(p.coverFile),
        })
        coverId = coverMedia.id as number
      }

      const authorId = authorKeyToId.get(p.authorKey)
      if (!authorId) {
        console.warn(`[seed] posts: author key "${p.authorKey}" not found for "${p.slug}" — skipping`)
        continue
      }
      const reviewerId = p.reviewerKey ? authorKeyToId.get(p.reviewerKey) : undefined
      const relatedServiceId = p.relatedServiceSlug
        ? postSlugToServiceId.get(p.relatedServiceSlug)
        : undefined

      const created = await payload.create({
        collection: 'posts',
        locale: 'pl',
        data: {
          slug: p.slug,
          status: 'published',
          category: p.category,
          publishedAt: p.publishedAt,
          ...(p.lastReviewed ? { lastReviewed: p.lastReviewed } : {}),
          title: p.title.pl,
          excerpt: p.excerpt.pl,
          body: blocksToLexical(p.body.pl),
          author: authorId,
          ...(reviewerId ? { reviewedBy: reviewerId } : {}),
          ...(relatedServiceId ? { relatedService: relatedServiceId } : {}),
          ...(coverId ? { cover: coverId } : {}),
          metaTitle: p.metaTitle.pl,
          metaDescription: p.metaDescription.pl,
        },
      })
      const postId = created.id as number
      postSlugToId.set(p.slug, postId)
      createdPostSlugs.add(p.slug)
      console.log(`[seed] posts: created slug "${p.slug}" (id ${postId})`)

      // Update RU locale (body is localized; no localized array fields → no row-ids needed).
      await payload.update({
        collection: 'posts',
        id: postId,
        locale: 'ru',
        data: {
          title: p.title.ru,
          excerpt: p.excerpt.ru,
          body: blocksToLexical(p.body.ru),
          metaTitle: p.metaTitle.ru,
          metaDescription: p.metaDescription.ru,
        },
      })
    }

    // SECOND PASS — resolve relatedSlugs → post ids and update ONLY posts created this run.
    for (const p of posts) {
      if (!createdPostSlugs.has(p.slug)) continue
      const postId = postSlugToId.get(p.slug)
      if (!postId) continue
      const relatedIds = (p.relatedSlugs ?? [])
        .map((s) => postSlugToId.get(s))
        .filter((id): id is number => id !== undefined)
      if (relatedIds.length > 0) {
        await payload.update({
          collection: 'posts',
          id: postId,
          locale: 'pl',
          data: { relatedPosts: relatedIds },
        })
      }
    }
  } // end seedPosts block

  const pc = await payload.count({ collection: 'prices' })
  const rc = await payload.count({ collection: 'reviews' })
  const bc = await payload.count({ collection: 'beforeAfter' })
  const sp = await payload.count({ collection: 'servicePages' })
  const ac = await payload.count({ collection: 'authors' })
  const poc = await payload.count({ collection: 'posts' })
  console.log(
    `Seed complete — prices:${pc.totalDocs} reviews:${rc.totalDocs} beforeAfter:${bc.totalDocs} servicePages:${sp.totalDocs} authors:${ac.totalDocs} posts:${poc.totalDocs}`,
  )
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
