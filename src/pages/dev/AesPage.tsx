import { useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { CopyButton } from '@/components/ui/CopyButton'
import { decryptAes, encryptAes } from '@/lib/tools/aes'
import { SEO, usePageSeo } from '@/lib/seo'

type Mode = 'encrypt' | 'decrypt'

export function AesPage() {
  usePageSeo(SEO.aes)
  const [mode, setMode] = useState<Mode>('encrypt')
  const [passphrase, setPassphrase] = useState('')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const run = async () => {
    setError(null)
    setProcessing(true)
    try {
      const result =
        mode === 'encrypt'
          ? await encryptAes(input, passphrase)
          : await decryptAes(input, passphrase)
      setOutput(result)
    } catch (err) {
      setOutput('')
      setError(err instanceof Error ? err.message : 'AES operation failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="AES Encryption / Decryption"
        description="Encrypt and decrypt text with AES-256-GCM and a passphrase. Keys are derived with PBKDF2 — all in your browser."
      />

      <Alert variant="info">
        Uses AES-256-GCM with PBKDF2 key derivation. Save the full encrypted JSON output to
        decrypt later. Never share your passphrase.
      </Alert>

      <div className="flex gap-2">
        {(['encrypt', 'decrypt'] as Mode[]).map((value) => (
          <Button
            key={value}
            variant={mode === value ? 'primary' : 'secondary'}
            onClick={() => setMode(value)}
          >
            {value === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </Button>
        ))}
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Passphrase
        <input
          type="password"
          value={passphrase}
          onChange={(event) => setPassphrase(event.target.value)}
          placeholder="Enter a strong passphrase"
          className="mt-1 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <TextAreaField
        label={mode === 'encrypt' ? 'Plain text' : 'Encrypted JSON payload'}
        value={input}
        onChange={setInput}
        placeholder={
          mode === 'encrypt'
            ? 'Text to encrypt…'
            : 'Paste encrypted JSON from this tool…'
        }
      />

      <Button disabled={processing} onClick={() => void run()}>
        {processing ? 'Processing…' : mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </Button>

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
