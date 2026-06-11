import { CtaLink } from '@/components/ui/CtaButtons'

export function PostCta({
  title, buttonLabel, serviceHref, booksyHref,
}: {
  title: string
  buttonLabel: string
  serviceHref?: string | null
  booksyHref: string
}) {
  return (
    <div className="mt-16 p-7 bg-blush rounded-[var(--radius-lg)] text-center">
      <h3 className="font-serif text-[26px] text-graphite mb-4">{title}</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {serviceHref && (
          <a href={serviceHref} className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-cherry text-cherry text-[14px] font-medium transition-colors hover:bg-cherry hover:text-cream">
            {buttonLabel}
          </a>
        )}
        <CtaLink method="booksy" href={booksyHref} className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-cherry text-cream text-[14px] font-medium transition-colors hover:bg-cherry-deep">
          Booksy
        </CtaLink>
      </div>
    </div>
  )
}
