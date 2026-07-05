import * as Sentry from '@sentry/nextjs'

// Dormant until NEXT_PUBLIC_SENTRY_DSN is set (same pattern as GTM/Meta Pixel).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
