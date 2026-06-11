import { CtaLink } from '@/components/ui/CtaButtons'
import type { PriceRow } from '@/lib/price-groups'

export function PriceAside({
  heading,
  rows,
  booksyHref,
  waHref,
  bookLabel,
  waLabel,
  consultNote,
  fullPriceHref,
  fullPriceLabel,
}: {
  heading?: string | null
  rows: PriceRow[]
  booksyHref: string
  waHref: string
  bookLabel: string
  waLabel: string
  consultNote?: string | null
  fullPriceHref?: string | null
  fullPriceLabel?: string | null
}) {
  if (!rows || rows.length === 0) return null

  // Show only the most popular handful; the full list lives in the home Cennik
  // (linked below). Keeps the aside short and scannable.
  const MAX_ROWS = 5
  const visibleRows = rows.slice(0, MAX_ROWS)

  return (
    <aside className="bg-white border border-[var(--line)] rounded-[var(--radius-lg)] shadow-md p-7">
      {heading && (
        <h2 className="font-serif text-[22px] font-semibold text-graphite mb-5">{heading}</h2>
      )}

      {/* Compact price rows — no per-row button */}
      <div>
        {visibleRows.map((row) => (
          <div
            key={row.id}
            className="flex items-baseline justify-between gap-4 py-[13px] border-b border-[rgba(26,26,26,0.08)] last:border-b-0"
          >
            {/* Name + optional subline */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-serif text-[17px] font-semibold text-graphite leading-[1.25]">
                {row.name}
              </span>
              {row.subline && (
                <span className="font-sans text-[12.5px] text-gray-soft leading-snug">{row.subline}</span>
              )}
            </div>

            {/* Price */}
            {row.price && (
              <span className="font-serif text-[18px] font-semibold text-graphite whitespace-nowrap shrink-0">
                {row.price}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Link to the full price list (home cennik, matching tab) */}
      {fullPriceHref && fullPriceLabel && (
        <a
          href={fullPriceHref}
          className="inline-flex items-center gap-1 mt-3.5 text-[13px] font-medium text-cherry border-b border-[var(--line-warm)] hover:border-cherry transition-colors"
        >
          {fullPriceLabel}
          <span aria-hidden="true">→</span>
        </a>
      )}

      {/* Bottom CTA cluster — stacked full-width */}
      <div className="flex flex-col gap-[10px] mt-5">
        <CtaLink
          method="booksy"
          href={booksyHref}
          className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-cherry text-cream text-[14px] font-medium transition-colors hover:bg-cherry/90"
        >
          {bookLabel}
        </CtaLink>
        <CtaLink
          method="whatsapp"
          href={waHref}
          className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full border border-cherry text-cherry text-[14px] font-medium transition-colors hover:bg-cherry hover:text-cream"
        >
          {waLabel}
        </CtaLink>
      </div>

      {/* Consultation note */}
      {consultNote && (
        <p className="text-[13px] text-gray-soft mt-4 leading-snug">{consultNote}</p>
      )}
    </aside>
  )
}
