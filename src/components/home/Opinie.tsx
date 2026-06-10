import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

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
        <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory scrollbar-none -mx-2 px-2">
          {reviews.map((review) => {
            const stars = review.rating ?? 5
            return (
              <div
                key={review.id}
                className="snap-start shrink-0 w-[min(320px,80vw)] bg-cream rounded-[var(--radius-xl)] p-6 shadow-md flex flex-col gap-4"
              >
                {/* Stars */}
                <div className="flex gap-0.5" aria-label={`${stars}/5`}>
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-rose-gold text-rose-gold shrink-0" aria-hidden="true" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[14.5px] leading-[1.7] text-gray flex-1">
                  {review.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-cream text-[14px] font-semibold shrink-0"
                    style={{ backgroundColor: review.avatarColor ?? '#6E122C' }}
                  >
                    {review.initial ?? review.author[0]?.toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <strong className="text-[14px] text-graphite font-semibold leading-[1.2]">
                      {review.author}
                    </strong>
                    {(review.source || review.date) && (
                      <span className="text-[12px] text-gray-soft">
                        {[review.source, review.date].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
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
