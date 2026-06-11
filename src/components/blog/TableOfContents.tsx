import type { Heading } from '@/lib/lexical-headings'

export function TableOfContents({ headings, title }: { headings: Heading[]; title: string }) {
  if (headings.length < 2) return null
  return (
    <nav aria-label={title} className="my-6 p-5 bg-cream border border-[rgba(201,149,108,0.25)] rounded-[var(--radius-md)]">
      <p className="text-[13px] tracking-[0.08em] uppercase text-rose-gold-dk mb-3">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
            <a href={`#${h.id}`} className="text-[14.5px] text-cherry hover:underline underline-offset-2">{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
