import { useState } from 'react'
import { Download } from 'lucide-react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { Button } from '@/components/ui/Button'
import { CopyButton } from '@/components/ui/CopyButton'
import { downloadCsv, uuidsCsvFilename } from '@/lib/download'
import { generateUuids } from '@/lib/tools/uuid'
import { SEO, usePageSeo } from '@/lib/seo'

export function UuidPage() {
  usePageSeo(SEO.uuid)
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>([])

  const generate = () => {
    setUuids(generateUuids(count))
  }

  const allText = uuids.join('\n')

  const downloadAsCsv = () => {
    const rows = [['index', 'uuid'], ...uuids.map((uuid, index) => [String(index + 1), uuid])]
    downloadCsv(rows, uuidsCsvFilename())
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="UUID Generator"
        description="Generate UUID v4 identifiers — one or hundreds at a time. Free and instant."
      />

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <label className="text-sm text-slate-700">
          How many UUIDs?
          <input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="ml-2 w-24 rounded-lg border border-slate-300 px-2 py-1.5"
          />
        </label>
        <Button onClick={generate}>Generate UUIDs</Button>
        {uuids.length > 0 && (
          <>
            <CopyButton text={allText} label="Copy all" />
            <Button variant="secondary" onClick={downloadAsCsv}>
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </>
        )}
      </div>

      {uuids.length > 0 && (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {uuids.map((uuid) => (
            <li key={uuid} className="flex items-center justify-between gap-3 px-4 py-3">
              <code className="font-mono text-sm text-slate-800">{uuid}</code>
              <CopyButton text={uuid} label="Copy" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
