/**
 * The header & footer section nav (Cennik / Efekty / O nas / Kontakt) targets
 * sections that exist only on the home page. As bare "#cennik" anchors they
 * silently do nothing on /blog, /uslugi, /polityka-prywatnosci — there is no
 * matching element to scroll to. sectionHref makes the link page-aware: a
 * same-page anchor on the home page (smooth in-page scroll, no reload), or
 * "/#cennik" / "/ru#cennik" elsewhere so the link navigates home and lands on
 * the section. The caller (a page) decides isHome, since it knows its own route.
 */
export function homePath(locale: string): string {
  return locale === 'ru' ? '/ru' : '/'
}

// Locale-prefixed internal path: localePath('ru', '/blog') → '/ru/blog'.
// For the bare home path use homePath (localePath would yield '/ru/').
export function localePath(locale: string, path: string): string {
  return locale === 'ru' ? `/ru${path}` : path
}

export function sectionHref(hash: string, locale: string, isHome: boolean): string {
  // homePath('pl') is '/', so '/' + '#cennik' = '/#cennik' (no double slash).
  return isHome ? hash : `${homePath(locale)}${hash}`
}
