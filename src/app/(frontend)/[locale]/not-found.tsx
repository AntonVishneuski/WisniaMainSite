import Link from 'next/link'

export default function NotFound() {
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
        404
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
        Strona nie została znaleziona
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
        Strona, której szukasz, nie istnieje lub została przeniesiona.
        <br />
        <span style={{ fontSize: '13px', opacity: 0.8 }}>
          Страница не найдена или была перемещена.
        </span>
      </p>
      <Link
        href="/"
        style={{
          padding: '0.6rem 1.5rem',
          backgroundColor: '#8B1A2D',
          color: '#FAF7F2',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
      >
        Wróć na stronę główną
      </Link>
    </div>
  )
}
