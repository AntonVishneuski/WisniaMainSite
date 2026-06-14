import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import BulkRenameAction from '../../src/components/admin/BulkRenameAction'

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/collections/media',
}))

const mockUseSelection = vi.fn()
vi.mock('@payloadcms/ui', () => ({
  useSelection: () => mockUseSelection(),
}))

afterEach(() => cleanup())

describe('BulkRenameAction', () => {
  it('renders nothing when count is 0', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: [], count: 0, disableBulkEdit: false })
    const { container } = render(<BulkRenameAction />)
    expect(container.firstChild).toBeNull()
  })

  it('shows rename button when files are selected', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1, disableBulkEdit: false })
    const { getByText } = render(<BulkRenameAction />)
    expect(getByText('Переименовать (1)')).toBeTruthy()
  })

  it('opens modal on button click', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1, disableBulkEdit: false })
    const { getByText } = render(<BulkRenameAction />)
    fireEvent.click(getByText('Переименовать (1)'))
    expect(getByText(/Переименовать 1 файл/)).toBeTruthy()
  })

  it('confirm button is disabled when find is empty', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1, disableBulkEdit: false })
    const { getByText } = render(<BulkRenameAction />)
    fireEvent.click(getByText('Переименовать (1)'))
    const btn = getByText('Переименовать') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('confirm button is enabled after typing find value', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1, disableBulkEdit: false })
    const { getByText, getByPlaceholderText } = render(<BulkRenameAction />)
    fireEvent.click(getByText('Переименовать (1)'))
    fireEvent.change(getByPlaceholderText('Найти'), { target: { value: 'ba4' } })
    const btn = getByText('Переименовать') as HTMLButtonElement
    expect(btn.disabled).toBe(false)
  })
})
