import Link from 'next/link'

export type CrossLinkItem = {
  slug: string
  title: string
}

export function CrossLinks({
  links,
  locale,
  heading,
}: {
  links: CrossLinkItem[]
  locale: string
  heading?: string
}) {
  if (!links || links.length === 0) return null

  const prefix = locale === 'ru' ? '/ru/uslugi/' : '/uslugi/'

  return (
    <div className="mt-5">
      {heading && (
        <span className="text-[14px] text-gray-soft mr-2 self-center">{heading}</span>
      )}
      <div className="flex flex-wrap gap-2.5">
        {links.map((item) => (
          <Link
            key={item.slug}
            href={`${prefix}${item.slug}`}
            className="text-[14px] text-cherry bg-blush px-[15px] py-2 rounded-full border border-[var(--line-warm)] hover:bg-white transition-colors"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
