export const PRICE_TABS = ['kosmetologia', 'laser', 'cialo', 'pakiety'] as const

/**
 * Resolve a price-section anchor to the home page's Cennik.
 *
 * In-page hashes like "#pakiety" don't resolve on service pages — the full
 * price list lives only in the home Cennik section. Tab fragments map to the
 * matching tab button id ("#tab-<id>"); any other fragment is kept as-is on the
 * home page; absolute/relative paths and external links pass through unchanged.
 */
export function resolvePriceAnchor(
  link: string | null | undefined,
  homeHref: string,
): string | undefined {
  const raw = (link ?? '').trim()
  if (!raw) return undefined
  if (raw.startsWith('#')) {
    const frag = raw.slice(1)
    const target = (PRICE_TABS as readonly string[]).includes(frag) ? `tab-${frag}` : frag
    return `${homeHref}#${target}`
  }
  return raw
}
