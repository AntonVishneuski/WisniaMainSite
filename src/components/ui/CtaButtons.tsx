'use client'
import { pushEvent } from '../../lib/analytics'
type Method = 'whatsapp' | 'phone' | 'booksy'

export function CtaLink({ method, href, children, className }: { method: Method; href: string; children: React.ReactNode; className?: string }) {
  function track() {
    pushEvent('cta_click', { method })
    // Meta Pixel conversion. fbq queues these until consent is granted (see MetaPixel),
    // so nothing is sent before the visitor accepts the consent banner.
    const w = window as any
    if (typeof w.fbq === 'function') {
      w.fbq('track', 'Lead', { content_name: method })
      w.fbq('trackCustom', 'CTAClick', { method })
    }
  }
  return (
    <a href={href} onClick={track} target={method === 'phone' ? undefined : '_blank'} rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
