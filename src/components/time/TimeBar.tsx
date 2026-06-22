type TimeBarProps = {
  hourFraction: number
  compact?: boolean
}

export function TimeBar({ hourFraction, compact = false }: TimeBarProps) {
  const percent = (hourFraction / 24) * 100

  return (
    <div
      className={`relative w-full overflow-hidden rounded-full bg-slate-200/80 ${compact ? 'h-2' : 'h-3'}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 via-sky-200/90 to-indigo-950/80" />
      <div
        className="absolute inset-y-0 rounded-full bg-amber-300/35"
        style={{ left: `${(9 / 24) * 100}%`, width: `${(8 / 24) * 100}%` }}
      />
      <div
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 shadow-md ring-2 ring-white ${
          compact ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'
        }`}
        style={{ left: `${percent}%` }}
      />
    </div>
  )
}
