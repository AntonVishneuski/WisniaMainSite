import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'
import { BeforeAfterCard } from '@/components/shared/BeforeAfterCard'

type BAImage = { url?: string | null; alt?: string | null } | null

type EffectsItem = {
  id: string | number
  caption?: string | null
  beforeImage?: BAImage
  afterImage?: BAImage
}

export function Efekty({ items }: { items: EffectsItem[] }) {
  const t = useTranslations()

  return (
    <section id="efekty" className="w-full py-[clamp(56px,9vw,112px)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <Reveal>
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">{t('sections.effectsEyebrow')}</p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance">
              {t('sections.effectsTitleA')}{' '}
              <span className="italic text-cherry">{t('sections.effectsTitleB')}</span>
            </h2>
          </div>
        </Reveal>

        {/* Before/After grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Reveal key={item.id}>
              <BeforeAfterCard item={item} />
            </Reveal>
          ))}
        </div>

        {/* Disclaimer */}
        <Reveal>
          <p className="mt-8 text-[12.5px] text-gray-soft text-center max-w-[720px] mx-auto leading-[1.6]">
            {t('ba.disclaimer')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
