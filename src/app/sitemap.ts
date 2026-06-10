import type { MetadataRoute } from 'next'
import { getServicePageParams } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const staticPaths = ['', '/polityka-prywatnosci', '/uslugi']
  let slugs: string[] = []
  try { slugs = await getServicePageParams() } catch { slugs = [] }
  const servicePaths = slugs.map((s) => `/uslugi/${s}`)
  const paths = [...staticPaths, ...servicePaths]
  return paths.flatMap((p) => {
    const languages = { pl: `${url}${p}`, ru: `${url}/ru${p}`, 'x-default': `${url}${p}` }
    return [
      { url: `${url}${p}`, alternates: { languages } },
      { url: `${url}/ru${p}`, alternates: { languages } },
    ]
  })
}
