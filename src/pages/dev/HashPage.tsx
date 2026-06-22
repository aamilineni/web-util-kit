import { useEffect, useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { CopyButton } from '@/components/ui/CopyButton'
import { hashText, type HashAlgorithm } from '@/lib/tools/hash'
import { SEO, usePageSeo } from '@/lib/seo'

const algorithms: HashAlgorithm[] = ['SHA-256', 'SHA-384', 'SHA-512']

export function HashPage() {
  usePageSeo(SEO.hash)
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256')
  const [output, setOutput] = useState('')

  useEffect(() => {
    if (!input) {
      setOutput('')
      return
    }
    void hashText(input, algorithm).then(setOutput)
  }, [input, algorithm])

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="Hash Generator"
        description="Generate SHA-256, SHA-384, and SHA-512 hashes in real time as you type."
      />

      <SegmentedControl
        options={algorithms.map((value) => ({ value, label: value }))}
        value={algorithm}
        onChange={setAlgorithm}
      />

      <TextAreaField
        label="Input text"
        value={input}
        onChange={setInput}
        placeholder="Type to hash instantly…"
      />

      {output && (
        <TextAreaField
          label={`${algorithm} hash`}
          value={output}
          onChange={() => {}}
          readOnly
          rows={3}
          actions={<CopyButton text={output} />}
        />
      )}
    </div>
  )
}
