import Image from 'next/image'

type Person = { name?: string | null; jobTitle?: string | null; credentials?: string | null; bio?: string | null; photo?: { url?: string | null; alt?: string | null } | null } | null

export function AuthorBio({
  author, reviewer, reviewedByLabel, lastReviewedLabel,
}: {
  author: Person
  reviewer: Person
  reviewedByLabel: string
  lastReviewedLabel?: string | null
}) {
  if (!author) return null
  return (
    <div className="mt-10 pt-6 border-t border-[rgba(26,26,26,0.08)] flex flex-col gap-4">
      <div className="flex items-start gap-4">
        {author.photo?.url && (
          <Image src={author.photo.url} alt={author.photo.alt ?? author.name ?? ''} width={56} height={56} className="rounded-full object-cover shrink-0" />
        )}
        <div>
          <strong className="font-serif text-[18px] text-graphite block">{author.name}</strong>
          {author.jobTitle && <span className="text-[14px] text-gray-soft">{author.jobTitle}</span>}
          {author.credentials && <p className="text-[13px] text-gray-soft mt-0.5">{author.credentials}</p>}
          {author.bio && <p className="text-[14.5px] text-gray mt-2 leading-[1.6]">{author.bio}</p>}
        </div>
      </div>
      {reviewer?.name && (
        <p className="text-[13.5px] text-gray-soft">
          {reviewedByLabel}: <span className="text-graphite">{reviewer.name}</span>
          {reviewer.jobTitle && <span> · {reviewer.jobTitle}</span>}
          {lastReviewedLabel && <span> · {lastReviewedLabel}</span>}
        </p>
      )}
    </div>
  )
}
