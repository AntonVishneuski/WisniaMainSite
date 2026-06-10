import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { locales } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import { getPublishedServicePages, getServicesNav } from '@/lib/queries'
import { getPayloadClient } from '@/lib/getPayload'
import { breadcrumbLd, JsonLd } from '@/lib/jsonld'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { Reveal } from '@/components/ui/Reveal'
import { Breadcrumb } from '@/components/service/Breadcrumb'

export const revalidate = 3600

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const isRu = locale === 'ru'
  const title = `${t('nav.uslugi')} · Wiśnia Beauty Studio`
  const description = t('service.indexLead')
  const canonical = isRu ? `${SITE}/ru/uslugi` : `${SITE}/uslugi`
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        pl: `${SITE}/uslugi`,
        ru: `${SITE}/ru/uslugi`,
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'Wiśnia Beauty Studio',
      locale: isRu ? 'ru_RU' : 'pl_PL',
      alternateLocale: isRu ? 'pl_PL' : 'ru_RU',
      images: [{ url: '/assets/hero-olga.jpg', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/assets/hero-olga.jpg'] },
  }
}

export default async function UslugiIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale })
  const isRu = locale === 'ru'
  const base = isRu ? `${SITE}/ru` : SITE
  const homeHref = isRu ? '/ru' : '/'
  const uslugiHref = isRu ? '/ru/uslugi' : '/uslugi'

  const payload = await getPayloadClient()
  const settings: any = await payload
    .findGlobal({ slug: 'settings', locale: locale as Locale })
    .catch(() => null)

  const [services, pages] = await Promise.all([
    getServicesNav(locale as Locale),
    getPublishedServicePages(locale as Locale).catch(() => [] as any[]),
  ])

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Wiśnia', url: base },
          { name: t('nav.uslugi'), url: `${base}/uslugi` },
        ])}
      />
      <Header locale={locale} settings={settings} services={services} />
      <main>
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-6 pt-6">
          <Breadcrumb
            items={[
              { label: 'Wiśnia', href: homeHref },
              { label: t('nav.uslugi') },
            ]}
          />
        </div>

        {/* Page header */}
        <Reveal>
          <section className="max-w-[1200px] mx-auto px-6 pt-4 pb-10">
            <p className="eyebrow mb-3">{t('nav.uslugi')}</p>
            <h1 className="font-serif text-[clamp(28px,3.5vw,48px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance max-w-[640px]">
              {t('nav.uslugi')} · Wiśnia Beauty Studio
            </h1>
            <p className="mt-4 text-[17px] leading-[1.65] text-gray max-w-[600px]">
              {t('service.indexLead')}
            </p>
          </section>
        </Reveal>

        {/* Services grid */}
        <section className="max-w-[1200px] mx-auto px-6 pb-[clamp(56px,9vw,112px)]">
          {pages.length > 0 ? (
            <div className="grid grid-cols-1 min-[640px]:grid-cols-2 min-[960px]:grid-cols-3 gap-5">
              {(pages as any[]).map((page: any) => {
                const href = isRu ? `/ru/uslugi/${page.slug}` : `/uslugi/${page.slug}`
                return (
                  <Reveal key={page.slug}>
                    <Link
                      href={href}
                      className="group flex flex-col gap-4 p-7 rounded-[var(--radius-lg)] border border-[rgba(201,149,108,0.25)] bg-cream shadow-[0_2px_8px_rgba(110,18,44,0.06)] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(110,18,44,0.08)] hover:-translate-y-1 hover:border-[rgba(201,149,108,0.5)] h-full"
                    >
                      <strong className="font-serif text-[19px] font-semibold text-graphite leading-[1.2]">
                        {page.title}
                      </strong>
                      {page.intro && (
                        <span className="text-[14.5px] leading-[1.55] text-gray-soft flex-1 line-clamp-3">
                          {page.intro}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-[13.5px] font-medium text-cherry mt-1 transition-gap duration-200">
                        {isRu ? 'Подробнее' : 'Dowiedz się więcej'}
                        <ArrowRight
                          className="w-[14px] h-[14px] transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          ) : (
            <p className="text-gray">{isRu ? 'Скоро.' : 'Wkrótce.'}</p>
          )}
        </section>
      </main>
      <Footer locale={locale} settings={settings} services={services} />
      <StickyCta locale={locale} settings={settings} />
    </>
  )
}
