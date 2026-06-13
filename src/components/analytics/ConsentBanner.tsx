'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)
  const t = useTranslations('consent')
  const locale = useLocale()

  const privacyHref = locale === 'ru' ? '/ru/polityka-prywatnosci' : '/polityka-prywatnosci'

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wisnia-consent')
      if (!stored) setVisible(true)
    } catch {
      // localStorage unavailable — don't show banner
    }
  }, [])

  function accept() {
    try { localStorage.setItem('wisnia-consent', 'granted') } catch {}
    type WinWithTrackers = typeof window & {
      gtag?: (...args: unknown[]) => void
      fbq?: (...args: unknown[]) => void
    }
    const w = window as unknown as WinWithTrackers
    if (typeof window !== 'undefined' && typeof w.gtag === 'function') {
      w.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      })
    }
    if (typeof w.fbq === 'function') w.fbq('consent', 'grant')
    setVisible(false)
  }

  function reject() {
    try { localStorage.setItem('wisnia-consent', 'denied') } catch {}
    const w = window as unknown as { fbq?: (...args: unknown[]) => void }
    if (typeof w.fbq === 'function') w.fbq('consent', 'revoke')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label={t('text')}
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-cream)] border-t border-[var(--color-blush)] shadow-lg px-4 py-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-[var(--color-espresso)] flex-1">
          {t('text')}{' '}
          <Link href={privacyHref} className="underline hover:text-[var(--color-cherry)]">
            {t('privacy')}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-medium rounded bg-[var(--color-cherry)] text-[var(--color-cream)] hover:opacity-90 transition-opacity"
          >
            {t('accept')}
          </button>
          <button
            onClick={reject}
            className="px-4 py-2 text-sm font-medium rounded border border-[var(--color-cherry)] text-[var(--color-cherry)] hover:bg-[var(--color-blush)] transition-colors"
          >
            {t('reject')}
          </button>
        </div>
      </div>
    </div>
  )
}
