export type PackagePromoData = {
  enabled?: boolean | null
  badge?: string | null
  title?: string | null
  desc?: string | null
  nowPrice?: string | null
  wasPrice?: string | null
  /** href for the promo link button */
  link?: string | null
}

export function PackagePromo({
  promo,
  ctaLabel,
}: {
  promo?: PackagePromoData | null
  ctaLabel?: string
}) {
  if (!promo?.enabled) return null

  const raw = (promo.link ?? '').trim()
  const safeHref = /^(#|\/|https?:|tel:|mailto:)/i.test(raw) ? raw : '#'

  return (
    <div className="mt-[18px] p-4 border border-[var(--line-warm)] rounded-[var(--radius-md)] bg-gradient-to-br from-[rgba(201,149,108,0.14)] to-[rgba(201,149,108,0.04)]">
      {promo.badge && (
        <span className="inline-block text-[11px] font-semibold tracking-[0.04em] bg-cherry text-cream px-[9px] py-[3px] rounded-full mb-2.5">
          {promo.badge}
        </span>
      )}
      {promo.title && (
        <b className="block font-serif text-[19px] font-semibold text-graphite mb-1.5 leading-[1.2]">
          {promo.title}
        </b>
      )}
      {(promo.nowPrice || promo.wasPrice) && (
        <div className="flex items-baseline gap-2.5 mb-1.5">
          {promo.nowPrice && (
            <span className="font-serif text-[22px] font-semibold text-cherry">
              {promo.nowPrice}
            </span>
          )}
          {promo.wasPrice && (
            <span className="text-[14px] text-gray-soft line-through">{promo.wasPrice}</span>
          )}
        </div>
      )}
      {promo.desc && (
        <p className="text-[13.5px] text-gray m-0">{promo.desc}</p>
      )}
      {promo.link && (
        <a
          href={safeHref}
          className="inline-block mt-[9px] text-[13px] text-cherry border-b border-[var(--line-warm)] hover:border-cherry transition-colors"
        >
          {ctaLabel ?? raw}
        </a>
      )}
    </div>
  )
}
