import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export type PostCardData = {
  slug: string
  title: string
  excerpt?: string | null
  categoryLabel: string
  cover?: { url?: string | null; alt?: string | null } | null
}

export function PostCard({ post, href, readMore }: { post: PostCardData; href: string; readMore: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white border border-[var(--line,rgba(26,26,26,0.10))] rounded-[var(--radius-lg)] shadow-[0_2px_8px_rgba(110,18,44,0.06)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(110,18,44,0.08)]"
    >
      {post.cover?.url && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image src={post.cover.url} alt={post.cover.alt ?? post.title} fill className="object-cover" sizes="(max-width:960px) 100vw, 33vw" />
        </div>
      )}
      <div className="flex flex-col flex-1 p-[26px]">
        <span className="text-[12px] tracking-[0.1em] uppercase text-rose-gold-dk mb-2.5">{post.categoryLabel}</span>
        <h3 className="font-serif text-[23px] leading-[1.2] text-graphite mb-2.5">{post.title}</h3>
        {post.excerpt && <p className="text-[15px] text-gray flex-1">{post.excerpt}</p>}
        <span className="mt-4 inline-flex items-center gap-[7px] text-cherry text-[13px] tracking-[0.08em] uppercase font-medium">
          {readMore}
          <ArrowRight className="w-[14px] h-[14px] transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
