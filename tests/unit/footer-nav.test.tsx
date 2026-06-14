import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../../messages/pl.json'
import { Footer } from '../../src/components/layout/Footer'

function renderFooter(locale: string, isHome: boolean) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Footer locale={locale} settings={null} services={[]} isHome={isHome} />
    </NextIntlClientProvider>,
  )
}

function hrefs(container: HTMLElement): (string | null)[] {
  return Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
}

describe('Footer section nav', () => {
  it('the bug: off the home page the price/about/contact links resolve to the home sections, not dead bare anchors', () => {
    const { container, unmount } = renderFooter('pl', false)
    const all = hrefs(container)
    expect(all).toContain('/#cennik')
    expect(all).toContain('/#efekty')
    expect(all).toContain('/#o-nas')
    expect(all).toContain('/#kontakt')
    expect(all).not.toContain('#cennik')
    unmount()
  })

  it('on the home page the same links stay bare anchors for in-page smooth scroll', () => {
    const { container, unmount } = renderFooter('pl', true)
    const all = hrefs(container)
    expect(all).toContain('#cennik')
    expect(all).not.toContain('/#cennik')
    unmount()
  })

  it('ru off-home keeps the /ru prefix', () => {
    const { container, unmount } = renderFooter('ru', false)
    expect(hrefs(container)).toContain('/ru#cennik')
    unmount()
  })
})
