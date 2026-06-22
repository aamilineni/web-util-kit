import { useMemo, useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { CopyButton } from '@/components/ui/CopyButton'
import {
  formatHsl,
  formatRgb,
  hexToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
} from '@/lib/tools/color'
import { SEO, usePageSeo } from '@/lib/seo'

export function ColorPage() {
  usePageSeo(SEO.color)
  const [hex, setHex] = useState('#4F46E5')

  const rgb = useMemo(() => hexToRgb(hex) ?? { r: 79, g: 70, b: 229 }, [hex])
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb])

  const updateFromPicker = (value: string) => setHex(value.toUpperCase())

  const updateRgbField = (channel: 'r' | 'g' | 'b', value: string) => {
    const num = Number(value)
    if (!Number.isFinite(num)) return
    setHex(rgbToHex({ ...rgb, [channel]: num }))
  }

  const updateHslField = (channel: 'h' | 's' | 'l', value: string) => {
    const num = Number(value)
    if (!Number.isFinite(num)) return
    setHex(rgbToHex(hslToRgb({ ...hsl, [channel]: num })))
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Everyday Tools"
        title="Color Converter"
        description="Convert colors between HEX, RGB, and HSL with a live preview swatch."
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div
          className="aspect-square w-full max-w-[200px] rounded-2xl border border-slate-200 shadow-inner transition-colors duration-300"
          style={{ backgroundColor: hex }}
        />

        <div className="space-y-4">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            Pick color
            <input
              type="color"
              value={hex.length === 7 ? hex : '#4F46E5'}
              onChange={(event) => updateFromPicker(event.target.value)}
              className="h-10 w-16 cursor-pointer rounded-lg border border-slate-200"
            />
            <CopyButton text={hex} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            HEX
            <input
              value={hex}
              onChange={(event) => setHex(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono"
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            {(['r', 'g', 'b'] as const).map((channel) => (
              <label key={channel} className="text-sm font-medium text-slate-700 uppercase">
                {channel}
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[channel]}
                  onChange={(event) => updateRgbField(channel, event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 font-mono"
                />
              </label>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['h', 's', 'l'] as const).map((channel) => (
              <label key={channel} className="text-sm font-medium text-slate-700 uppercase">
                {channel}
                <input
                  type="number"
                  value={hsl[channel]}
                  onChange={(event) => updateHslField(channel, event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 font-mono"
                />
              </label>
            ))}
          </div>

          <div className="rounded-xl bg-slate-50 p-3 font-mono text-sm text-slate-700">
            <p>{formatRgb(rgb)}</p>
            <p>{formatHsl(hsl)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
