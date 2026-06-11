import { buildFeed } from '@/app/(frontend)/blog/rss.xml/route'

export const revalidate = 3600

export function GET() {
  return buildFeed('ru')
}
