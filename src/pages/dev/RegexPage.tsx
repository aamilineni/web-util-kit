import { useMemo, useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { highlightMatches } from '@/lib/tools/regex'
import { SEO, usePageSeo } from '@/lib/seo'

const flagOptions = ['g', 'i', 'm', 's', 'u', 'y'] as const

export function RegexPage() {
  usePageSeo(SEO.regex)
  const [pattern, setPattern] = useState('')
  const [text, setText] = useState('')
  const [flags, setFlags] = useState<string[]>(['g'])

  const flagString = flags.join('')
  const result = useMemo(
    () => highlightMatches(text, pattern, flagString),
    [text, pattern, flagString],
  )

  const toggleFlag = (flag: string) => {
    setFlags((current) =>
      current.includes(flag) ? current.filter((f) => f !== flag) : [...current, flag],
    )
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="Regex Tester"
        description="Test regular expressions with live match highlighting and match counts."
      />

      <label className="block text-sm font-medium text-slate-700">
        Pattern
        <input
          value={pattern}
          onChange={(event) => setPattern(event.target.value)}
          placeholder="e.g. \\w+@\\w+\\.\\w+"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {flagOptions.map((flag) => (
          <button
            key={flag}
            type="button"
            onClick={() => toggleFlag(flag)}
            className={`rounded-lg border px-3 py-1.5 font-mono text-sm transition-all ${
              flags.includes(flag)
                ? 'border-brand-300 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {flag}
          </button>
        ))}
      </div>

      <TextAreaField
        label="Test string"
        value={text}
        onChange={setText}
        placeholder="Paste text to test against your regex…"
      />

      {result.error && <p className="text-sm text-red-600">{result.error}</p>}

      {!result.error && pattern && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-medium text-slate-700">
            {result.matches.length} match{result.matches.length === 1 ? '' : 'es'}
          </p>
          <div
            className="min-h-24 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-mono text-sm text-slate-800"
            dangerouslySetInnerHTML={{ __html: result.html || '<span class="text-slate-400">No matches yet</span>' }}
          />
        </div>
      )}
    </div>
  )
}
