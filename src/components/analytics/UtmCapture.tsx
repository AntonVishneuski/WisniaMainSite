'use client'
import { useEffect } from 'react'
import { parseAttribution } from '../../lib/utm'

const KEY = 'wisnia-attribution'
export function UtmCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(KEY)) return
    const attr = parseAttribution(window.location.search, document.referrer)
    if (Object.keys(attr).length) localStorage.setItem(KEY, JSON.stringify(attr))
  }, [])
  return null
}
