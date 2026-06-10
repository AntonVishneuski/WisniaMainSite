import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../../messages/pl.json'
import { Cennik } from '../../src/components/home/Cennik'
import type { PriceRow } from '../../src/lib/price-groups'

// Sample prices — kosmetologia tab (active by default)
const kosmetoRows: PriceRow[] = [
  {
    id: '1',
    tab: 'kosmetologia',
    category: 'Oczyszczanie',
    name: 'Wodorowe',
    price: '250 zł',
    order: 0,
  },
  {
    id: '2',
    tab: 'kosmetologia',
    category: 'Oczyszczanie',
    name: 'Konsultacja gratis',
    price: null,
    order: 1,
    isGift: true,
  },
]

// Package row for pakiety tab
const pakietyRows: PriceRow[] = [
  {
    id: '3',
    tab: 'pakiety',
    category: 'Kurs',
    name: 'Kurs RF x5',
    price: '850 zł',
    priceWas: '1000 zł',
    order: 0,
    isPackage: true,
  },
]

function renderCennik(prices: PriceRow[]) {
  const result = render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <Cennik prices={prices} />
    </NextIntlClientProvider>
  )
  return result
}

describe('Cennik', () => {
  it('renders normal row name and price', () => {
    const { unmount } = renderCennik(kosmetoRows)
    expect(screen.getByText('Wodorowe')).toBeTruthy()
    expect(screen.getByText('250 zł')).toBeTruthy()
    unmount()
  })

  it('renders gift row name', () => {
    const { unmount } = renderCennik(kosmetoRows)
    // Gift row name may appear more than once (screen-reader / a11y duplicates)
    const elements = screen.getAllByText('Konsultacja gratis')
    expect(elements.length).toBeGreaterThan(0)
    unmount()
  })

  it('renders package row with priceWas (crossed-out original price)', () => {
    // Render with pakiety rows and click the Pakiety tab to activate it
    const { unmount, container } = renderCennik(pakietyRows)
    // Find the Pakiety tab within this render's container to avoid stale selectors
    const tablist = within(container).getByRole('tablist')
    const pakietyTab = within(tablist).getByRole('tab', { name: /pakiety/i })
    fireEvent.click(pakietyTab)
    // After activation, the priceWas should be visible in the active panel
    expect(within(container).getByText('1000 zł')).toBeTruthy()
    unmount()
  })

  it('renders em dash for a tab with zero rows', () => {
    // Render with empty prices — the default kosmetologia tab has no rows → shows —
    const { unmount } = renderCennik([])
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
    unmount()
  })
})
