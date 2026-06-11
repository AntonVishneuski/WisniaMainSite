import { PostCard, type PostCardData } from './PostCard'

export function RelatedPosts({
  posts, heading, readMore, hrefFor,
}: {
  posts: PostCardData[]
  heading: string
  readMore: string
  hrefFor: (slug: string) => string
}) {
  if (!posts.length) return null
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-[clamp(40px,6vw,72px)]">
      <h2 className="font-serif text-2xl text-graphite mb-5">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[960px]:grid-cols-3 gap-5">
        {posts.map((p) => <PostCard key={p.slug} post={p} href={hrefFor(p.slug)} readMore={readMore} />)}
      </div>
    </section>
  )
}
