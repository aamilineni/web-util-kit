import { useMemo, useState } from 'react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { Alert } from '@/components/ui/Alert'
import { decodeJwt, formatJwtJson } from '@/lib/tools/jwt'
import { SEO, usePageSeo } from '@/lib/seo'

export function JwtPage() {
  usePageSeo(SEO.jwt)
  const [token, setToken] = useState('')

  const { decoded, error } = useMemo(() => {
    if (!token.trim()) return { decoded: null, error: null }
    try {
      return { decoded: decodeJwt(token), error: null }
    } catch (err) {
      return {
        decoded: null,
        error: err instanceof Error ? err.message : 'Could not decode JWT.',
      }
    }
  }, [token])

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Developer Tools"
        title="JWT Decoder / Viewer"
        description="Paste a JWT to instantly inspect header, payload, signature, and expiry."
      />

      <Alert variant="info">
        Decodes for inspection only — does not verify signatures.
      </Alert>

      <TextAreaField
        label="JWT token"
        value={token}
        onChange={setToken}
        placeholder="Paste your JWT (with or without Bearer prefix)…"
        rows={4}
      />

      {error && <Alert variant="error">{error}</Alert>}

      {decoded && (
        <div className="space-y-4 animate-fade-in">
          {decoded.expiresAt && (
            <Alert variant={decoded.isExpired ? 'error' : 'success'}>
              {decoded.isExpired ? 'Token expired' : 'Token valid'} — exp: {decoded.expiresAt}
            </Alert>
          )}

          <TextAreaField
            label="Header"
            value={formatJwtJson(decoded.header)}
            onChange={() => {}}
            readOnly
            rows={6}
          />
          <TextAreaField
            label="Payload"
            value={formatJwtJson(decoded.payload)}
            onChange={() => {}}
            readOnly
            rows={10}
          />
          <label className="block text-sm font-medium text-slate-700">
            Signature
            <input
              readOnly
              value={decoded.signature}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs"
            />
          </label>
        </div>
      )}
    </div>
  )
}
