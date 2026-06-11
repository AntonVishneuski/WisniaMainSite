import { setRequestLocale, getTranslations } from 'next-intl/server'
import { SITE_URL } from "@/lib/site-url"
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { locales } from '@/lib/i18n'
import { getPost, getPostParams, getRelatedPosts, getServicesNav } from '@/lib/queries'
import { getPayloadClient } from '@/lib/getPayload'
import { medicalWebPageLd, breadcrumbLd, JsonLd } from '@/lib/jsonld'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { BlogPost } from '@/components/blog/BlogPost'
import { RelatedPosts } from '@/components/blog/RelatedPosts'

export const revalidate = 3600
const SITE = SITE_URL

export async function generateStaticParams() {
  const slugs = await getPostParams()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const post: any = await getPost(slug, locale as Locale)
  if (!post) return {}
  const isRu = locale === 'ru'
  const base = isRu ? `${SITE}/ru` : SITE
  const url = `${base}/blog/${slug}`
  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || undefined
  const imageUrl = post.ogImage?.url ?? post.cover?.url ?? '/assets/hero-olga.jpg'
  return {
    metadataBase: new URL(SITE),
    title, description,
    robots: post.noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: { pl: `${SITE}/blog/${slug}`, ru: `${SITE}/ru/blog/${slug}`, 'x-default': `${SITE}/blog/${slug}` },
      types: { 'application/rss+xml': isRu ? `${SITE}/ru/blog/rss.xml` : `${SITE}/blog/rss.xml` },
    },
    openGraph: {
      type: 'article', url, title, description, siteName: 'Wiśnia Beauty Studio',
      locale: isRu ? 'ru_RU' : 'pl_PL', alternateLocale: isRu ? 'pl_PL' : 'ru_RU',
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      authors: [SITE],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  }
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post: any = await getPost(slug, locale as Locale)
  if (!post) notFound()

  const t = await getTranslations({ locale })
  const payload = await getPayloadClient()
  const settings: any = await payload.findGlobal({ slug: 'settings', locale: locale as Locale }).catch(() => null)
  const services = await getServicesNav(locale as Locale)
  const related = await getRelatedPosts(post, locale as Locale).catch(() => [] as any[])

  const isRu = locale === 'ru'
  const base = isRu ? `${SITE}/ru` : SITE
  const url = `${base}/blog/${slug}`
  const author = typeof post.author === 'object' ? post.author : null
  const reviewer = typeof post.reviewedBy === 'object' ? post.reviewedBy : null
  const service = typeof post.relatedService === 'object' ? post.relatedService : null
  const imageUrl = post.ogImage?.url ?? post.cover?.url ?? `${SITE}/assets/hero-olga.jpg`
  const hrefFor = (s: string) => (isRu ? `/ru/blog/${s}` : `/blog/${s}`)

  const relatedCards = (related as any[]).map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt,
    categoryLabel: t(`blog.category.${p.category}` as any),
    cover: typeof p.cover === 'object' ? p.cover : null,
  }))

  return (
    <>
      <JsonLd data={medicalWebPageLd({
        headline: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        url,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        lastReviewed: post.lastReviewed,
        authorName: author?.name ?? 'Wiśnia Beauty Studio',
        authorJobTitle: author?.jobTitle,
        authorUrl: `${base}`,
        reviewerName: reviewer?.name,
        reviewerJobTitle: reviewer?.jobTitle,
        image: imageUrl,
        publisherName: 'Wiśnia Beauty Studio',
        publisherUrl: SITE,
        aboutName: service?.title,
        inLanguage: isRu ? 'ru' : 'pl',
      })} />
      <JsonLd data={breadcrumbLd([
        { name: 'Wiśnia', url: base },
        { name: t('nav.blog'), url: `${base}/blog` },
        { name: post.title, url },
      ])} />
      <Header locale={locale} settings={settings} services={services} />
      <main>
        <BlogPost post={post} settings={settings} locale={locale} blogLabel={t('nav.blog')} />
        <RelatedPosts posts={relatedCards} heading={t('blog.relatedPosts')} readMore={t('blog.readMore')} hrefFor={hrefFor} />
      </main>
      <Footer locale={locale} settings={settings} services={services} />
      <StickyCta locale={locale} settings={settings} />
    </>
  )
}
