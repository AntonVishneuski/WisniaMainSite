import * as Sentry from '@sentry/nextjs'

// Dormant until NEXT_PUBLIC_SENTRY_DSN is set in the environment
// (same pattern as GTM/Meta Pixel: wired but inactive without an ID).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
})
