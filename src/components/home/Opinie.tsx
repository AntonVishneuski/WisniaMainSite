import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { ReviewCard } from '@/components/shared/ReviewCard'

type Review = {
  id: string | number
  quote: string
  author: string
  initial?: string | null
  avatarColor?: string | null
  rating?: number | null
  source?: string | null
  date?: string | null
}

type OpinieSSettings = {
  googleRating?: string | null
  booksyRating?: string | null
}

export function Opinie({
  reviews,
  settings,
}: {
  reviews: Review[]
  settings: OpinieSSettings
}) {
  const t = useTranslations()

  return (
    <section className="bg-blush w-full py-[clamp(56px,9vw,112px)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <Reveal>
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">{t('sections.reviewsEyebrow')}</p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance">
              {t('sections.reviewsTitle')}
            </h2>
          </div>
        </Reveal>

        {/* Horizontal scroll reviews */}
        <div
          className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory scrollbar-none -mx-2 px-2"
          role="region"
          aria-label={t('sections.reviewsTitle')}
          tabIndex={0}
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Rating badges */}
        {(settings.googleRating || settings.booksyRating) && (
          <Reveal>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {settings.googleRating && (
                <div className="flex items-center gap-3 bg-cream rounded-[var(--radius-md)] px-5 py-3 shadow-sm border border-[rgba(201,149,108,0.2)]">
                  <strong className="font-serif text-[24px] font-semibold text-graphite leading-none">
                    {settings.googleRating}
                  </strong>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-rose-gold text-rose-gold" aria-hidden="true" />
                      ))}
                    </div>
                    <span className="text-[12px] text-gray-soft">Google</span>
                  </div>
                </div>
              )}
              {settings.booksyRating && (
                <div className="flex items-center gap-3 bg-cream rounded-[var(--radius-md)] px-5 py-3 shadow-sm border border-[rgba(201,149,108,0.2)]">
                  <strong className="font-serif text-[24px] font-semibold text-graphite leading-none">
                    {settings.booksyRating}
                  </strong>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-rose-gold text-rose-gold" aria-hidden="true" />
                      ))}
                    </div>
                    <span className="text-[12px] text-gray-soft">Booksy</span>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        )}

      </div>
    </section>
  )
}
