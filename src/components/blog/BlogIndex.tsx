'use client'
import { useState } from 'react'
import { PostCard, type PostCardData } from './PostCard'

export type IndexPost = PostCardData & { category: string }

export function BlogIndex({
  posts, categories, allLabel, readMore, localePrefix, filterLabel,
}: {
  posts: IndexPost[]
  categories: { value: string; label: string }[]
  allLabel: string
  readMore: string
  localePrefix: string
  filterLabel: string
}) {
  const [active, setActive] = useState<string>('')
  const present = new Set(posts.map((p) => p.category))
  const chips = [{ value: '', label: allLabel }, ...categories.filter((c) => present.has(c.value))]
  const shown = active ? posts.filter((p) => p.category === active) : posts

  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-[clamp(56px,9vw,112px)]">
      <div className="flex flex-wrap gap-2.5 mb-8" role="group" aria-label={filterLabel}>
        {chips.map((c) => (
          <button
            key={c.value || 'all'}
            onClick={() => setActive(c.value)}
            aria-pressed={active === c.value}
            className={`px-4 py-2 rounded-full text-[13.5px] border transition-colors ${
              active === c.value
                ? 'bg-cherry text-cream border-cherry'
                : 'bg-transparent text-graphite border-[rgba(201,149,108,0.4)] hover:border-cherry hover:text-cherry'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 min-[960px]:grid-cols-3 gap-[26px]">
          {shown.map((p) => <PostCard key={p.slug} post={p} href={`${localePrefix}/blog/${p.slug}`} readMore={readMore} />)}
        </div>
      ) : (
        <p className="text-gray">—</p>
      )}
    </section>
  )
}
