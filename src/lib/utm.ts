export type Attribution = {
  utm_source?: string; utm_medium?: string; utm_campaign?: string
  utm_term?: string; utm_content?: string; referrer_host?: string
}
export function parseAttribution(search: string, referrer: string): Attribution {
  const out: Attribution = {}
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const) {
    const v = params.get(k); if (v) out[k] = v
  }
  if (referrer) { try { out.referrer_host = new URL(referrer).host } catch { /* ignore */ } }
  return out
}
