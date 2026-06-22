import { useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { CopyButton } from '@/components/ui/CopyButton'
import { formatJson, minifyJson } from '@/lib/tools/json'
import { SEO, usePageSeo } from '@/lib/seo'

export function JsonPage() {
  usePageSeo(SEO.json)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const run = (action: 'format' | 'minify') => {
    setError(null)
    try {
      setOutput(action === 'format' ? formatJson(input) : minifyJson(input))
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : 'Invalid JSON.')
    }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="JSON Formatter"
        description="Pretty-print, minify, and validate JSON online — free and private."
      />

      <TextAreaField
        label="JSON input"
        value={input}
        onChange={setInput}
        placeholder='{"name":"iLovePDFGuru"}'
      />

      <div className="flex gap-2">
        <Button onClick={() => run('format')}>Format / Prettify</Button>
        <Button variant="secondary" onClick={() => run('minify')}>
          Minify
        </Button>
      </div>

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
