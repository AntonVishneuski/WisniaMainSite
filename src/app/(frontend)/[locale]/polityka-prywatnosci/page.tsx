import type { Metadata } from 'next'
import { SITE_URL } from "@/lib/site-url"
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPayloadClient } from '@/lib/getPayload'
import { locales, type Locale } from '@/lib/i18n'
import { getServicesNav } from '@/lib/queries'

export const revalidate = 3600

const SITE = SITE_URL

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isRu = locale === 'ru'
  const title = isRu
    ? 'Политика конфиденциальности · Wiśnia Beauty Studio'
    : 'Polityka prywatności · Wiśnia Beauty Studio'
  const path = '/polityka-prywatnosci'
  const canonical = isRu ? `${SITE}/ru${path}` : `${SITE}${path}`
  return {
    metadataBase: new URL(SITE),
    title,
    robots: { index: true },
    alternates: {
      canonical,
      languages: { pl: `${SITE}${path}`, ru: `${SITE}/ru${path}`, 'x-default': `${SITE}${path}` },
    },
  }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations('privacy')

  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = (await payload.findGlobal({ slug: 'settings', locale: locale as Locale }).catch(() => null)) as any
  const services = await getServicesNav(locale as Locale)

  const sections = [
    { title: t('s1Title'), body: t('s1Body') },
    { title: t('s2Title'), body: t('s2Body') },
    { title: t('s3Title'), body: t('s3Body') },
    { title: t('s4Title'), body: t('s4Body') },
    { title: t('s5Title'), body: t('s5Body') },
    { title: t('s6Title'), body: t('s6Body') },
    { title: t('s7Title'), body: t('s7Body') },
    { title: t('s8Title'), body: t('s8Body') },
  ]

  return (
    <>
      <Header locale={locale} settings={settings} services={services} />
      <main>
        <div className="max-w-[760px] mx-auto px-6 py-16">
          <h1 className="font-serif text-[38px] md:text-[48px] text-graphite mb-3">
            {t('title')}
          </h1>
          <p className="text-[14px] text-gray-soft mb-8">{t('updated')}</p>
          <p className="text-[16px] text-gray leading-relaxed mb-10">{t('intro')}</p>

          {sections.map((section, i) => (
            <div key={i} className="mb-8">
              <h2 className="font-serif text-[24px] text-graphite mb-3">{section.title}</h2>
              {section.body.split('\n\n').map((paragraph, j) => (
                <p key={j} className="text-[16px] text-gray leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </main>
      <Footer locale={locale} settings={settings} services={services} />
    </>
  )
}
