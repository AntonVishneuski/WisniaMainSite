import Image from 'next/image'
import { getFormatter, getTranslations } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Reveal } from '@/components/ui/Reveal'
import { Breadcrumb } from '@/components/service/Breadcrumb'
import { PostMeta } from './PostMeta'
import { TableOfContents } from './TableOfContents'
import { HeadingAnchors } from './HeadingAnchors'
import { AuthorBio } from './AuthorBio'
import { PostCta } from './PostCta'
import { contactLinks } from '@/lib/contact-links'
import { readingMinutes } from '@/lib/reading-time'
import { extractHeadings } from '@/lib/lexical-headings'

const BODY_ID = 'post-body'

export async function BlogPost({
  post, settings, locale, blogLabel,
}: {
  post: any
  settings: any
  locale: string
  blogLabel: string
}) {
  const t = await getTranslations({ locale })
  const format = await getFormatter({ locale })
  const isRu = locale === 'ru'
  const homeHref = isRu ? '/ru' : '/'
  const blogHref = isRu ? '/ru/blog' : '/blog'
  const { booksyHref } = contactLinks(settings)

  const headings = extractHeadings(post.body)
  const minutes = readingMinutes(post.body)
  const author = typeof post.author === 'object' ? post.author : null
  const reviewer = typeof post.reviewedBy === 'object' ? post.reviewedBy : null
  const service = typeof post.relatedService === 'object' ? post.relatedService : null
  const serviceHref = service ? (isRu ? `/ru/uslugi/${service.slug}` : `/uslugi/${service.slug}`) : null
  const dateLabel = post.publishedAt ? format.dateTime(new Date(post.publishedAt), { year: 'numeric', month: 'long', day: 'numeric' }) : null
  const lastReviewedLabel = post.lastReviewed
    ? `${t('blog.updatedOn')}: ${format.dateTime(new Date(post.lastReviewed), { year: 'numeric', month: 'long', day: 'numeric' })}`
    : null

  return (
    <article>
      <div className="max-w-[1200px] mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: 'Wiśnia', href: homeHref }, { label: blogLabel, href: blogHref }, { label: post.title }]} />
      </div>

      {post.cover?.url && (
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-xl)]">
            <Image src={post.cover.url} alt={post.cover.alt ?? post.title} fill priority className="object-cover" sizes="(max-width:1000px) 100vw, 952px" />
          </div>
        </div>
      )}

      <div className="max-w-[760px] mx-auto px-6 py-[clamp(32px,5vw,56px)]">
        <Reveal>
          <h1 className="font-serif text-[clamp(30px,4.5vw,46px)] font-semibold text-graphite leading-[1.12] mb-4">{post.title}</h1>
          <PostMeta
            dateLabel={dateLabel}
            readingTimeLabel={t('blog.readingTime', { min: minutes })}
            authorName={author?.name}
            authorJobTitle={author?.jobTitle}
            authorPhoto={author?.photo}
          />
        </Reveal>

        <TableOfContents headings={headings} title={t('blog.toc')} />

        <div id={BODY_ID} className="prose max-w-none">
          <RichText data={post.body} />
        </div>
        <HeadingAnchors containerId={BODY_ID} />

        <AuthorBio author={author} reviewer={reviewer} reviewedByLabel={t('blog.reviewedBy')} lastReviewedLabel={lastReviewedLabel} />

        <PostCta
          title={t('blog.relatedServiceCtaTitle')}
          buttonLabel={t('blog.relatedServiceCtaButton')}
          serviceHref={serviceHref}
          booksyHref={booksyHref}
        />
      </div>
    </article>
  )
}
