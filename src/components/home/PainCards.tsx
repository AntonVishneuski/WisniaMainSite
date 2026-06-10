import { useTranslations } from 'next-intl'
import { Smile, Clock, Leaf } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

export function PainCards() {
  const t = useTranslations()

  const cards = [
    { icon: Smile, titleKey: 'pain.c1t', textKey: 'pain.c1p' },
    { icon: Clock,  titleKey: 'pain.c2t', textKey: 'pain.c2p' },
    { icon: Leaf,   titleKey: 'pain.c3t', textKey: 'pain.c3p' },
  ] as const

  return (
    <section className="bg-blush w-full py-[clamp(56px,9vw,112px)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <Reveal className="text-center mb-12">
          <p className="eyebrow mb-3">{t('pain.eyebrow')}</p>
          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance max-w-[640px] mx-auto">
            {t('pain.title')}
          </h2>
        </Reveal>

        {/* Cards grid */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, titleKey, textKey }) => (
            <Reveal key={titleKey}>
              <div className="bg-cream rounded-[var(--radius-lg)] p-8 shadow-[0_2px_8px_rgba(110,18,44,0.06)] h-full flex flex-col gap-5">
                <div className="w-[52px] h-[52px] rounded-full bg-blush-deep flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-cherry" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-[20px] font-semibold text-graphite leading-[1.2] text-balance">
                  {t(titleKey)}
                </h3>
                <p className="text-[15.5px] leading-[1.65] text-gray">
                  {t(textKey)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
