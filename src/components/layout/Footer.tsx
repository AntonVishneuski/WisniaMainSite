import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { SiteSettings } from './types'

type Props = { locale: string; settings: SiteSettings }

export function Footer({ locale, settings }: Props) {
  const t = useTranslations()
  const year = new Date().getFullYear()

  const instagramHandle = settings?.instagram
    ? settings.instagram.replace(/^@/, '')
    : 'wisnia_beauty_studio'
  const instagramHref = `https://instagram.com/${instagramHandle}`
  const waHref = settings?.whatsapp
    ? `https://wa.me/${settings.whatsapp}`
    : 'https://wa.me/48453270435'
  const phoneHref = settings?.phone
    ? `tel:+${settings.phone.replace(/\D/g, '')}`
    : 'tel:+48453270435'
  const privacyHref = locale === 'ru' ? '/ru/polityka-prywatnosci' : '/polityka-prywatnosci'

  const navLinks = [
    { href: '#cennik', label: t('nav.prices') },
    { href: '#efekty', label: t('nav.effects') },
    { href: '#o-nas', label: t('nav.about') },
    { href: '#kontakt', label: t('nav.contact') },
  ]

  return (
    <footer className="bg-blush text-gray pt-[72px] pb-8 border-t border-[rgba(201,149,108,0.35)]">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        {/* Footer grid: brand | nav | contact */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 min-[960px]:grid-cols-[1.5fr_1fr_1.1fr]">
          {/* Brand column */}
          <div>
            <div className="mb-5">
              <img
                src="/assets/logo-wisnia.png"
                alt="Wiśnia Beauty Studio"
                className="h-[58px] w-auto"
              />
            </div>
            <p className="text-[15px] max-w-[300px] text-gray leading-relaxed">
              {t('footer.tagline')}
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-2">
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="w-11 h-11 rounded-full border border-[rgba(201,149,108,0.35)] text-cherry bg-[rgba(255,255,255,0.5)] flex items-center justify-center transition-all duration-200 hover:bg-cherry hover:text-cream hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
                className="w-11 h-11 rounded-full border border-[rgba(201,149,108,0.35)] text-cherry bg-[rgba(255,255,255,0.5)] flex items-center justify-center transition-all duration-200 hover:bg-cherry hover:text-cream hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
              <a
                href={phoneHref}
                aria-label="Telefon"
                className="w-11 h-11 rounded-full border border-[rgba(201,149,108,0.35)] text-cherry bg-[rgba(255,255,255,0.5)] flex items-center justify-center transition-all duration-200 hover:bg-cherry hover:text-cream hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.95a16 16 0 0 0 6.06 6.06l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className="font-serif text-[21px] text-graphite mb-[14px]">
              {t('footer.nav')}
            </h4>
            <div className="flex flex-col">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="block py-[6px] text-[15px] text-gray transition-colors duration-200 hover:text-cherry"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-serif text-[21px] text-graphite mb-[14px]">Kontakt</h4>
            <div className="flex flex-col">
              {settings?.phone && (
                <a
                  href={phoneHref}
                  className="block py-[6px] text-[15px] text-gray transition-colors duration-200 hover:text-cherry"
                >
                  {settings.phone}
                </a>
              )}
              {settings?.whatsapp && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener"
                  className="block py-[6px] text-[15px] text-gray transition-colors duration-200 hover:text-cherry"
                >
                  WhatsApp
                </a>
              )}
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener"
                className="block py-[6px] text-[15px] text-gray transition-colors duration-200 hover:text-cherry"
              >
                @{instagramHandle}
              </a>
              {settings?.address && (
                <p className="text-[15px] py-[6px] text-gray">
                  {settings.address}
                  {settings.addressNote && (
                    <>
                      <br />
                      <span className="text-[13px] text-gray-soft">{settings.addressNote}</span>
                    </>
                  )}
                </p>
              )}
              {settings?.hours && (
                <p className="text-[15px] py-[6px] text-gray">{settings.hours}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="mt-12 pt-6 border-t border-[rgba(26,26,26,0.10)] flex flex-wrap gap-3 justify-between text-[13.5px] text-gray-soft">
          <span>© {year} Wiśnia Beauty Studio</span>
          <Link
            href={privacyHref}
            className="text-gray-soft transition-colors duration-200 hover:text-cherry"
          >
            {t('footer.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
