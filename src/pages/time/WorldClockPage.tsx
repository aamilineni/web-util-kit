import { useEffect, useMemo, useState } from 'react'
import { GripVertical, Plus, Search, Trash2 } from 'lucide-react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { ToolShell } from '@/components/layout/ToolShell'
import { TimeBar } from '@/components/time/TimeBar'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import {
  dateAtMinutesInZone,
  DEFAULT_ZONES,
  formatClockDate,
  formatClockTime,
  getHourFraction,
  getUtcOffsetLabel,
  getZonedParts,
  isBusinessHour,
  isNightHour,
  searchTimeZones,
  type ZoneClock,
} from '@/lib/tools/worldTime'
import { SEO, usePageSeo } from '@/lib/seo'

type Mode = 'live' | 'compare'

export function WorldClockPage() {
  usePageSeo(SEO.worldClock)
  const [zones, setZones] = useState<ZoneClock[]>(DEFAULT_ZONES)
  const [now, setNow] = useState(() => new Date())
  const [mode, setMode] = useState<Mode>('live')
  const [anchorId, setAnchorId] = useState(DEFAULT_ZONES[1]?.id ?? 'ny')
  const [compareMinutes, setCompareMinutes] = useState(12 * 60)
  const [search, setSearch] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)

  const anchor = zones.find((zone) => zone.id === anchorId) ?? zones[0]

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!anchor || mode !== 'live') return
    const parts = getZonedParts(now, anchor.timeZone)
    setCompareMinutes(parts.hour * 60 + parts.minute)
  }, [anchor, now, mode])

  const referenceDate = useMemo(() => {
    if (mode === 'live' || !anchor) return now
    return dateAtMinutesInZone(now, anchor.timeZone, compareMinutes)
  }, [mode, now, anchor, compareMinutes])

  const searchResults = useMemo(() => searchTimeZones(search), [search])

  const addZone = (timeZone: string, city: string) => {
    if (zones.some((zone) => zone.timeZone === timeZone)) return
    setZones((current) => [...current, { id: crypto.randomUUID(), timeZone, city }])
    setSearch('')
  }

  const removeZone = (id: string) => {
    setZones((current) => (current.length <= 1 ? current : current.filter((zone) => zone.id !== id)))
  }

  const reorder = (fromId: string, toId: string) => {
    if (fromId === toId) return
    setZones((current) => {
      const fromIndex = current.findIndex((zone) => zone.id === fromId)
      const toIndex = current.findIndex((zone) => zone.id === toId)
      if (fromIndex < 0 || toIndex < 0) return current
      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  return (
    <ToolShell width="full">
      <ToolPageHeader
        category="Time Tools"
        title="World Clock — Time Zone Converter"
        description="Compare times across cities like WorldTimeBuddy. Live clocks, timelines, and a drag slider to plan meetings."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <SegmentedControl
          options={[
            { value: 'live' as Mode, label: 'Live now' },
            { value: 'compare' as Mode, label: 'Compare times' },
          ]}
          value={mode}
          onChange={setMode}
        />

        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Add city or timezone…"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
          {search && searchResults.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
              {searchResults.map((result) => (
                <li key={result.timeZone}>
                  <button
                    type="button"
                    onClick={() => addZone(result.timeZone, result.city)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-brand-50"
                  >
                    <Plus className="h-4 w-4 text-brand-600" />
                    <span className="font-medium text-slate-800">{result.city}</span>
                    <span className="truncate text-slate-500">{result.timeZone}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {mode === 'compare' && anchor && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-brand-800">
              Pick a time in <span className="font-semibold">{anchor.city}</span>
            </p>
            <label className="text-xs text-brand-700">
              Anchor
              <select
                value={anchorId}
                onChange={(event) => setAnchorId(event.target.value)}
                className="ml-2 rounded-lg border border-brand-200 bg-white px-2 py-1 text-sm"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.city}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={1439}
            value={compareMinutes}
            onChange={(event) => setCompareMinutes(Number(event.target.value))}
            className="mt-3 w-full accent-brand-600"
          />
          <p className="mt-2 text-center font-mono text-sm text-brand-800">
            {formatClockTime(referenceDate, anchor.timeZone)} ·{' '}
            {formatClockDate(referenceDate, anchor.timeZone)}
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[minmax(140px,180px)_1fr_minmax(120px,160px)_auto] gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
          <span>City</span>
          <span>24h timeline</span>
          <span>Time</span>
          <span>Offset</span>
        </div>

        <ul className="divide-y divide-slate-100">
          {zones.map((zone) => {
            const hour = getHourFraction(referenceDate, zone.timeZone)
            const night = isNightHour(hour)
            const business = isBusinessHour(hour)
            const isAnchor = zone.id === anchorId

            return (
              <li
                key={zone.id}
                draggable
                onDragStart={() => setDragId(zone.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragId) reorder(dragId, zone.id)
                  setDragId(null)
                }}
                className={`grid grid-cols-1 gap-3 px-4 py-4 transition-colors lg:grid-cols-[minmax(140px,180px)_1fr_minmax(120px,160px)_auto] lg:items-center lg:gap-4 lg:px-6 ${
                  isAnchor ? 'bg-brand-50/40' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="hidden h-4 w-4 shrink-0 cursor-grab text-slate-300 sm:block" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{zone.city}</p>
                    <p className="truncate text-xs text-slate-500">
                      {zone.timeZone.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeZone(zone.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${zone.city}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <TimeBar hourFraction={hour} />
                  <div className="flex justify-between text-[10px] uppercase tracking-wide text-slate-400">
                    <span>12 am</span>
                    <span>12 pm</span>
                    <span>12 am</span>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-3 lg:block">
                  <div>
                    <p className="font-mono text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">
                      {formatClockTime(referenceDate, zone.timeZone)}
                    </p>
                    <p className="text-xs text-slate-500 sm:text-sm">
                      {formatClockDate(referenceDate, zone.timeZone)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 lg:mt-1">
                    {night && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        Night
                      </span>
                    )}
                    {business && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        Work hours
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-mono text-sm text-slate-600 lg:text-right">
                  {getUtcOffsetLabel(referenceDate, zone.timeZone)}
                </p>
              </li>
            )
          })}
        </ul>
      </div>

      <p className="text-center text-xs text-slate-500">
        Drag rows to reorder · Use compare mode to plan meetings across time zones
      </p>
    </ToolShell>
  )
}
