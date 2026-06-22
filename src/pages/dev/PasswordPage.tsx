import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { Button } from '@/components/ui/Button'
import { CopyButton } from '@/components/ui/CopyButton'
import { generatePassword, passwordStrength, type PasswordOptions } from '@/lib/tools/password'
import { SEO, usePageSeo } from '@/lib/seo'

export function PasswordPage() {
  usePageSeo(SEO.password)
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    lowercase: true,
    uppercase: true,
    digits: true,
    symbols: true,
  })
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)

  const strength = useMemo(
    () => (password ? passwordStrength(password) : null),
    [password],
  )

  const generate = () => {
    setError(null)
    setSpinning(true)
    window.setTimeout(() => setSpinning(false), 300)
    try {
      setPassword(generatePassword(options))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate password.')
    }
  }

  const toggle = (key: keyof Omit<PasswordOptions, 'length'>) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Everyday Tools"
        title="Password Generator"
        description="Create strong random passwords with customizable length and character sets."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <label className="block text-sm font-medium text-slate-700">
          Length: {options.length}
          <input
            type="range"
            min={4}
            max={128}
            value={options.length}
            onChange={(event) =>
              setOptions((current) => ({ ...current, length: Number(event.target.value) }))
            }
            className="mt-2 w-full accent-brand-600"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ['lowercase', 'a-z'],
              ['uppercase', 'A-Z'],
              ['digits', '0-9'],
              ['symbols', '!@#'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                options[key]
                  ? 'border-brand-300 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Button className="mt-4" onClick={generate}>
          <RefreshCw className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} />
          Generate password
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {password && (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <code className="break-all font-mono text-lg text-slate-900">{password}</code>
            <CopyButton text={password} />
          </div>
          {strength && (
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Strength</span>
                <span>{strength.label}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
