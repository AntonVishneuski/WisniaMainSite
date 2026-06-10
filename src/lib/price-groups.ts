export type PriceRow = {
  id: string
  tab: 'kosmetologia' | 'laser' | 'cialo' | 'pakiety'
  category?: string | null
  categorySubtitle?: string | null
  name: string
  subline?: string | null
  price?: string | null
  priceWas?: string | null
  isPackage?: boolean | null
  isGift?: boolean | null
  note?: unknown
  bookingUrl?: string | null
  order?: number | null
}
export type CategoryGroup = { category?: string | null; categorySubtitle?: string | null; rows: PriceRow[] }
export type GroupedPrices = Record<PriceRow['tab'], CategoryGroup[]>

const TABS: PriceRow['tab'][] = ['kosmetologia', 'laser', 'cialo', 'pakiety']

export function groupPrices(rows: PriceRow[]): GroupedPrices {
  const sorted = [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const out = Object.fromEntries(TABS.map((t) => [t, []])) as unknown as GroupedPrices
  for (const row of sorted) {
    const groups = out[row.tab]
    const key = row.category ?? ''
    let group = groups.find((g) => (g.category ?? '') === key)
    if (!group) { group = { category: row.category, categorySubtitle: row.categorySubtitle, rows: [] }; groups.push(group) }
    group.rows.push(row)
  }
  return out
}
