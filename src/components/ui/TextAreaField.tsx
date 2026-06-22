import type { ReactNode } from 'react'

type TextAreaFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  actions?: ReactNode
  readOnly?: boolean
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 8,
  actions,
  readOnly = false,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {actions}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        readOnly={readOnly}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 read-only:bg-slate-50"
      />
    </div>
  )
}
