import Image from 'next/image'
import { useTranslations } from 'next-intl'

export type BeforeAfterItem = {
  beforeImage?: { url?: string | null; alt?: string | null } | null
  afterImage?: { url?: string | null; alt?: string | null } | null
  caption?: string | null
}

/**
 * Renders ONE before/after card (PRZED/PO tags, images with placeholders, caption).
 *
 * Uses next-intl `sections.before` / `sections.after` for the PRZED/PO badge labels.
 * Used by Efekty (homepage) and service pages.
 */
export function BeforeAfterCard({ item }: { item: BeforeAfterItem }) {
  const t = useTranslations()

  return (
    <figure className="rounded-[var(--radius-xl)] overflow-hidden shadow-md bg-cream">
      {/* Before/after pair */}
      <div className="grid grid-cols-2">
        {/* Before */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {item.beforeImage?.url ? (
            <Image
              src={item.beforeImage.url}
              alt={item.beforeImage.alt ?? t('sections.before')}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[rgba(201,149,108,0.12)]" />
          )}
          <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-cherry text-cream text-[11px] font-semibold uppercase tracking-[0.06em] z-10">
            {t('sections.before')}
          </span>
        </div>

        {/* After */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {item.afterImage?.url ? (
            <Image
              src={item.afterImage.url}
              alt={item.afterImage.alt ?? t('sections.after')}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[rgba(201,149,108,0.08)]" />
          )}
          <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-cherry text-cream text-[11px] font-semibold uppercase tracking-[0.06em] z-10">
            {t('sections.after')}
          </span>
        </div>
      </div>

      {/* Caption */}
      {item.caption && (
        <figcaption className="px-4 py-3 text-[13.5px] text-gray text-center leading-[1.5]">
          {item.caption}
        </figcaption>
      )}
    </figure>
  )
}
