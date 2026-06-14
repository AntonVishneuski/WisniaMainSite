'use client'
import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSelection } from '@payloadcms/ui'

type DocPreview = { id: string; filename: string }

export default function BulkRenameAction() {
  const { selectedIDs, count, disableBulkEdit } = useSelection()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [docs, setDocs] = useState<DocPreview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const collection = pathname.split('/admin/collections/')[1]?.split('/')[0]

  useEffect(() => {
    if (!open || !collection || selectedIDs.length === 0) return
    setDocs([])
    const idsParam = selectedIDs.join(',')
    fetch(`/api/${collection}?where[id][in]=${idsParam}&limit=100&depth=0`, {
      credentials: 'include',
    })
      .then(r => r.json())
      .then(data =>
        setDocs(
          (data.docs as { id: string; filename: string }[])?.map(d => ({
            id: d.id,
            filename: d.filename,
          })) ?? [],
        ),
      )
  }, [open, collection, selectedIDs])

  const preview = docs.map(d => ({
    id: d.id,
    from: d.filename,
    to: find ? d.filename.replaceAll(find, replace) : d.filename,
  }))

  const hasDuplicates =
    preview.length > 1 && new Set(preview.map(p => p.to)).size < preview.length

  const handleRename = useCallback(async () => {
    if (!collection || !find) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/media/bulk-rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIDs, collection, find, replace }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok || (data.failed && data.failed.length > 0)) {
        setError(`Не удалось переименовать: ${data.failed?.length ?? 'неизвестно'} файл(ов)`)
        setLoading(false)
        return
      }
    } catch {
      setError('Ошибка сети. Попробуйте снова.')
      setLoading(false)
      return
    }
    setLoading(false)
    setOpen(false)
    window.location.reload()
  }, [selectedIDs, collection, find, replace])

  if (count === 0 || disableBulkEdit) return null

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Переименовать ({count})
      </button>
      {open && (
        <dialog open>
          <h3>Переименовать {count} файл(ов)</h3>
          <div>
            <label>
              Найти
              <input
                placeholder="Найти"
                value={find}
                onChange={e => setFind(e.target.value)}
              />
            </label>
            <label>
              Заменить
              <input
                placeholder="Заменить"
                value={replace}
                onChange={e => setReplace(e.target.value)}
              />
            </label>
          </div>
          {preview.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Текущее</th>
                  <th>Новое</th>
                </tr>
              </thead>
              <tbody>
                {preview.map(p => (
                  <tr key={p.id}>
                    <td>{p.from}</td>
                    <td>{p.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {hasDuplicates && <p>Конфликт имён — исправьте перед переименованием</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
            <button type="button" onClick={() => setOpen(false)} disabled={loading}>
              Отмена
            </button>
            <button
              type="button"
              onClick={handleRename}
              disabled={loading || !find || hasDuplicates}
            >
              Переименовать
            </button>
          </div>
        </dialog>
      )}
    </>
  )
}
