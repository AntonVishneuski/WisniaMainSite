// Suspense fallback for route loading.tsx files. Pages render their own
// Header/Footer, so during navigation this replaces the whole viewport.
export function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Ładowanie / Загрузка"
      className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 bg-cream"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static asset, matches Header/Footer logo usage */}
      <img src="/assets/logo-wisnia.png" alt="" className="h-[42px] w-auto animate-pulse" />
      <div
        className="w-9 h-9 rounded-full border-2 border-cherry border-t-transparent animate-spin"
        aria-hidden="true"
      />
    </div>
  )
}
