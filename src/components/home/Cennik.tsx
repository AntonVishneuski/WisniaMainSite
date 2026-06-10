'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight, Gift, Microscope } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaButtons'
import { groupPrices, type PriceRow } from '@/lib/price-groups'

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
// Tab definitions
// ---------------------------------------------------------------------------

type TabId = 'kosmetologia' | 'laser' | 'cialo' | 'pakiety'

const TABS: { id: TabId; labelKey: string; badge?: string }[] = [
  { id: 'kosmetologia', labelKey: 'sections.tabFace' },
  { id: 'laser',        labelKey: 'sections.tabLaser' },
  { id: 'cialo',        labelKey: 'sections.tabBody' },
  { id: 'pakiety',      labelKey: 'sections.tabPkg', badge: '-15%' },
]

// ---------------------------------------------------------------------------
// Row renderers
// ---------------------------------------------------------------------------

function GiftRow({ row }: { row: PriceRow }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[rgba(201,149,108,0.12)] border border-[rgba(201,149,108,0.3)] text-[14px] text-rose-gold-dk font-medium w-fit my-2">
      <Gift className="w-4 h-4 shrink-0 text-rose-gold" aria-hidden="true" />
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
        <strong className="font-serif text-[17px] font-semibold text-graphite leading-[1.2]">
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
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[rgba(26,26,26,0.08)] last:border-b-0">
      {/* Name + subline */}
      <div className="flex flex-col gap-0.5">
        <strong className="font-serif text-[17px] font-semibold text-graphite leading-[1.2]">
          {row.name}
        </strong>
        {row.subline && (
          <span className="text-[13px] text-gray-soft">{row.subline}</span>
        )}
      </div>

      {/* Price + book CTA */}
      <div className="flex items-center gap-3 shrink-0">
        {row.price && (
          <span className="font-serif text-[18px] font-semibold text-graphite">
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
// Cennik (main component)
// ---------------------------------------------------------------------------

type CennikSettings = { booksyUrl?: string | null }

export function Cennik({
  prices,
  settings,
}: {
  prices: PriceRow[]
  settings?: CennikSettings | null
}) {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<TabId>('kosmetologia')

  const grouped = groupPrices(prices)
  const booksyHref = settings?.booksyUrl ?? 'https://wisniabeauty.booksy.com/a'
  const bookShortLabel = t('cta.bookShort')

  return (
    <section id="cennik" className="bg-blush w-full py-[clamp(56px,9vw,112px)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">{t('sections.pricesEyebrow')}</p>
          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance">
            {t('sections.pricesTitle')}
          </h2>
        </div>

        {/* Tab buttons */}
        <div className="flex justify-center mb-8">
          <div
            role="tablist"
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-full bg-blush-deep border border-[rgba(201,149,108,0.25)]"
          >
            {TABS.map(({ id, labelKey, badge }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={[
                  'inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[14.5px] font-medium transition-all duration-200',
                  activeTab === id
                    ? 'bg-cherry text-cream shadow-[0_2px_8px_rgba(110,18,44,0.12)]'
                    : 'text-gray hover:text-graphite hover:bg-[rgba(253,250,247,0.6)]',
                ].join(' ')}
              >
                {t(labelKey)}
                {badge && (
                  <span
                    className={[
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      activeTab === id
                        ? 'bg-cream text-cherry'
                        : 'bg-cherry text-cream',
                    ].join(' ')}
                  >
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price panel */}
        <div className="bg-cream rounded-[var(--radius-xl)] p-6 min-[640px]:p-10 shadow-[0_12px_32px_rgba(110,18,44,0.08)]">
          {grouped[activeTab].length === 0 ? (
            <p className="text-center text-gray-soft py-8 text-[15px]">—</p>
          ) : (
            grouped[activeTab].map((group, gi) => (
              <div key={gi} className="mb-8 last:mb-0">
                {/* Category header */}
                {group.category && (
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4 pb-3 border-b-2 border-[rgba(201,149,108,0.3)]">
                    <h3 className="font-serif text-[20px] font-semibold text-graphite leading-[1.2]">
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
                <div className={activeTab === 'pakiety' ? 'grid gap-3 min-[640px]:grid-cols-2' : ''}>
                  {group.rows.map((row) => {
                    // Special: gift pill (microscope variant handled as gift)
                    if (row.isGift) {
                      const isMicroscope = row.name.toLowerCase().includes('dermatoskop') ||
                        row.name.toLowerCase().includes('dерматоскоп')
                      return (
                        <div
                          key={row.id}
                          className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[rgba(201,149,108,0.12)] border border-[rgba(201,149,108,0.3)] text-[14px] text-rose-gold-dk font-medium w-fit my-2"
                        >
                          {isMicroscope
                            ? <Microscope className="w-4 h-4 shrink-0 text-rose-gold" aria-hidden="true" />
                            : <Gift className="w-4 h-4 shrink-0 text-rose-gold" aria-hidden="true" />
                          }
                          <span>{row.name}</span>
                        </div>
                      )
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
                        {/* Render note as plain text if present */}
                        {noteText && (
                          <p className="text-[12.5px] text-gray-soft mt-1 mb-2">{noteText}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
