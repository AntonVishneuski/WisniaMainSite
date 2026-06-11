import type { MetadataRoute } from 'next'
import { getServicePageParams, getPostParams } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const staticPaths = ['', '/polityka-prywatnosci', '/uslugi', '/blog']
  let slugs: string[] = []
  try { slugs = await getServicePageParams() } catch { slugs = [] }
  let postSlugs: string[] = []
  try { postSlugs = await getPostParams() } catch { postSlugs = [] }
  const servicePaths = slugs.map((s) => `/uslugi/${s}`)
  const postPaths = postSlugs.map((s) => `/blog/${s}`)
  const paths = [...staticPaths, ...servicePaths, ...postPaths]
  return paths.flatMap((p) => {
    const languages = { pl: `${url}${p}`, ru: `${url}/ru${p}`, 'x-default': `${url}${p}` }
    return [
      { url: `${url}${p}`, alternates: { languages } },
      { url: `${url}/ru${p}`, alternates: { languages } },
    ]
  })
}
