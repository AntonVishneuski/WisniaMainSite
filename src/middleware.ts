import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale } from './lib/i18n'
import { SITE_URL } from './lib/site-url'

const intlMiddleware = createMiddleware({ locales, defaultLocale, localePrefix: 'as-needed' })

let canonicalHost = ''
try {
  canonicalHost = new URL(SITE_URL).host
} catch {
  canonicalHost = ''
}

/**
 * Permanently redirect the production *.vercel.app alias (e.g. wisnia-main-site.vercel.app)
 * to the canonical domain, so the duplicate host stops being crawled and indexed.
 *
 * Preview deployments stay reachable for testing — they run with VERCEL_ENV !== 'production'
 * and use a suffixed alias — and are already kept out of the index by robots.ts.
 */
function redirectVercelAliasToCanonical(req: NextRequest): NextResponse | null {
  const host = (req.headers.get('host') ?? '').toLowerCase()
  if (!host.endsWith('.vercel.app')) return null
  if (!canonicalHost || host === canonicalHost) return null

  const isBareProdAlias = host === 'wisnia-main-site.vercel.app'
  const isProductionEnv = process.env.VERCEL_ENV === 'production'
  if (!isBareProdAlias && !isProductionEnv) return null

  const target = new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, SITE_URL)
  return NextResponse.redirect(target, 308)
}

export default function middleware(req: NextRequest) {
  return redirectVercelAliasToCanonical(req) ?? intlMiddleware(req)
}

export const config = {
  // run on everything except Payload admin/api, Next internals, and files with an extension
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
