'use client'
import { useEffect } from 'react'
import { pushEvent } from '../../lib/analytics'

const MILESTONES = [25, 50, 75, 100] as const

// Fires a `scroll_depth` dataLayer event once per milestone (25/50/75/100%).
// Standard funnel signal for GTM — pairs with cta_click / view_price.
export function ScrollDepth() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const fired = new Set<number>()
    let ticking = false

    const check = () => {
      ticking = false
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      // +2px tolerance: browsers clamp scrollY a sub-pixel short of the bottom,
      // which otherwise drops the 100% milestone.
      const pct = ((window.scrollY + 2) / scrollable) * 100
      for (const m of MILESTONES) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m)
          pushEvent('scroll_depth', { percent: m })
        }
      }
      if (fired.size === MILESTONES.length) window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(check)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    check() // short pages may already sit past a milestone on load
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return null
}
