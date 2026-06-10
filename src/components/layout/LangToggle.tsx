'use client'
import { usePathname, useRouter } from 'next/navigation'

export function LangToggle({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()

  function to(l: 'pl' | 'ru') {
    const stripped = pathname.replace(/^\/(pl|ru)(?=\/|$)/, '') || '/'
    router.push(l === 'pl' ? stripped : `/ru${stripped === '/' ? '' : stripped}`)
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        type="button"
        onClick={() => to('pl')}
        aria-current={locale === 'pl' ? 'true' : undefined}
        className={
          locale === 'pl'
            ? 'font-semibold text-cherry px-3 py-1.5 rounded-full bg-cherry text-cream text-[13px] tracking-[0.06em]'
            : 'text-gray px-3 py-1.5 text-[13px] tracking-[0.06em]'
        }
      >
        PL
      </button>
      <button
        type="button"
        onClick={() => to('ru')}
        aria-current={locale === 'ru' ? 'true' : undefined}
        className={
          locale === 'ru'
            ? 'font-semibold text-cherry px-3 py-1.5 rounded-full bg-cherry text-cream text-[13px] tracking-[0.06em]'
            : 'text-gray px-3 py-1.5 text-[13px] tracking-[0.06em]'
        }
      >
        RU
      </button>
    </div>
  )
}
