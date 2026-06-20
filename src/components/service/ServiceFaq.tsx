export type FaqItem = { question?: string | null; answer?: string | null }

/**
 * FAQ accordion for a service page. Uses native <details>/<summary> so the
 * answers are in the DOM (crawlable for FAQPage rich results) and fully usable
 * without JavaScript. Paired with FAQPage JSON-LD emitted on the page.
 */
export function ServiceFaq({ heading, items }: { heading: string; items: FaqItem[] }) {
  const valid = items.filter((i) => i.question && i.answer)
  if (valid.length === 0) return null
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-[clamp(32px,5vw,56px)]">
      <h2 className="text-2xl font-serif text-graphite mb-5">{heading}</h2>
      <div className="max-w-prose flex flex-col gap-3">
        {valid.map((item, i) => (
          <details
            key={i}
            className="group rounded-[var(--radius-md)] border border-[var(--line-warm)] bg-cream px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[18px] font-semibold text-graphite">
              <span>{item.question}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5 shrink-0 text-cherry transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-3 text-[15.5px] leading-[1.65] text-gray whitespace-pre-line">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
