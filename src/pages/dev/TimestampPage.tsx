import { useEffect, useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { CopyButton } from '@/components/ui/CopyButton'
import {
  dateToUnix,
  formatLocal,
  formatDate,
  nowUnix,
  unixToDate,
} from '@/lib/tools/timestamp'
import { SEO, usePageSeo } from '@/lib/seo'

type Unit = 'seconds' | 'milliseconds'
type Mode = 'to-date' | 'to-unix'

export function TimestampPage() {
  usePageSeo(SEO.timestamp)
  const [mode, setMode] = useState<Mode>('to-date')
  const [unit, setUnit] = useState<Unit>('seconds')
  const [input, setInput] = useState('')
  const [liveNow, setLiveNow] = useState(nowUnix('seconds'))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveNow(nowUnix(unit))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [unit])

  let output = ''
  let error: string | null = null

  if (mode === 'to-date') {
    const date = unixToDate(input, unit)
    if (input && !date) error = 'Invalid Unix timestamp.'
    if (date) output = `${formatDate(date)}\n${formatLocal(date)}`
  } else if (input) {
    const date = new Date(input)
    if (Number.isNaN(date.getTime())) error = 'Invalid date string.'
    else output = String(dateToUnix(date, unit))
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Time Tools"
        title="Unix Timestamp Converter"
        description="Convert Unix timestamps to human-readable dates and back — with a live clock."
      />

      <div className="live-pulse rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">Live now</p>
        <p className="mt-1 font-mono text-2xl font-bold text-brand-700">{liveNow}</p>
        <CopyButton text={String(liveNow)} label="Copy timestamp" />
      </div>

      <SegmentedControl
        options={[
          { value: 'to-date' as Mode, label: 'Unix → Date' },
          { value: 'to-unix' as Mode, label: 'Date → Unix' },
        ]}
        value={mode}
        onChange={setMode}
      />

      <SegmentedControl
        options={[
          { value: 'seconds' as Unit, label: 'Seconds' },
          { value: 'milliseconds' as Unit, label: 'Milliseconds' },
        ]}
        value={unit}
        onChange={setUnit}
      />

      <label className="block text-sm font-medium text-slate-700">
        {mode === 'to-date' ? 'Unix timestamp' : 'Date / ISO string'}
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={mode === 'to-date' ? String(liveNow) : new Date().toISOString()}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Result</span>
            <CopyButton text={output.split('\n')[0] ?? output} />
          </div>
          <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-800">
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}
