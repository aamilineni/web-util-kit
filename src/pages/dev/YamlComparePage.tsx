import { useEffect, useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import {
  compareYaml,
  formatDiffValue,
  parseYamlInput,
  type YamlCompareResult,
} from '@/lib/tools/yamlCompare'
import { formatYaml } from '@/lib/tools/yaml'
import { SEO, usePageSeo } from '@/lib/seo'

const diffStyles = {
  added: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  removed: 'border-red-200 bg-red-50 text-red-900',
  changed: 'border-amber-200 bg-amber-50 text-amber-900',
} as const

export function YamlComparePage() {
  usePageSeo(SEO.yamlCompare)
  const [left, setLeft] = useState('name: Alice\nage: 30')
  const [right, setRight] = useState('name: Alice\nage: 31\ncity: NYC')
  const [live, setLive] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<YamlCompareResult | null>(null)

  const runCompare = () => {
    try {
      const leftParsed = parseYamlInput(left, 'Left')
      const rightParsed = parseYamlInput(right, 'Right')
      setError(null)
      setResult(compareYaml(leftParsed, rightParsed))
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Could not compare YAML.')
    }
  }

  useEffect(() => {
    if (!live) return
    try {
      const leftParsed = parseYamlInput(left, 'Left')
      const rightParsed = parseYamlInput(right, 'Right')
      setError(null)
      setResult(compareYaml(leftParsed, rightParsed))
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Could not compare YAML.')
    }
  }, [left, right, live])

  const formatBoth = () => {
    try {
      setLeft(formatYaml(left))
      setRight(formatYaml(right))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid YAML.')
    }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="YAML Comparator"
        description="Compare two YAML documents side by side and see added, removed, and changed fields."
      />

      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          options={[
            { value: 'live', label: 'Live compare' },
            { value: 'manual', label: 'Manual' },
          ]}
          value={live ? 'live' : 'manual'}
          onChange={(value) => setLive(value === 'live')}
        />
        {!live && <Button onClick={runCompare}>Compare</Button>}
        <Button variant="secondary" onClick={formatBoth}>
          Format both
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextAreaField
          label="YAML A"
          value={left}
          onChange={setLeft}
          rows={14}
          placeholder={'key: value'}
        />
        <TextAreaField
          label="YAML B"
          value={right}
          onChange={setRight}
          rows={14}
          placeholder={'key: other'}
        />
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {result && !error && (
        <div className="space-y-3 animate-fade-in">
          {result.equal ? (
            <Alert variant="success">YAML documents are identical.</Alert>
          ) : (
            <>
              <Alert variant="info">
                Found {result.diffs.length} difference{result.diffs.length === 1 ? '' : 's'}.
              </Alert>
              <ul className="space-y-2">
                {result.diffs.map((entry, index) => {
                  const formatted = formatDiffValue(entry)
                  return (
                    <li
                      key={`${entry.path}-${entry.kind}-${index}`}
                      className={`rounded-xl border px-3 py-2.5 text-sm ${diffStyles[entry.kind]}`}
                    >
                      <p className="font-mono text-xs font-semibold uppercase tracking-wide opacity-80">
                        {entry.kind} · {entry.path}
                      </p>
                      {entry.kind === 'changed' && 'before' in formatted ? (
                        <div className="mt-2 space-y-1 font-mono text-xs">
                          <p>
                            <span className="font-semibold">A:</span> {formatted.before}
                          </p>
                          <p>
                            <span className="font-semibold">B:</span> {formatted.after}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-1 font-mono text-xs">
                          {'value' in formatted ? formatted.value : ''}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
