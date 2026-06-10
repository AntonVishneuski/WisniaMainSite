export type ServiceLinkRef = { id: string | number; slug: string; title: string }

export function resolveCrossLinks(
  page: { id: string | number; crossLinks?: Array<ServiceLinkRef | string | number> | null },
  allPublished: ServiceLinkRef[],
  max = 3,
): ServiceLinkRef[] {
  const byId = new Map(allPublished.map((p) => [String(p.id), p]))
  const explicit = (page.crossLinks ?? [])
    .map((c) => byId.get(String(typeof c === 'object' ? c.id : c)))
    .filter((p): p is ServiceLinkRef => !!p && String(p.id) !== String(page.id))
  if (explicit.length) return explicit.slice(0, max)
  return allPublished.filter((p) => String(p.id) !== String(page.id)).slice(0, max)
}
