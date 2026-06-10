import { RichText } from '@payloadcms/richtext-lexical/react'
import { Reveal } from '@/components/ui/Reveal'
import { Breadcrumb } from './Breadcrumb'
import { ServiceHero } from './ServiceHero'
import { ServiceSteps } from './ServiceSteps'
import { PriceAside } from './PriceAside'
import { PackagePromo } from './PackagePromo'
import { CrossLinks } from './CrossLinks'
import { ReviewCard } from '@/components/shared/ReviewCard'
import { BeforeAfterCard } from '@/components/shared/BeforeAfterCard'
import { contactLinks } from '@/lib/contact-links'
import type { ServiceLinkRef } from '@/lib/service-links'
import type { PriceRow } from '@/lib/price-groups'

type Props = {
  page: any
  settings: any
  locale: string
  crossLinks: ServiceLinkRef[]
}

export function ServicePage({ page, settings, locale, crossLinks }: Props) {
  const homeHref = locale === 'ru' ? '/ru' : '/'
  const { booksyHref } = contactLinks(settings)

  const breadcrumbItems = [
    { label: 'Wiśnia', href: homeHref },
    { label: 'Usługi' },
    { label: page.title },
  ]

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-6 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Hero */}
      <Reveal>
        <ServiceHero
          heading={page.hero?.heading || page.title}
          intro={page.hero?.intro ?? undefined}
          image={page.hero?.heroImage ?? undefined}
          settings={settings}
        />
      </Reveal>

      {/* Main content + price aside */}
      <div className="max-w-[1200px] mx-auto px-6 py-[clamp(40px,6vw,72px)] grid grid-cols-1 min-[960px]:grid-cols-[1fr_340px] gap-[clamp(32px,5vw,64px)] items-start">
        {/* Prose column */}
        <div>
          {/* About */}
          {page.about && (
            <Reveal>
              <div className="prose max-w-prose">
                <RichText data={page.about} />
              </div>
            </Reveal>
          )}

          {/* For Whom */}
          {page.forWhom && (
            <Reveal>
              <div className="prose max-w-prose mt-8">
                <RichText data={page.forWhom} />
              </div>
            </Reveal>
          )}

          {/* Steps */}
          {page.steps && page.steps.length > 0 && (
            <Reveal>
              <ServiceSteps steps={page.steps} />
            </Reveal>
          )}

          {/* Results */}
          {page.results && (
            <Reveal>
              <div className="prose max-w-prose mt-8">
                <RichText data={page.results} />
              </div>
            </Reveal>
          )}
        </div>

        {/* Price aside column */}
        <div>
          <Reveal>
            <PriceAside
              heading={page.priceHeading ?? undefined}
              rows={(page.priceItems ?? []) as PriceRow[]}
              booksyHref={booksyHref}
            />
            <PackagePromo promo={page.packagePromo ?? undefined} />
          </Reveal>
        </div>
      </div>

      {/* Before / After */}
      {page.beforeAfter && page.beforeAfter.length > 0 && (
        <Reveal>
          <div className="max-w-[1200px] mx-auto px-6 pb-[clamp(32px,5vw,56px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 min-[960px]:grid-cols-3 gap-5">
              {(page.beforeAfter as any[]).map((ba: any, i: number) => (
                <BeforeAfterCard key={i} item={ba} />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Reviews */}
      {page.reviews && page.reviews.length > 0 && (
        <Reveal>
          <div className="max-w-[1200px] mx-auto px-6 pb-[clamp(32px,5vw,56px)]">
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2">
              {(page.reviews as any[]).map((r: any, i: number) => (
                <ReviewCard key={i} review={r} />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Cross-links */}
      {crossLinks.length > 0 && (
        <Reveal>
          <div className="max-w-[1200px] mx-auto px-6 pb-[clamp(40px,6vw,72px)]">
            <CrossLinks links={crossLinks} locale={locale} />
          </div>
        </Reveal>
      )}
    </div>
  )
}
