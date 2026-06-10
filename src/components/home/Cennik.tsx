'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { type PriceRow } from '@/lib/price-groups'
import { contactLinks } from '@/lib/contact-links'
import { PriceRowList } from '@/components/shared/PriceRowList'

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
  const tabRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map())

  const { booksyHref } = contactLinks(settings)

  function handleTabKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const ids = TABS.map((t) => t.id)
    const currentIndex = ids.indexOf(activeTab)
    let nextIndex: number | null = null
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % ids.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + ids.length) % ids.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = ids.length - 1
    }
    if (nextIndex !== null) {
      e.preventDefault()
      const nextId = ids[nextIndex]
      setActiveTab(nextId)
      tabRefs.current.get(nextId)?.focus()
    }
  }

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
            aria-label={t('sections.pricesEyebrow')}
            className="flex flex-wrap justify-center gap-2 p-1.5 rounded-full bg-blush-deep border border-[rgba(201,149,108,0.25)]"
            onKeyDown={handleTabKeyDown}
          >
            {TABS.map(({ id, labelKey, badge }) => (
              <button
                key={id}
                ref={(el) => { if (el) tabRefs.current.set(id, el); else tabRefs.current.delete(id) }}
                id={`tab-${id}`}
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`panel-${id}`}
                tabIndex={activeTab === id ? 0 : -1}
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
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="bg-cream rounded-[var(--radius-xl)] p-6 min-[640px]:p-10 shadow-[0_12px_32px_rgba(110,18,44,0.08)]"
        >
          <PriceRowList
            rows={prices.filter((r) => r.tab === activeTab)}
            booksyHref={booksyHref}
          />
        </div>
      </div>
    </section>
  )
}
