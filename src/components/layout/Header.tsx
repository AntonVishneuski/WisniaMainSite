'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LangToggle } from './LangToggle'
import { CtaLink } from '@/components/ui/CtaButtons'
import type { SiteSettings } from './types'
import { contactLinks } from '@/lib/contact-links'

type Props = { locale: string; settings: SiteSettings }

export function Header({ locale, settings }: Props) {
  const t = useTranslations()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { booksyHref, waHref } = contactLinks(settings)
  const homeHref = locale === 'ru' ? '/ru' : '/'

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on Escape
  useEffect(() => {
    if (!drawerOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const navLinks = [
    { href: '#cennik', label: t('nav.prices') },
    { href: '#efekty', label: t('nav.effects') },
    { href: '#o-nas', label: t('nav.about') },
    { href: '#kontakt', label: t('nav.contact') },
  ]

  return (
    <>
      {/* Header */}
      <header
        className={[
          'sticky top-0 z-[100] h-[var(--header-h,78px)]',
          'bg-[rgba(253,250,247,0.82)] backdrop-blur-[14px]',
          'border-b transition-all duration-300',
          scrolled
            ? 'border-[rgba(201,149,108,0.35)] shadow-[0_2px_8px_rgba(110,18,44,0.06)]'
            : 'border-transparent',
        ].join(' ')}
      >
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between h-full gap-6">
          {/* Logo */}
          <Link href={homeHref} aria-label="Wiśnia Beauty Studio" className="flex-none">
            <img
              src="/assets/logo-wisnia.png"
              alt="Wiśnia Beauty Studio"
              className="h-[42px] w-auto max-sm:h-[36px]"
            />
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Główna nawigacja"
            className="hidden min-[960px]:flex items-center gap-[30px]"
          >
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="relative text-[15px] text-graphite py-1 transition-colors duration-200 hover:text-cherry
                  after:absolute after:left-0 after:bottom-[-2px] after:h-[1.5px] after:w-0 after:bg-cherry
                  after:transition-[width] after:duration-[250ms] hover:after:w-full"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="flex items-center gap-[14px]">
            {/* Lang toggle — hidden on mobile per design */}
            <div className="hidden min-[960px]:flex items-center border border-[rgba(201,149,108,0.35)] rounded-full overflow-hidden bg-[rgba(255,255,255,0.5)]">
              <LangToggle locale={locale} />
            </div>

            {/* Booksy CTA — hidden on mobile per design */}
            <CtaLink
              method="booksy"
              href={booksyHref}
              className="hidden min-[960px]:inline-flex items-center justify-center gap-2 px-[26px] py-[14px] rounded-full bg-cherry text-cream text-[15.5px] font-medium border border-transparent shadow-[0_2px_8px_rgba(110,18,44,0.06)] transition-all duration-200 hover:bg-cherry-deep hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(110,18,44,0.08)]"
            >
              {t('cta.booksy')}
            </CtaLink>

            {/* Burger — visible on mobile */}
            <button
              type="button"
              className="min-[960px]:hidden border-0 bg-transparent text-graphite p-1.5 rounded-[8px]"
              aria-label="Menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-[26px] h-[26px]"
              >
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[150] bg-black/20"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={[
          'fixed inset-0 z-[200] bg-cream flex flex-col p-6',
          'transition-transform duration-[350ms] cubic-bezier-[.4,0,.2,1]',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        style={{ transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)' }}
        aria-modal="true"
        role="dialog"
        aria-label="Menu nawigacyjne"
      >
        {/* Drawer top */}
        <div className="flex items-center justify-between mb-8">
          <img
            src="/assets/logo-wisnia.png"
            alt="Wiśnia Beauty Studio"
            className="h-[38px]"
          />
          <button
            type="button"
            className="border-0 bg-transparent text-graphite"
            aria-label="Zamknij"
            onClick={() => setDrawerOpen(false)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-[28px] h-[28px]"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className="font-serif text-[30px] text-graphite py-2.5 border-b border-[rgba(26,26,26,0.10)]"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Lang toggle in drawer */}
        <div className="mt-6 flex items-center border border-[rgba(201,149,108,0.35)] rounded-full overflow-hidden bg-[rgba(255,255,255,0.5)] w-fit">
          <LangToggle locale={locale} />
        </div>

        {/* Drawer CTAs */}
        <div className="mt-auto flex flex-col gap-3">
          <CtaLink
            method="whatsapp"
            href={waHref}
            className="flex items-center justify-center gap-2 w-full py-[14px] px-[26px] rounded-full border border-cherry text-cherry bg-transparent text-[15.5px] font-medium transition-all duration-200 hover:bg-cherry hover:text-cream"
          >
            {t('cta.whatsapp')}
          </CtaLink>
          <CtaLink
            method="booksy"
            href={booksyHref}
            className="flex items-center justify-center gap-2 w-full py-[14px] px-[26px] rounded-full bg-cherry text-cream text-[15.5px] font-medium shadow-[0_2px_8px_rgba(110,18,44,0.06)] transition-all duration-200 hover:bg-cherry-deep"
          >
            {t('cta.booksy')}
          </CtaLink>
        </div>
      </div>
    </>
  )
}
