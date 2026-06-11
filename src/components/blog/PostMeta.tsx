import Image from 'next/image'

export function PostMeta({
  dateLabel, minutes, readingTimeLabel, authorName, authorJobTitle, authorPhoto,
}: {
  dateLabel?: string | null
  minutes: number
  readingTimeLabel: string
  authorName?: string | null
  authorJobTitle?: string | null
  authorPhoto?: { url?: string | null; alt?: string | null } | null
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-gray-soft mb-8">
      {authorName && (
        <span className="flex items-center gap-2">
          {authorPhoto?.url && (
            <Image src={authorPhoto.url} alt={authorPhoto.alt ?? authorName} width={32} height={32} className="rounded-full object-cover" />
          )}
          <span className="text-graphite font-medium">{authorName}</span>
          {authorJobTitle && <span>· {authorJobTitle}</span>}
        </span>
      )}
      {dateLabel && <span>{dateLabel}</span>}
      <span>{readingTimeLabel.replace('{min}', String(minutes))}</span>
    </div>
  )
}
