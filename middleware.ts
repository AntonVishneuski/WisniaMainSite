import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './src/lib/i18n'

export default createMiddleware({ locales, defaultLocale, localePrefix: 'as-needed' })

export const config = {
  // run on everything except Payload admin/api, Next internals, and files with an extension
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
