import { useEffect, useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { Alert } from '@/components/ui/Alert'
import { CopyButton } from '@/components/ui/CopyButton'
import {
  COMMON_TIMEZONES,
  CRON_PRESETS,
  getBrowserTimezone,
  getNextCronRuns,
  parseCronFields,
  type CronParseResult,
} from '@/lib/tools/cron'
import { SEO, usePageSeo } from '@/lib/seo'

export function CronPage() {
  usePageSeo(SEO.cron)
  const [expression, setExpression] = useState('0 9 * * 1-5')
  const [timezone, setTimezone] = useState(getBrowserTimezone)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CronParseResult | null>(null)
  const [fields, setFields] = useState<ReturnType<typeof parseCronFields> | null>(null)

  useEffect(() => {
    try {
      setResult(getNextCronRuns(expression, timezone))
      setFields(parseCronFields(expression))
      setError(null)
    } catch (err) {
      setResult(null)
      setFields(null)
      setError(err instanceof Error ? err.message : 'Invalid cron expression.')
    }
  }, [expression, timezone])

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="Cron Expression Parser"
        description="Validate cron schedules, get a plain-English description, and preview upcoming run times."
      />

      <label className="block text-sm font-medium text-slate-700">
        Cron expression
        <div className="mt-1 flex gap-2">
          <input
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            placeholder="0 9 * * 1-5"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
          <CopyButton text={expression} label="Copy" />
        </div>
        <span className="mt-1 block text-xs text-slate-500">
          Standard 5-field format: minute hour day-of-month month day-of-week
        </span>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Timezone
        <select
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        >
          {COMMON_TIMEZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </label>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {CRON_PRESETS.map((preset) => (
            <button
              key={preset.expression}
              type="button"
              onClick={() => setExpression(preset.expression)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                expression === preset.expression
                  ? 'border-brand-300 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {result && !error && (
        <div className="space-y-4 animate-fade-in">
          <Alert variant="success">{result.description}</Alert>

          {fields && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {fields.seconds !== null && <th className="px-3 py-2">Seconds</th>}
                    <th className="px-3 py-2">Minute</th>
                    <th className="px-3 py-2">Hour</th>
                    <th className="px-3 py-2">Day</th>
                    <th className="px-3 py-2">Month</th>
                    <th className="px-3 py-2">Weekday</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-mono text-slate-800">
                    {fields.seconds !== null && <td className="px-3 py-2">{fields.seconds}</td>}
                    <td className="px-3 py-2">{fields.minute}</td>
                    <td className="px-3 py-2">{fields.hour}</td>
                    <td className="px-3 py-2">{fields.dayOfMonth}</td>
                    <td className="px-3 py-2">{fields.month}</td>
                    <td className="px-3 py-2">{fields.dayOfWeek}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-slate-900">Next run times</h2>
            <ul className="mt-2 space-y-1.5">
              {result.nextRuns.map((run) => (
                <li key={run} className="font-mono text-sm text-slate-700">
                  {run}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
