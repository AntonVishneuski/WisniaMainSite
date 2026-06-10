import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { getHomeData } from '@/lib/queries'
import type { Locale } from '@/lib/i18n'
import type { PriceRow } from '@/lib/price-groups'
import { localBusinessLd, aggregateRatingLd, JsonLd } from '@/lib/jsonld'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { Hero } from '@/components/home/Hero'
import { PainCards } from '@/components/home/PainCards'
import { Kierunki } from '@/components/home/Kierunki'
import { Cennik } from '@/components/home/Cennik'
import { Efekty } from '@/components/home/Efekty'
import { ONas } from '@/components/home/ONas'
import { JakToDziala } from '@/components/home/JakToDziala'
import { Opinie } from '@/components/home/Opinie'
import { Faq } from '@/components/home/Faq'
import { Kontakt } from '@/components/home/Kontakt'

export const revalidate = 3600

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isRu = locale === 'ru'
  const title = isRu
    ? 'Wiśnia Beauty Studio — косметология, лазер, массаж · Варшава'
    : 'Wiśnia Beauty Studio — kosmetologia, laser, masaże · Warszawa'
  const description = isRu
    ? 'Студия красоты в центре Варшавы: аппаратная косметология, RF-лифтинг, IPL, мезотерапия, лазерная эпиляция Estera, массаж. Индивидуальный протокол.'
    : 'Studio kosmetologiczne w centrum Warszawy: kosmetologia aparaturowa, RF-lifting, IPL, mezoterapia, depilacja laserowa Estera, masaże. Indywidualny protokół.'
  const canonical = isRu ? `${SITE}/ru` : SITE
  return {
    title, description,
    alternates: { canonical, languages: { pl: SITE, ru: `${SITE}/ru` } },
    openGraph: { type: 'website', url: canonical, title, description, images: ['/assets/hero-olga.jpg'] },
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const { prices, reviews, beforeAfter, settings } = await getHomeData(locale as Locale)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = settings as any
  const rating = String(s?.googleRating || '5.0').replace(',', '.')
  const business = localBusinessLd({
    name: 'Wiśnia Beauty Studio', url: SITE, phone: s?.phone, address: s?.address,
    geoLat: s?.geoLat, geoLng: s?.geoLng, hours: s?.hours, image: `${SITE}/assets/hero-olga.jpg`,
  })
  return (
    <>
      <JsonLd data={{ ...business, aggregateRating: aggregateRatingLd(rating, s?.reviewsCount || reviews.length) }} />
      <Header locale={locale} settings={s} />
      <main>
        <Hero settings={s} />
        <PainCards />
        <Kierunki />
        <Cennik prices={prices as unknown as PriceRow[]} settings={s} />
        <Efekty items={beforeAfter as any} />
        <ONas />
        <JakToDziala />
        <Opinie reviews={reviews as any} settings={s} />
        <Faq />
        <Kontakt settings={s} />
      </main>
      <Footer locale={locale} settings={s} />
      <StickyCta locale={locale} settings={s} />
    </>
  )
}
