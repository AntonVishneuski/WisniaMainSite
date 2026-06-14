import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import BulkDeleteAction from '../../src/components/admin/BulkDeleteAction'

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/collections/media',
}))

const mockUseSelection = vi.fn()
vi.mock('@payloadcms/ui', () => ({
  useSelection: () => mockUseSelection(),
}))

afterEach(() => cleanup())

describe('BulkDeleteAction', () => {
  it('renders nothing when count is 0', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: [], count: 0 })
    const { container } = render(<BulkDeleteAction />)
    expect(container.firstChild).toBeNull()
  })

  it('shows delete button when files are selected', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1', '2'], count: 2 })
    const { getByText } = render(<BulkDeleteAction />)
    expect(getByText('Удалить (2)')).toBeTruthy()
  })

  it('opens confirmation dialog on button click', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1 })
    const { getByText } = render(<BulkDeleteAction />)
    fireEvent.click(getByText('Удалить (1)'))
    expect(getByText(/Удалить 1 файл/)).toBeTruthy()
    expect(getByText(/нельзя отменить/)).toBeTruthy()
  })

  it('closes dialog on cancel click', () => {
    mockUseSelection.mockReturnValue({ selectedIDs: ['1'], count: 1 })
    const { getByText, queryByText } = render(<BulkDeleteAction />)
    fireEvent.click(getByText('Удалить (1)'))
    fireEvent.click(getByText('Отмена'))
    expect(queryByText(/Удалить 1 файл/)).toBeNull()
  })
})
