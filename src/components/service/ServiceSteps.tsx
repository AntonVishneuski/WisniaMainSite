export type ServiceStep = {
  title?: string | null
  text?: string | null
}

export function ServiceSteps({
  steps,
  heading,
}: {
  steps?: ServiceStep[] | null
  heading?: string
}) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="my-8">
      {heading && (
        <h2 className="font-serif text-[clamp(22px,3vw,30px)] font-semibold text-graphite mb-5">
          {heading}
        </h2>
      )}
      <div className="grid gap-3.5">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 items-start">
            {/* Number badge */}
            <div
              className="font-serif text-[30px] font-semibold text-rose-gold leading-none shrink-0 w-10"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            {/* Content */}
            <div>
              {step.title && (
                <span className="font-semibold text-graphite block mb-0.5">{step.title}</span>
              )}
              {step.text && (
                <p className="text-[15.5px] m-0 text-gray leading-[1.6]">{step.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
