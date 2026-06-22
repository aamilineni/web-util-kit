type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 ${className}`}
      role="tablist"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-white text-brand-700 shadow-sm ring-1 ring-brand-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
