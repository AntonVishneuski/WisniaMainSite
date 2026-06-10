import { Star } from 'lucide-react'

export type ReviewCardItem = {
  quote: string
  author: string
  initial?: string | null
  avatarColor?: string | null
  rating?: number | null
  source?: string | null
  date?: string | null
}

/**
 * Renders ONE review card (quote, stars, avatar, author, source/date).
 *
 * Used by Opinie (homepage) and service pages.
 */
export function ReviewCard({ review }: { review: ReviewCardItem }) {
  const stars = review.rating ?? 5

  return (
    <div className="snap-start shrink-0 w-[min(320px,80vw)] bg-cream rounded-[var(--radius-xl)] p-6 shadow-md flex flex-col gap-4">
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
}
