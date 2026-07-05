'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'
import { useLocale, useTranslations } from 'next-intl'
import { homePath } from '@/lib/section-links'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')
  const locale = useLocale()
  const homeHref = homePath(locale)

  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF7F2',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'var(--font-jost, system-ui, sans-serif)',
      }}
    >
      <p
        style={{
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#8B1A2D',
          marginBottom: '1rem',
        }}
      >
        {t('tag')}
      </p>
      <h1
        style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontFamily: 'var(--font-cormorant, Georgia, serif)',
          fontWeight: 600,
          color: '#2B2118',
          marginBottom: '0.75rem',
          lineHeight: 1.15,
        }}
      >
        {t('title')}
      </h1>
      <p
        style={{
          fontSize: '15px',
          color: '#6B5B4E',
          marginBottom: '2rem',
          maxWidth: '420px',
          lineHeight: 1.6,
        }}
      >
        {t('description')}
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.6rem 1.5rem',
            backgroundColor: '#8B1A2D',
            color: '#FAF7F2',
            border: 'none',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          {t('retry')}
        </button>
        <Link
          href={homeHref}
          style={{
            padding: '0.6rem 1.5rem',
            backgroundColor: 'transparent',
            color: '#8B1A2D',
            border: '1.5px solid #8B1A2D',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          {t('home')}
        </Link>
      </div>
    </div>
  )
}
