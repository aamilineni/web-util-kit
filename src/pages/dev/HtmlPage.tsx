import { useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { CopyButton } from '@/components/ui/CopyButton'
import { decodeHtml, encodeHtml } from '@/lib/tools/html'
import { SEO, usePageSeo } from '@/lib/seo'

type Mode = 'encode' | 'decode'

export function HtmlPage() {
  usePageSeo(SEO.html)
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const run = () => {
    setError(null)
    try {
      setOutput(mode === 'encode' ? encodeHtml(input) : decodeHtml(input))
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : 'Conversion failed.')
    }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="HTML Encoder / Decoder"
        description="Escape or unescape HTML entities for safe rendering and debugging."
      />

      <SegmentedControl
        options={[
          { value: 'encode' as Mode, label: 'Encode' },
          { value: 'decode' as Mode, label: 'Decode' },
        ]}
        value={mode}
        onChange={setMode}
      />

      <TextAreaField label="Input" value={input} onChange={setInput} />

      <button
        type="button"
        onClick={run}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Convert
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {output && (
        <TextAreaField
          label="Output"
          value={output}
          onChange={() => {}}
          readOnly
          actions={<CopyButton text={output} />}
        />
      )}
    </div>
  )
}
