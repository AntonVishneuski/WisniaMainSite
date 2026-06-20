import { setRequestLocale, getTranslations } from 'next-intl/server'
import { SITE_URL } from "@/lib/site-url"
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { locales } from '@/lib/i18n'
import { getServicePage, getServicePageParams, getPublishedServicePages, getServicesNav } from '@/lib/queries'
import { getPayloadClient } from '@/lib/getPayload'
import { serviceLd, breadcrumbLd, localBusinessLd, aggregateRatingLd, offersLd, reviewsLd, faqLd, JsonLd } from '@/lib/jsonld'
import { resolveCrossLinks } from '@/lib/service-links'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { ServicePage } from '@/components/service/ServicePage'

export const revalidate = 3600

const SITE = SITE_URL

/** Parse a numeric amount from a price string like "110 zł", "od 650 zł", "1 000 zł". */
function parsePln(price?: string | null): number | null {
  if (!price) return null
  const m = String(price).replace(/\s/g, '').match(/(\d+(?:[.,]\d+)?)/)
  if (!m) return null
  const n = Number(m[1].replace(',', '.'))
  return Number.isFinite(n) ? n : null
}
/** Build schema.org sameAs URLs from settings (Instagram handle or URL, Booksy). */
function socialSameAs(s: { instagram?: string | null; booksyUrl?: string | null } | null): string[] {
  const out: string[] = []
  const ig = s?.instagram
  if (ig) out.push(/^https?:/i.test(ig) ? ig : `https://www.instagram.com/${String(ig).replace(/^@/, '')}`)
  if (s?.booksyUrl) out.push(s.booksyUrl)
  return out
}

export async function generateStaticParams() {
  const slugs = await getServicePageParams()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const page: any = await getServicePage(slug, locale as Locale)
  if (!page) return {}
  const isRu = locale === 'ru'
  const base = isRu ? `${SITE}/ru` : SITE
  const url = `${base}/uslugi/${slug}`
  const title = page.metaTitle || page.title
  const description = page.metaDescription || page.intro || undefined
  const imageUrl = page.ogImage?.url ?? page.heroImage?.url ?? '/assets/hero-olga.jpg'
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        pl: `${SITE}/uslugi/${slug}`,
        ru: `${SITE}/ru/uslugi/${slug}`,
        'x-default': `${SITE}/uslugi/${slug}`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Wiśnia Beauty Studio',
      locale: isRu ? 'ru_RU' : 'pl_PL',
      alternateLocale: isRu ? 'pl_PL' : 'ru_RU',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const page: any = await getServicePage(slug, locale as Locale)
  if (!page) notFound()

  const t = await getTranslations({ locale })

  const payload = await getPayloadClient()
  const settings: any = await payload
    .findGlobal({ slug: 'settings', locale: locale as Locale })
    .catch(() => null)

  const published: any[] = await getPublishedServicePages(locale as Locale).catch(() => [])
  const services = await getServicesNav(locale as Locale)
  const crossLinks = resolveCrossLinks(
    page,
    published.map((p) => ({ id: p.id, slug: p.slug, title: p.title })),
  )

  const base = locale === 'ru' ? `${SITE}/ru` : SITE
  const url = `${base}/uslugi/${slug}`
  const uslugiLabel = t('nav.uslugi')
  const imageUrl = page.ogImage?.url ?? page.heroImage?.url ?? `${SITE}/assets/hero-olga.jpg`

  // Structured-data inputs (audit #4): offers from the linked price list, rating +
  // reviews from settings/page, FAQ from the page's faq field (when present).
  const priceItems = (page.priceItems ?? []) as Array<{ name?: string; price?: string | null }>
  const offers = priceItems
    .map((p) => ({ name: p?.name ?? '', price: parsePln(p?.price) }))
    .filter((o): o is { name: string; price: number } => Boolean(o.name) && o.price != null)
  const reviewsArr = (page.reviews ?? []) as Array<{ author: string; rating?: number; quote?: string }>
  const ratingValue = String(settings?.googleRating || '5,0').replace(',', '.')
  const reviewCount = (settings?.reviewsCount as number) || reviewsArr.length
  const faqItems = ((page.faq ?? []) as Array<{ question?: string; answer?: string }>)
    .map((f) => ({ q: f?.question ?? '', a: f?.answer ?? '' }))
    .filter((f) => f.q && f.a)

  return (
    <>
      <JsonLd
        data={serviceLd({
          name: page.serviceName || page.title,
          description: page.serviceDescription || page.intro,
          url,
          providerName: 'Wiśnia Beauty Studio',
          providerUrl: SITE,
          image: imageUrl,
          offers: offers.length ? offersLd(offers) : undefined,
        })}
      />
      <JsonLd
        data={localBusinessLd({
          name: 'Wiśnia Beauty Studio',
          url: SITE,
          phone: settings?.phone,
          address: settings?.address,
          geoLat: settings?.geoLat,
          geoLng: settings?.geoLng,
          image: imageUrl,
          // Confirmed hours Mon–Sat 08:00–20:00; update if the salon's schedule changes.
          openingHours: 'Mo-Sa 08:00-20:00',
          sameAs: socialSameAs(settings),
          aggregateRating: reviewCount > 0 ? aggregateRatingLd(ratingValue, reviewCount) : undefined,
          review: reviewsArr.length
            ? reviewsLd(reviewsArr.map((r) => ({ author: r.author, rating: r.rating, body: r.quote })))
            : undefined,
        })}
      />
      {faqItems.length > 0 && <JsonLd data={faqLd(faqItems)} />}
      <JsonLd
        data={breadcrumbLd([
          { name: 'Wiśnia', url: base },
          { name: uslugiLabel, url: `${base}/uslugi` },
          { name: page.title, url },
        ])}
      />
      <Header locale={locale} settings={settings} services={services} />
      <main>
        <ServicePage
          page={page}
          settings={settings}
          locale={locale}
          crossLinks={crossLinks}
          uslugiLabel={uslugiLabel}
        />
      </main>
      <Footer locale={locale} settings={settings} services={services} />
      <StickyCta locale={locale} settings={settings} />
    </>
  )
}
