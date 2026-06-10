import { useTranslations } from 'next-intl'
import { Gem, Zap, Flower2, BadgePercent, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

export function Kierunki() {
  const t = useTranslations()

  const cards = [
    { icon: Gem,          titleKey: 'kierunki.faceT',  subtitleKey: 'kierunki.faceS'  },
    { icon: Zap,          titleKey: 'kierunki.laserT', subtitleKey: 'kierunki.laserS' },
    { icon: Flower2,      titleKey: 'kierunki.bodyT',  subtitleKey: 'kierunki.bodyS'  },
    { icon: BadgePercent, titleKey: 'kierunki.pkgT',   subtitleKey: 'kierunki.pkgS'   },
  ] as const

  return (
    <section id="zabiegi" className="w-full py-[clamp(56px,9vw,112px)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <Reveal className="text-center mb-12">
          <p className="eyebrow mb-3">{t('kierunki.eyebrow')}</p>
          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance max-w-[640px] mx-auto">
            {t('kierunki.title')}
          </h2>
          <p className="mt-4 text-[17px] leading-[1.65] text-gray max-w-[600px] mx-auto">
            {t('kierunki.lead')}
          </p>
        </Reveal>

        {/* Cards grid */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 min-[960px]:grid-cols-4 gap-5">
          {cards.map(({ icon: Icon, titleKey, subtitleKey }) => (
            <Reveal key={titleKey}>
              <a
                href="#cennik"
                className="group flex flex-col gap-4 p-7 rounded-[var(--radius-lg)] border border-[rgba(201,149,108,0.25)] bg-cream shadow-[0_2px_8px_rgba(110,18,44,0.06)] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(110,18,44,0.08)] hover:-translate-y-1 hover:border-[rgba(201,149,108,0.5)] h-full"
              >
                {/* Icon */}
                <div className="w-[48px] h-[48px] rounded-full bg-blush flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-cherry" aria-hidden="true" />
                </div>

                {/* Title */}
                <strong className="font-serif text-[19px] font-semibold text-graphite leading-[1.2]">
                  {t(titleKey)}
                </strong>

                {/* Subtitle */}
                <span className="text-[14.5px] leading-[1.55] text-gray-soft flex-1">
                  {t(subtitleKey)}
                </span>

                {/* CTA link */}
                <span className="flex items-center gap-1.5 text-[13.5px] font-medium text-cherry mt-1 transition-gap duration-200">
                  {t('kierunki.go')}
                  <ArrowRight
                    className="w-[14px] h-[14px] transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
