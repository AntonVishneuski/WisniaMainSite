import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const isDev = process.env.NODE_ENV === 'development'

// Inventory of external resources (keep in sync when adding third-party embeds):
// - GTM: inline bootstrap + www.googletagmanager.com (script, noscript iframe); GA4 hits
//   go to *.google-analytics.com and stats.g.doubleclick.net
// - Meta Pixel: inline bootstrap + connect.facebook.net script, hits to www.facebook.com
// - Google Maps: <iframe> in Kontakt, safeMapSrc allows https://*.google.com
// - Media (images + hero video): Vercel Blob *.public.blob.vercel-storage.com
// - Sentry: error reports go to https://<key>.ingest.<region>.sentry.io (connect-src)
// - Fonts are self-hosted via next/font; Booksy/Instagram/WhatsApp are plain links
const csp = [
  "default-src 'self'",
  // 'unsafe-inline' is required by the inline GTM/Pixel/consent bootstraps and Next's
  // hydration scripts (no nonce plumbing); 'unsafe-eval' only for dev HMR
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.googletagmanager.com https://*.google-analytics.com https://stats.g.doubleclick.net https://www.facebook.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws:' : ''} https://*.public.blob.vercel-storage.com https://www.googletagmanager.com https://*.google-analytics.com https://stats.g.doubleclick.net https://www.facebook.com https://connect.facebook.net https://*.sentry.io`,
  "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
  "frame-src https://google.com https://*.google.com https://www.googletagmanager.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/assets/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
