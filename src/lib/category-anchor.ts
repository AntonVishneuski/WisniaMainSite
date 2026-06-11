/**
 * Stable anchor slug for a price category, used to deep-link a service page's
 * "full price list" CTA to the exact category section in the home Cennik
 * (e.g. men's vs women's laser depilation), not just the broad tab.
 *
 * The service page and the Cennik always render on the same locale, so slugging
 * the localized category string on both sides yields a matching id. Keeps Latin
 * (incl. ł/ż/ę) and Cyrillic letters — HTML5 ids allow Unicode — lowercased,
 * with runs of other characters collapsed to a single dash.
 */
export const CATEGORY_ANCHOR_PREFIX = 'cat-'

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '')
}

export function categoryAnchor(category: string): string {
  return `${CATEGORY_ANCHOR_PREFIX}${categorySlug(category)}`
}
