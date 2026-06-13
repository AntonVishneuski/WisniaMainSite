'use client'

import { ArrowRight, Gift, Microscope } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CtaLink } from '@/components/ui/CtaButtons'
import { groupPrices, type PriceRow } from '@/lib/price-groups'
import { categoryAnchor } from '@/lib/category-anchor'

const TABS_ORDER: PriceRow['tab'][] = ['kosmetologia', 'laser', 'cialo', 'pakiety']

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Walk Lexical JSON and return concatenated plain text. */
function lexicalToText(note: unknown): string {
  if (!note || typeof note !== 'object') return ''
  const root = (note as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''

  function collect(nodes: unknown[]): string {
    return nodes
      .map((node) => {
        if (typeof node !== 'object' || node === null) return ''
        const n = node as Record<string, unknown>
        if (typeof n.text === 'string') return n.text
        if (Array.isArray(n.children)) return collect(n.children)
        return ''
      })
      .join('')
  }
  return collect(root.children).trim()
}

// ---------------------------------------------------------------------------
// Row renderers (internal)
// ---------------------------------------------------------------------------

function GiftRow({ row }: { row: PriceRow }) {
  const isMicroscope =
    row.name.toLowerCase().includes('dermatoskop') ||
    row.name.toLowerCase().includes('дерматоскоп')
  return (
    <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[rgba(201,149,108,0.12)] border border-[rgba(201,149,108,0.3)] text-[14px] text-cherry font-medium w-fit my-2">
      {isMicroscope ? (
        <Microscope className="w-4 h-4 shrink-0 text-rose-gold" aria-hidden="true" />
      ) : (
        <Gift className="w-4 h-4 shrink-0 text-rose-gold" aria-hidden="true" />
      )}
      <span>{row.name}</span>
    </div>
  )
}

function PackageRow({ row }: { row: PriceRow }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 rounded-[var(--radius-md)] border border-[rgba(201,149,108,0.25)] bg-cream shadow-[0_2px_8px_rgba(110,18,44,0.06)]">
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center w-fit mb-1 px-2 py-0.5 rounded-full bg-cherry text-cream text-[11px] font-semibold tracking-[0.06em]">
          -15%
        </span>
        <strong className="font-serif text-[19px] font-semibold text-graphite leading-[1.2]">
          {row.name}
        </strong>
        {row.subline && (
          <span className="text-[13.5px] text-gray-soft">{row.subline}</span>
        )}
      </div>
      {row.price && (
        <div className="flex flex-col items-end shrink-0">
          <span className="font-serif text-[22px] font-semibold text-cherry">{row.price}</span>
          {row.priceWas && (
            <span className="text-[13px] text-gray-soft line-through">{row.priceWas}</span>
          )}
        </div>
      )}
    </div>
  )
}

function NormalRow({
  row,
  booksyHref,
  bookShortLabel,
}: {
  row: PriceRow
  booksyHref: string
  bookShortLabel: string
}) {
  const bookingHref = row.bookingUrl ?? booksyHref
  return (
    <div className="flex flex-col gap-2 min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between min-[640px]:gap-4 py-4 border-b border-[rgba(26,26,26,0.08)] last:border-b-0">
      {/* Name + subline */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <strong className="font-serif text-[19px] font-semibold text-graphite leading-[1.2]">
          {row.name}
        </strong>
        {row.subline && (
          <span className="text-[13px] text-gray-soft">{row.subline}</span>
        )}
      </div>

      {/* Price + book CTA */}
      <div className="flex items-center gap-3 shrink-0">
        {row.price && (
          <span className="font-serif text-[20px] font-semibold text-graphite">
            {row.price}
          </span>
        )}
        <CtaLink
          method="booksy"
          href={bookingHref}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-cherry text-cherry text-[13px] font-medium transition-all duration-200 hover:bg-cherry hover:text-cream"
        >
          {bookShortLabel}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </CtaLink>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PriceRowList
// ---------------------------------------------------------------------------

/**
 * Renders a flat ordered list of price rows (normal / gift / package variants),
 * with category headers shown when the `category` changes between consecutive rows.
 *
 * Used by Cennik (homepage) and service pages.
 */
export function PriceRowList({
  rows,
  booksyHref,
}: {
  rows: PriceRow[]
  booksyHref: string
}) {
  const t = useTranslations()
  const bookShortLabel = t('cta.bookShort')

  // Group all rows by tab and category
  const grouped = groupPrices(rows)

  // Collect only the tabs that have at least one row, in canonical order
  const presentTabs = TABS_ORDER.filter((tab) => grouped[tab].length > 0)

  if (presentTabs.length === 0) {
    return <p className="text-center text-gray-soft py-8 text-[15px]">—</p>
  }

  return (
    <>
      {presentTabs.map((tab) => {
        const groups = grouped[tab]
        const isPakiety = tab === 'pakiety'
        return groups.map((group, gi) => (
          <div key={`${tab}-${gi}`} className="mb-8 last:mb-0">
            {/* Category header */}
            {group.category && (
              <div
                id={categoryAnchor(group.category)}
                className="scroll-mt-[100px] flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4 pb-3 border-b-2 border-[rgba(201,149,108,0.3)]"
              >
                <h3 className="font-serif text-[22px] font-semibold text-graphite leading-[1.2]">
                  {group.category}
                </h3>
                {group.categorySubtitle && (
                  <span className="text-[13px] text-gray-soft">
                    {group.categorySubtitle}
                  </span>
                )}
              </div>
            )}

            {/* Rows */}
            <div className={isPakiety ? 'grid gap-3 min-[640px]:grid-cols-2' : ''}>
              {group.rows.map((row) => {
                if (row.isGift) {
                  return <GiftRow key={row.id} row={row} />
                }

                if (row.isPackage) {
                  return <PackageRow key={row.id} row={row} />
                }

                const noteText = lexicalToText(row.note)
                return (
                  <div key={row.id}>
                    <NormalRow
                      row={row}
                      booksyHref={booksyHref}
                      bookShortLabel={bookShortLabel}
                    />
                    {noteText && (
                      <p className="text-[12.5px] text-gray-soft mt-1 mb-2">{noteText}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))
      })}
    </>
  )
}
