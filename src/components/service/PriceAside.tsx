import { PriceRowList } from '@/components/shared/PriceRowList'
import type { PriceRow } from '@/lib/price-groups'

export function PriceAside({
  heading,
  rows,
  booksyHref,
}: {
  heading?: string | null
  rows: PriceRow[]
  booksyHref: string
}) {
  if (!rows || rows.length === 0) return null

  return (
    <aside className="sticky top-[100px] bg-white border border-[var(--line)] rounded-[var(--radius-lg)] shadow-md p-7">
      {heading && (
        <h2 className="font-serif text-[22px] font-semibold text-graphite mb-5">{heading}</h2>
      )}
      <PriceRowList rows={rows} booksyHref={booksyHref} />
    </aside>
  )
}
