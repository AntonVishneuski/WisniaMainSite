'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LangToggle } from './LangToggle'
import { CtaLink } from '@/components/ui/CtaButtons'
import type { SiteSettings } from './types'
import { contactLinks } from '@/lib/contact-links'
import { homePath, localePath, sectionHref } from '@/lib/section-links'

type ServiceItem = { slug: string; title: string }
type Props = { locale: string; settings: SiteSettings; services?: ServiceItem[]; isHome?: boolean }

export function Header({ locale, settings, services = [], isHome = false }: Props) {
  const t = useTranslations()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  const { booksyHref, waHref } = contactLinks(settings)
  const homeHref = homePath(locale)
  const serviceBase = localePath(locale, '/uslugi')
  const blogHref = localePath(locale, '/blog')

  const burgerRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null)

  // Move focus into / restore focus from drawer
  useEffect(() => {
    if (drawerOpen) {
      closeButtonRef.current?.focus()
    } else {
      burgerRef.current?.focus()
    }
  }, [drawerOpen])

  // Close the mobile drawer if the viewport grows to the desktop breakpoint
  // (otherwise the full-screen overlay stays stuck open on resize).
  useEffect(() => {
    if (!drawerOpen) return
    function onResize() {
      if (window.innerWidth >= 960) setDrawerOpen(false)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [drawerOpen])

  // Focus trap within drawer while open
  function handleDrawerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return
    const drawer = drawerRef.current
    if (!drawer) return
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

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

  // Close services dropdown on Escape or click outside
  useEffect(() => {
    if (!servicesOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setServicesOpen(false)
        dropdownTriggerRef.current?.focus()
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [servicesOpen])

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

  // Off the home page these sections don't exist, so a bare "#cennik" anchor is
  // a dead link — sectionHref points it back at the home page section instead.
  const navLinks = [
    { hash: '#cennik', label: t('nav.prices') },
    { hash: '#efekty', label: t('nav.effects') },
    { hash: '#o-nas', label: t('nav.about') },
    { hash: '#kontakt', label: t('nav.contact') },
  ].map(({ hash, label }) => ({ href: sectionHref(hash, locale, isHome), label }))

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
            aria-label={t('a11y.mainNav')}
            className="hidden min-[960px]:flex items-center gap-[30px]"
          >
            {/* Usługi dropdown — only shown when services are available */}
            {services.length > 0 && (
              <div ref={dropdownRef} className="relative">
                <button
                  ref={dropdownTriggerRef}
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls="services-dropdown"
                  onClick={() => setServicesOpen((v) => !v)}
                  className="relative flex items-center gap-1 text-[15px] text-graphite py-1 transition-colors duration-200 hover:text-cherry
                    after:absolute after:left-0 after:bottom-[-2px] after:h-[1.5px] after:w-0 after:bg-cherry
                    after:transition-[width] after:duration-[250ms] hover:after:w-full border-0 bg-transparent cursor-pointer"
                >
                  {t('nav.uslugi')}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={[
                      'w-[14px] h-[14px] transition-transform duration-200',
                      servicesOpen ? 'rotate-180' : '',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {servicesOpen && (
                  <nav
                    id="services-dropdown"
                    aria-label={t('nav.uslugi')}
                    className="absolute left-0 top-[calc(100%+10px)] min-w-[200px] bg-[rgba(253,250,247,0.98)] backdrop-blur-[14px] border border-[rgba(201,149,108,0.35)] rounded-[12px] shadow-[0_8px_24px_rgba(110,18,44,0.10)] py-2 z-[110]"
                  >
                    <ul className="list-none m-0 p-0">
                      {services.map((svc) => (
                        <li key={svc.slug}>
                          <Link
                            href={`${serviceBase}/${svc.slug}`}
                            onClick={() => setServicesOpen(false)}
                            className="block px-4 py-[8px] text-[14.5px] text-graphite transition-colors duration-200 hover:text-cherry hover:bg-[rgba(201,149,108,0.08)]"
                          >
                            {svc.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            )}

            <Link
              href={blogHref}
              className="relative text-[15px] text-graphite py-1 transition-colors duration-200 hover:text-cherry
                after:absolute after:left-0 after:bottom-[-2px] after:h-[1.5px] after:w-0 after:bg-cherry
                after:transition-[width] after:duration-[250ms] hover:after:w-full"
            >
              {t('nav.blog')}
            </Link>

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
              ref={burgerRef}
              type="button"
              className="min-[960px]:hidden border-0 bg-transparent text-graphite p-1.5 rounded-[8px]"
              aria-label={t('a11y.menu')}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
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
        ref={drawerRef}
        id="mobile-drawer"
        className={[
          'fixed inset-0 z-[200] bg-cream flex flex-col p-6',
          'transition-transform duration-[350ms] cubic-bezier-[.4,0,.2,1]',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        style={{ transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)' }}
        aria-modal="true"
        role="dialog"
        aria-label={t('a11y.navMenu')}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen ? true : undefined}
        onKeyDown={drawerOpen ? handleDrawerKeyDown : undefined}
      >
        {/* Drawer top */}
        <div className="flex items-center justify-between mb-8">
          <img
            src="/assets/logo-wisnia.png"
            alt="Wiśnia Beauty Studio"
            className="h-[38px]"
          />
          <button
            ref={closeButtonRef}
            type="button"
            className="border-0 bg-transparent text-graphite"
            aria-label={t('a11y.close')}
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
        <nav className="flex flex-col gap-1 overflow-y-auto">
          {/* Usługi sub-section in mobile drawer */}
          {services.length > 0 && (
            <div>
              <span className="font-serif text-[30px] text-graphite py-2.5 border-b border-[rgba(26,26,26,0.10)] block">
                {t('nav.uslugi')}
              </span>
              <div className="flex flex-col pl-4 mb-1">
                {services.map((svc) => (
                  <Link
                    key={svc.slug}
                    href={`${serviceBase}/${svc.slug}`}
                    onClick={() => setDrawerOpen(false)}
                    className="text-[20px] text-graphite py-2 border-b border-[rgba(26,26,26,0.05)] transition-colors duration-200 hover:text-cherry"
                  >
                    {svc.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            href={blogHref}
            onClick={() => setDrawerOpen(false)}
            className="font-serif text-[30px] text-graphite py-2.5 border-b border-[rgba(26,26,26,0.10)]"
          >
            {t('nav.blog')}
          </Link>

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
