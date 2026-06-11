import { getPublishedPosts } from '@/lib/queries'
import { SITE_URL } from "@/lib/site-url"

const SITE = SITE_URL
export const revalidate = 3600

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function buildFeed(locale: 'pl' | 'ru') {
  const base = locale === 'ru' ? `${SITE}/ru` : SITE
  const posts = await getPublishedPosts(locale).catch(() => [] as any[])
  const items = (posts as any[]).map((p) => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(`${base}/blog/${p.slug}`)}</link>
      <guid>${esc(`${base}/blog/${p.slug}`)}</guid>
      ${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}
      ${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ''}
    </item>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Wiśnia Beauty Studio — Blog</title>
  <link>${base}/blog</link>
  <description>${esc(locale === 'ru' ? 'Экспертные статьи' : 'Eksperckie artykuły')}</description>
  <language>${locale}</language>${items}
</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}

export function GET() {
  return buildFeed('pl')
}
