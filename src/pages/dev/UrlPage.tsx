import { useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { CopyButton } from '@/components/ui/CopyButton'
import {
  decodeUrlComponent,
  decodeUrlFull,
  encodeUrlComponent,
  encodeUrlFull,
} from '@/lib/tools/url'
import { SEO, usePageSeo } from '@/lib/seo'

type Mode = 'component-encode' | 'component-decode' | 'full-encode' | 'full-decode'

const modes: { id: Mode; label: string }[] = [
  { id: 'component-encode', label: 'Encode component' },
  { id: 'component-decode', label: 'Decode component' },
  { id: 'full-encode', label: 'Encode URL' },
  { id: 'full-decode', label: 'Decode URL' },
]

export function UrlPage() {
  usePageSeo(SEO.url)
  const [mode, setMode] = useState<Mode>('component-encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const run = () => {
    setError(null)
    try {
      switch (mode) {
        case 'component-encode':
          setOutput(encodeUrlComponent(input))
          break
        case 'component-decode':
          setOutput(decodeUrlComponent(input))
          break
        case 'full-encode':
          setOutput(encodeUrlFull(input))
          break
        case 'full-decode':
          setOutput(decodeUrlFull(input))
          break
      }
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : 'URL conversion failed.')
    }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="URL Encoder / Decoder"
        description="Encode or decode URLs and URI components. Useful for query strings and API work."
      />

      <div className="flex flex-wrap gap-2">
        {modes.map((item) => (
          <Button
            key={item.id}
            variant={mode === item.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <TextAreaField label="Input" value={input} onChange={setInput} rows={4} />

      <Button onClick={run}>Convert</Button>

      {error && <Alert variant="error">{error}</Alert>}

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
