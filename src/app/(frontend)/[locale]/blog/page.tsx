import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { locales } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import { getPublishedPosts, getServicesNav } from '@/lib/queries'
import { getPayloadClient } from '@/lib/getPayload'
import { breadcrumbLd, JsonLd } from '@/lib/jsonld'
import { CATEGORY_VALUES } from '@/collections/Posts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { Reveal } from '@/components/ui/Reveal'
import { Breadcrumb } from '@/components/service/Breadcrumb'
import { BlogIndex, type IndexPost } from '@/components/blog/BlogIndex'

export const revalidate = 3600
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const isRu = locale === 'ru'
  const title = `Blog · Wiśnia Beauty Studio`
  const description = t('blog.lead')
  const canonical = isRu ? `${SITE}/ru/blog` : `${SITE}/blog`
  return {
    metadataBase: new URL(SITE),
    title, description,
    alternates: { canonical, languages: { pl: `${SITE}/blog`, ru: `${SITE}/ru/blog` } },
    openGraph: {
      type: 'website', url: canonical, title, description, siteName: 'Wiśnia Beauty Studio',
      locale: isRu ? 'ru_RU' : 'pl_PL', alternateLocale: isRu ? 'pl_PL' : 'ru_RU',
      images: [{ url: '/assets/hero-olga.jpg', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/assets/hero-olga.jpg'] },
  }
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })
  const isRu = locale === 'ru'
  const base = isRu ? `${SITE}/ru` : SITE
  const homeHref = isRu ? '/ru' : '/'

  const payload = await getPayloadClient()
  const settings: any = await payload.findGlobal({ slug: 'settings', locale: locale as Locale }).catch(() => null)
  const [services, posts] = await Promise.all([
    getServicesNav(locale as Locale),
    getPublishedPosts(locale as Locale).catch(() => [] as any[]),
  ])

  const indexPosts: IndexPost[] = (posts as any[]).map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category,
    categoryLabel: t(`blog.category.${p.category}` as any),
    cover: typeof p.cover === 'object' ? p.cover : null,
  }))
  const categories = CATEGORY_VALUES.map((v) => ({ value: v, label: t(`blog.category.${v}` as any) }))
  const localePrefix = isRu ? '/ru' : ''

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Wiśnia', url: base }, { name: 'Blog', url: `${base}/blog` }])} />
      <Header locale={locale} settings={settings} services={services} />
      <main>
        <div className="max-w-[1200px] mx-auto px-6 pt-6">
          <Breadcrumb items={[{ label: 'Wiśnia', href: homeHref }, { label: 'Blog' }]} />
        </div>
        <Reveal>
          <section className="max-w-[1200px] mx-auto px-6 pt-4 pb-10">
            <p className="eyebrow mb-3">Blog</p>
            <h1 className="font-serif text-[clamp(28px,3.5vw,48px)] font-semibold text-graphite leading-[1.12] max-w-[640px]">Blog · Wiśnia Beauty Studio</h1>
            <p className="mt-4 text-[17px] leading-[1.65] text-gray max-w-[600px]">{t('blog.lead')}</p>
          </section>
        </Reveal>
        <BlogIndex posts={indexPosts} categories={categories} allLabel={t('blog.allCategories')} readMore={t('blog.readMore')} localePrefix={localePrefix} />
      </main>
      <Footer locale={locale} settings={settings} services={services} />
      <StickyCta locale={locale} settings={settings} />
    </>
  )
}
