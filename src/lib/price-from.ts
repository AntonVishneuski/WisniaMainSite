// Derives the "from" price shown in a service hero out of the page's linked
// price rows. Price strings are free-form localized text — "550 zł",
// "od 650 zł" / "от 650 zł", "220-260 zł", "1 200 zł" — so we normalize and
// pick the smallest real PLN amount. Rows without "zł" (e.g. the "-15%" package
// badge) are skipped.

export function parseMinPrice(prices: (string | null | undefined)[]): number | null {
  let min: number | null = null
  for (const raw of prices) {
    if (!raw || !raw.includes('zł')) continue
    // Join thousands separators ("1 200" / "1 200" → "1200") before extracting digits.
    const normalized = raw.replace(/(\d)[\s ](?=\d)/g, '$1')
    const nums = normalized.match(/\d+/g)
    if (!nums) continue
    for (const n of nums) {
      const val = parseInt(n, 10)
      if (val > 0 && (min === null || val < min)) min = val
    }
  }
  return min
}

export function formatPriceFrom(min: number, locale: string): string {
  const prefix = locale === 'ru' ? 'от' : 'od'
  return `${prefix} ${min} zł`
}
