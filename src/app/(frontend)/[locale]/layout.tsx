import '../styles.css'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '../../../lib/i18n'
import { getPayloadClient } from '../../../lib/getPayload'
import { Gtm, GtmNoScript } from '../../../components/analytics/Gtm'
import { MetaPixel } from '../../../components/analytics/MetaPixel'
import { ConsentInit } from '../../../components/analytics/ConsentInit'
import { ConsentBanner } from '../../../components/analytics/ConsentBanner'
import { UtmCapture } from '../../../components/analytics/UtmCapture'
import { ScrollDepth } from '../../../components/analytics/ScrollDepth'
import { SpeedInsights } from '@vercel/speed-insights/next'

const cormorant = Cormorant_Garamond({ subsets: ['latin', 'latin-ext'], weight: ['600'], variable: '--font-cormorant', display: 'swap' })
const jost = Jost({ subsets: ['latin', 'latin-ext'], variable: '--font-jost', display: 'swap' })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'settings' }).catch(() => null)
  return (
    <html lang={locale} className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        {settings?.searchConsoleToken ? (
          <meta name="google-site-verification" content={settings.searchConsoleToken} />
        ) : null}
        {/* Reveal-on-scroll blocks start at opacity:0 and are un-hidden by JS. With JS
            disabled the IntersectionObserver never runs, so force them visible. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <ConsentInit />
        <Gtm gtmId={settings?.gtmId} />
        <GtmNoScript gtmId={settings?.gtmId} />
        <MetaPixel pixelId={settings?.metaPixelId} />
        <SpeedInsights />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <UtmCapture />
          <ScrollDepth />
          {children}
          <ConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
