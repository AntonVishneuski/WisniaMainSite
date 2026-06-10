import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

const STEPS = [
  { num: '01', titleKey: 'how.s1t', textKey: 'how.s1p' },
  { num: '02', titleKey: 'how.s2t', textKey: 'how.s2p' },
  { num: '03', titleKey: 'how.s3t', textKey: 'how.s3p' },
]

export function JakToDziala() {
  const t = useTranslations()

  return (
    <section className="w-full py-[clamp(56px,9vw,112px)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <Reveal>
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">{t('how.eyebrow')}</p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance">
              {t('how.title')}
            </h2>
          </div>
        </Reveal>

        {/* Steps */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-3 gap-8 mb-10">
          {STEPS.map((step) => (
            <Reveal key={step.num}>
              <div className="flex flex-col items-start gap-4">
                <div className="font-serif text-[clamp(36px,5vw,56px)] font-semibold text-rose-gold leading-none">
                  {step.num}
                </div>
                <h3 className="font-serif text-[20px] font-semibold text-graphite leading-[1.2]">
                  {t(step.titleKey)}
                </h3>
                <p className="text-[15.5px] leading-[1.65] text-gray">
                  {t(step.textKey)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Low-risk highlight bar */}
        <Reveal>
          <div className="rounded-[var(--radius-xl)] bg-blush border border-[rgba(201,149,108,0.3)] px-8 py-5 text-[15.5px] leading-[1.65] text-graphite text-center shadow-sm">
            {t('how.highlight')}
          </div>
        </Reveal>

      </div>
    </section>
  )
}
