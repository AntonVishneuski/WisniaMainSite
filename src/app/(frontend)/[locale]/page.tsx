import { setRequestLocale, getTranslations } from 'next-intl/server'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  return (
    <main style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <p className="eyebrow">Wiśnia Beauty Studio</p>
      <h1>{t('hero.h1a')} <span className="accent">{t('hero.h1b')}</span></h1>
      <p>{t('hero.sub')}</p>
      <p style={{ marginTop: 24, color: 'var(--color-rose-gold-dk)' }}>locale: {locale}</p>
    </main>
  )
}
