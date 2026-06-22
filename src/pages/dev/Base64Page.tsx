import { useEffect, useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Alert } from '@/components/ui/Alert'
import { CopyButton } from '@/components/ui/CopyButton'
import { decodeBase64, encodeBase64 } from '@/lib/tools/base64'
import { SEO, usePageSeo } from '@/lib/seo'

type Mode = 'encode' | 'decode'

export function Base64Page() {
  usePageSeo(SEO.base64)
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!input) {
      setOutput('')
      setError(null)
      return
    }
    try {
      setOutput(mode === 'encode' ? encodeBase64(input) : decodeBase64(input))
      setError(null)
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : 'Conversion failed.')
    }
  }, [input, mode])

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="Base64 Encoder / Decoder"
        description="Encode and decode text to Base64 in real time. Runs locally — nothing is sent to a server."
      />

      <SegmentedControl
        options={[
          { value: 'encode' as Mode, label: 'Encode' },
          { value: 'decode' as Mode, label: 'Decode' },
        ]}
        value={mode}
        onChange={setMode}
      />

      <TextAreaField
        label={mode === 'encode' ? 'Plain text' : 'Base64 input'}
        value={input}
        onChange={setInput}
        placeholder={mode === 'encode' ? 'Type to encode instantly…' : 'Paste Base64…'}
      />

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
