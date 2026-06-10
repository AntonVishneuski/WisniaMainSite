import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Award, Stethoscope, UserCheck, Star } from 'lucide-react'
import { CtaLink } from '@/components/ui/CtaButtons'

type HeroSettings = {
  whatsapp?: string | null
  phone?: string | null
  booksyUrl?: string | null
}

export function Hero({ settings }: { settings: HeroSettings }) {
  const t = useTranslations()

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}`
    : 'https://wa.me/48453270435'
  const phoneHref = settings.phone ? `tel:${settings.phone}` : 'tel:+48453270435'
  const booksyHref = settings.booksyUrl ?? 'https://wisniabeauty.booksy.com/a'

  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 py-[clamp(56px,9vw,112px)]">
      <div className="grid grid-cols-1 min-[960px]:grid-cols-[1fr_420px] gap-10 min-[960px]:gap-14 items-center">

        {/* Copy column */}
        <div className="flex flex-col gap-6">
          <h1 className="font-serif text-[clamp(38px,5.5vw,72px)] font-semibold text-graphite leading-[1.08] tracking-[-0.01em] text-balance">
            <span>{t('hero.h1a')}</span>{' '}
            <span className="italic text-cherry">{t('hero.h1b')}</span>
          </h1>

          <p className="text-[17px] leading-[1.65] text-gray max-w-[560px]">
            {t('hero.sub')}
          </p>

          {/* CTA cluster */}
          <div className="flex flex-wrap gap-3 mt-2">
            {/* WhatsApp — primary */}
            <CtaLink
              method="whatsapp"
              href={whatsappHref}
              className="inline-flex items-center gap-2 px-7 py-[15px] rounded-full bg-cherry text-cream text-[15.5px] font-medium shadow-[0_2px_8px_rgba(110,18,44,0.06)] transition-all duration-200 hover:bg-cherry-deep hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(110,18,44,0.08)]"
            >
              {/* WhatsApp icon inline */}
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.523 5.836L.057 23.999l6.324-1.452A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.658-.516-5.174-1.41l-.373-.217-3.753.862.906-3.644-.237-.384A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              {t('cta.whatsapp')}
            </CtaLink>

            {/* Phone — outline */}
            <CtaLink
              method="phone"
              href={phoneHref}
              className="inline-flex items-center gap-2 px-7 py-[15px] rounded-full border border-cherry text-cherry bg-transparent text-[15.5px] font-medium transition-all duration-200 hover:bg-cherry hover:text-cream hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px] shrink-0" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13.5 19.79 19.79 0 0 1 1.77 5a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('cta.call')}
            </CtaLink>

            {/* Booksy — ghost */}
            <CtaLink
              method="booksy"
              href={booksyHref}
              className="inline-flex items-center gap-2 px-7 py-[15px] rounded-full text-graphite bg-transparent text-[15.5px] font-medium transition-all duration-200 hover:text-cherry"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px] shrink-0" aria-hidden="true">
                <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Booksy
            </CtaLink>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-1 text-[13.5px] text-gray-soft">
            {/* Google rating */}
            <a
              href="https://www.google.com/maps?q=Wiśnia+Beauty+Studio,+ul.+Gen.+W.+Andersa+15,+Warszawa"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1.5 text-gray transition-colors hover:text-cherry"
            >
              <span className="flex gap-0.5 text-rose-gold" aria-hidden="true">
                {[0,1,2,3,4].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </span>
              <span className="font-medium text-graphite">5,0</span>
              <span>{t('hero.ratingSrc')}</span>
            </a>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-rose-gold shrink-0" aria-hidden="true" />
              {t('hero.trust1')}
            </span>
            <span className="flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-rose-gold shrink-0" aria-hidden="true" />
              {t('hero.trust2')}
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-rose-gold shrink-0" aria-hidden="true" />
              {t('hero.trust3')}
            </span>
          </div>
        </div>

        {/* Media column */}
        <div className="relative w-full max-w-[420px] mx-auto min-[960px]:mx-0">
          <Image
            src="/assets/hero-olga.jpg"
            alt="Olga Vishneuskaya przy pracy"
            width={420}
            height={525}
            priority
            className="w-full h-auto rounded-[var(--radius-xl)] object-cover shadow-[0_24px_60px_rgba(110,18,44,0.12)]"
          />
        </div>
      </div>
    </section>
  )
}
