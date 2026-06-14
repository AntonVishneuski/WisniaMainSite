'use client'
import { useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSelection } from '@payloadcms/ui'

export default function BulkDeleteAction() {
  const { selectedIDs, count } = useSelection()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const collection = pathname.split('/admin/collections/')[1]?.split('/')[0]

  const handleDelete = useCallback(async () => {
    if (!collection) return
    setLoading(true)
    try {
      await fetch('/api/media/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIDs, collection }),
        credentials: 'include',
      })
    } finally {
      setLoading(false)
      setOpen(false)
      window.location.reload()
    }
  }, [selectedIDs, collection])

  if (count === 0) return null

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Удалить ({count})
      </button>
      {open && (
        <dialog open>
          <p>Удалить {count} файл(ов)? Действие нельзя отменить.</p>
          <div>
            <button type="button" onClick={() => setOpen(false)} disabled={loading}>
              Отмена
            </button>
            <button type="button" onClick={handleDelete} disabled={loading}>
              {loading ? 'Удаляю...' : 'Удалить'}
            </button>
          </div>
        </dialog>
      )}
    </>
  )
}
