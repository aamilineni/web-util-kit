import { useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { CopyButton } from '@/components/ui/CopyButton'
import { formatYaml, minifyYaml } from '@/lib/tools/yaml'
import { SEO, usePageSeo } from '@/lib/seo'

export function YamlPage() {
  usePageSeo(SEO.yaml)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const run = (action: 'format' | 'minify') => {
    setError(null)
    try {
      setOutput(action === 'format' ? formatYaml(input) : minifyYaml(input))
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : 'Invalid YAML.')
    }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="YAML Formatter"
        description="Pretty-print, minify, and validate YAML online — free and private."
      />

      <TextAreaField
        label="YAML input"
        value={input}
        onChange={setInput}
        placeholder={'name: iLovePDFGuru\nversion: 1'}
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
