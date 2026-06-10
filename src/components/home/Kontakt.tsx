import { useTranslations } from 'next-intl'
import { MapPin, Phone, Clock } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { CtaLink } from '@/components/ui/CtaButtons'

type KontaktSettings = {
  address?: string | null
  addressNote?: string | null
  phone?: string | null
  whatsapp?: string | null
  instagram?: string | null
  hours?: string | null
  mapEmbedUrl?: string | null
  booksyUrl?: string | null
}

export function Kontakt({ settings }: { settings: KontaktSettings }) {
  const t = useTranslations()

  const phoneHref = settings.phone ? `tel:${settings.phone}` : 'tel:+48453270435'
  const phoneDisplay = settings.phone ?? '+48 453 270 435'
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}`
    : 'https://wa.me/48453270435'
  const instagramHref = settings.instagram
    ? `https://instagram.com/${settings.instagram.replace(/^@/, '')}`
    : 'https://instagram.com/wisnia_beauty_studio'
  const instagramHandle = settings.instagram ?? '@wisnia_beauty_studio'
  const booksyHref = settings.booksyUrl ?? 'https://wisniabeauty.booksy.com/a'

  return (
    <section id="kontakt" className="bg-blush w-full py-[clamp(56px,9vw,112px)]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <Reveal>
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">{t('sections.contactEyebrow')}</p>
            <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-semibold text-graphite leading-[1.12] tracking-[-0.01em] text-balance">
              {t('sections.contactTitle')}
            </h2>
          </div>
        </Reveal>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 min-[960px]:grid-cols-2 gap-10 items-start">

          {/* Contact info */}
          <Reveal>
            <div className="flex flex-col gap-5">

              {/* Address */}
              {settings.address && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shadow-sm shrink-0">
                    <MapPin className="w-4.5 h-4.5 text-cherry" aria-hidden="true" />
                  </div>
                  <div>
                    <b className="block text-[14px] font-semibold text-graphite mb-0.5">
                      {t('contact.addressLabel')}
                    </b>
                    <p className="text-[15px] text-gray leading-[1.5]">
                      {settings.address}
                      {settings.addressNote && (
                        <><br /><span className="text-gray-soft text-[13.5px]">{settings.addressNote}</span></>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {settings.phone && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shadow-sm shrink-0">
                    <Phone className="w-4.5 h-4.5 text-cherry" aria-hidden="true" />
                  </div>
                  <div>
                    <b className="block text-[14px] font-semibold text-graphite mb-0.5">
                      {t('contact.phoneLabel')}
                    </b>
                    <CtaLink
                      method="phone"
                      href={phoneHref}
                      className="text-[15px] text-cherry hover:underline"
                    >
                      {phoneDisplay}
                    </CtaLink>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shadow-sm shrink-0">
                  {/* WhatsApp icon */}
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-cherry" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.523 5.836L.057 23.999l6.324-1.452A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.658-.516-5.174-1.41l-.373-.217-3.753.862.906-3.644-.237-.384A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <div>
                  <b className="block text-[14px] font-semibold text-graphite mb-0.5">WhatsApp</b>
                  <CtaLink
                    method="whatsapp"
                    href={whatsappHref}
                    className="text-[15px] text-cherry hover:underline"
                  >
                    {t('contact.waLink')}
                  </CtaLink>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shadow-sm shrink-0">
                  {/* Instagram icon */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px] text-cherry" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <div>
                  <b className="block text-[14px] font-semibold text-graphite mb-0.5">Instagram</b>
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener"
                    className="text-[15px] text-cherry hover:underline"
                  >
                    {instagramHandle}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shadow-sm shrink-0">
                  <Clock className="w-4.5 h-4.5 text-cherry" aria-hidden="true" />
                </div>
                <div>
                  <b className="block text-[14px] font-semibold text-graphite mb-0.5">
                    {t('contact.hoursLabel')}
                  </b>
                  <p className="text-[15px] text-gray">
                    {settings.hours ?? t('contact.hours')}
                  </p>
                </div>
              </div>

              {/* CTA cluster */}
              <div className="flex flex-wrap gap-3 mt-2">
                <CtaLink
                  method="booksy"
                  href={booksyHref}
                  className="inline-flex items-center gap-2 px-6 py-[13px] rounded-full bg-cherry text-cream text-[14.5px] font-medium shadow-[0_2px_8px_rgba(110,18,44,0.06)] transition-all duration-200 hover:bg-cherry-deep hover:-translate-y-0.5"
                >
                  {t('cta.booksy')}
                </CtaLink>
                <CtaLink
                  method="whatsapp"
                  href={whatsappHref}
                  className="inline-flex items-center gap-2 px-6 py-[13px] rounded-full border border-cherry text-cherry bg-transparent text-[14.5px] font-medium transition-all duration-200 hover:bg-cherry hover:text-cream hover:-translate-y-0.5"
                >
                  WhatsApp
                </CtaLink>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal>
            <div className="rounded-[var(--radius-xl)] overflow-hidden shadow-md aspect-[4/3] min-h-[300px] bg-[rgba(201,149,108,0.08)]">
              {settings.mapEmbedUrl ? (
                <iframe
                  title="Mapa Wiśnia Beauty Studio"
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px', display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-rose-gold opacity-40" aria-hidden="true" />
                </div>
              )}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
