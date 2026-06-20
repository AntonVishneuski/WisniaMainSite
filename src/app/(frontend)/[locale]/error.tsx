'use client'

import Link from 'next/link'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
        Błąd · Ошибка
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
        Coś poszło nie tak
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
        Przepraszamy za niedogodności. Spróbuj ponownie lub wróć na stronę
        główną.
        <br />
        <span style={{ fontSize: '13px', opacity: 0.8 }}>
          Приносим извинения. Попробуйте снова или вернитесь на главную.
        </span>
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
          Spróbuj ponownie
        </button>
        <Link
          href="/"
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
          Strona główna
        </Link>
      </div>
    </div>
  )
}
