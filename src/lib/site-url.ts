/**
 * Canonical site origin for metadata, canonical/hreflang, sitemap, JSON-LD, RSS.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL — set this per Vercel environment (prod AND staging).
 *   2. Vercel production → the stable production domain.
 *   3. Vercel preview/staging → the per-deployment URL, so canonical/sitemap point
 *      at the staging deploy instead of localhost or the prod domain.
 *   4. Local dev fallback.
 *
 * Server-only usage (routes, sitemap, robots, JSON-LD) — VERCEL_* are not exposed
 * to client bundles.
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')
