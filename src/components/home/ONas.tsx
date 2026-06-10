import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Reveal } from '@/components/ui/Reveal'

const MEMBERS = [
  {
    nameKey: 'team.m1Name',
    roleKey: 'team.m1Role',
    bioKey: 'team.m1Bio',
    src: '/assets/portrait-olga.jpg',
    altFallback: 'Olga Vishneuskaya',
  },
  {
    nameKey: 'team.m2Name',
    roleKey: 'team.m2Role',
    bioKey: 'team.m2Bio',
    src: '/assets/portrait-katia.jpg',
    altFallback: 'Katia',
  },
]

export function ONas() {
  const t = useTranslations()

  return (
    <section id="o-nas" className="bg-blush w-full py-[clamp(56px,9vw,112px)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <Reveal>
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">{t('team.eyebrow')}</p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance">
              {t('team.title')}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.65] text-gray max-w-[600px] mx-auto">
              {t('team.lead')}
            </p>
          </div>
        </Reveal>

        {/* Team members */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-8 mb-12">
          {MEMBERS.map((member) => (
            <Reveal key={member.nameKey}>
              <div className="flex flex-col items-center text-center bg-cream rounded-[var(--radius-xl)] p-8 shadow-md">
                {/* Portrait — 3:4 */}
                <div className="relative w-[180px] aspect-[3/4] rounded-[var(--radius-lg)] overflow-hidden mb-5 shadow-[0_8px_24px_rgba(110,18,44,0.10)]">
                  <Image
                    src={member.src}
                    alt={t(member.nameKey) as string}
                    fill
                    className="object-cover object-top"
                    sizes="180px"
                  />
                </div>
                <b className="font-serif text-[20px] font-semibold text-graphite leading-[1.2] mb-1">
                  {t(member.nameKey)}
                </b>
                <span className="text-[13.5px] text-cherry font-medium mb-3">
                  {t(member.roleKey)}
                </span>
                <p className="text-[15px] leading-[1.65] text-gray">
                  {t(member.bioKey)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Owner quote */}
        <Reveal>
          <div className="text-center max-w-[640px] mx-auto">
            <blockquote className="font-serif text-[clamp(20px,2.5vw,26px)] font-medium italic text-graphite leading-[1.4] mb-3">
              {t('team.quote')}
            </blockquote>
            <cite className="not-italic text-[14px] text-gray-soft font-medium uppercase tracking-[0.08em]">
              — {t('team.quoteAuthor')}
            </cite>
          </div>
        </Reveal>

      </div>
    </section>
  )
}
