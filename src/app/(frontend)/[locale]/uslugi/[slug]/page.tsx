import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { locales } from '@/lib/i18n'
import { getServicePage, getServicePageParams, getPublishedServicePages, getServicesNav } from '@/lib/queries'
import { getPayloadClient } from '@/lib/getPayload'
import { serviceLd, breadcrumbLd, JsonLd } from '@/lib/jsonld'
import { resolveCrossLinks } from '@/lib/service-links'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { ServicePage } from '@/components/service/ServicePage'

export const revalidate = 3600

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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
  const base = locale === 'ru' ? `${SITE}/ru` : SITE
  const url = `${base}/uslugi/${slug}`
  return {
    metadataBase: new URL(SITE),
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.intro || undefined,
    alternates: {
      canonical: url,
      languages: {
        pl: `${SITE}/uslugi/${slug}`,
        ru: `${SITE}/ru/uslugi/${slug}`,
      },
    },
    openGraph: {
      type: 'website',
      url,
      title: page.metaTitle || page.title,
      images:
        page.ogImage?.url
          ? [page.ogImage.url]
          : ['/assets/hero-olga.jpg'],
    },
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

  return (
    <>
      <JsonLd
        data={serviceLd({
          name: page.serviceName || page.title,
          description: page.serviceDescription || page.intro,
          url,
          providerName: 'Wiśnia Beauty Studio',
          providerUrl: SITE,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: base },
          { name: 'Usługi', url: `${base}/uslugi` },
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
        />
      </main>
      <Footer locale={locale} settings={settings} services={services} />
      <StickyCta locale={locale} settings={settings} />
    </>
  )
}
