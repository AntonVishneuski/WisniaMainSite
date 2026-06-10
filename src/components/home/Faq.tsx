'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Minus } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

const ITEMS = [1, 2, 3, 4, 5, 6] as const

export function Faq() {
  const t = useTranslations()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i))
  }

  return (
    <section className="w-full py-[clamp(56px,9vw,112px)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <Reveal>
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">{t('sections.faqEyebrow')}</p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance">
              {t('sections.faqTitle')}
            </h2>
          </div>
        </Reveal>

        {/* Accordion */}
        <div className="max-w-[800px] mx-auto flex flex-col divide-y divide-[rgba(26,26,26,0.08)]">
          {ITEMS.map((n) => {
            const isOpen = openIndex === n
            return (
              <div key={n} className="py-1">
                <button
                  type="button"
                  onClick={() => toggle(n)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left group"
                >
                  <span className="font-serif text-[18px] font-semibold text-graphite leading-[1.3] group-hover:text-cherry transition-colors duration-200">
                    {t(`faq.q${n}`)}
                  </span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-blush flex items-center justify-center text-cherry transition-colors duration-200 group-hover:bg-cherry group-hover:text-cream">
                    {isOpen
                      ? <Minus className="w-4 h-4" aria-hidden="true" />
                      : <Plus className="w-4 h-4" aria-hidden="true" />
                    }
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-4 pr-10">
                    <p className="text-[15.5px] leading-[1.7] text-gray">
                      {t(`faq.a${n}`)}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
