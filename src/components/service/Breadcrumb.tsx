import Link from 'next/link'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap gap-2 items-center text-[13px] text-gray-soft mb-5"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <span className="text-gray-soft" aria-hidden="true">
              ›
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-cherry hover:text-cherry-deep underline-offset-2 hover:underline transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-soft" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
