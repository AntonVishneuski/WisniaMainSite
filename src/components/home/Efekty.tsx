import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

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
              <figure className="rounded-[var(--radius-xl)] overflow-hidden shadow-md bg-cream">
                {/* Before/after pair */}
                <div className="grid grid-cols-2">
                  {/* Before */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {item.beforeImage?.url ? (
                      <Image
                        src={item.beforeImage.url}
                        alt={item.beforeImage.alt ?? t('sections.before')}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[rgba(201,149,108,0.12)]" />
                    )}
                    <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-cherry text-cream text-[11px] font-semibold uppercase tracking-[0.06em] z-10">
                      {t('sections.before')}
                    </span>
                  </div>

                  {/* After */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {item.afterImage?.url ? (
                      <Image
                        src={item.afterImage.url}
                        alt={item.afterImage.alt ?? t('sections.after')}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[rgba(201,149,108,0.08)]" />
                    )}
                    <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#C9956C] text-graphite text-[11px] font-semibold uppercase tracking-[0.06em] z-10">
                      {t('sections.after')}
                    </span>
                  </div>
                </div>

                {/* Caption */}
                {item.caption && (
                  <figcaption className="px-4 py-3 text-[13.5px] text-gray text-center leading-[1.5]">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
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
