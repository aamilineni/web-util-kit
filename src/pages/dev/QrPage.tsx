import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { TextAreaField } from '@/components/ui/TextAreaField'
import { Button } from '@/components/ui/Button'
import { downloadQrDataUrl, generateQrDataUrl } from '@/lib/tools/qr'
import { SEO, usePageSeo } from '@/lib/seo'

export function QrPage() {
  usePageSeo(SEO.qr)
  const [text, setText] = useState('https://snappdf.com')
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl('')
      return
    }

    const timer = window.setTimeout(() => {
      void generateQrDataUrl(text)
        .then(setDataUrl)
        .catch((err) => {
          setDataUrl('')
          setError(err instanceof Error ? err.message : 'Could not generate QR code.')
        })
    }, 300)

    return () => window.clearTimeout(timer)
  }, [text])

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="Everyday Tools"
        title="QR Code Generator"
        description="Create QR codes from text or URLs with a live preview. Download as PNG."
      />

      <TextAreaField
        label="Text or URL"
        value={text}
        onChange={(value) => {
          setError(null)
          setText(value)
        }}
        rows={3}
        placeholder="https://example.com"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {dataUrl && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6">
          <img
            src={dataUrl}
            alt="Generated QR code"
            className="h-56 w-56 rounded-xl border border-slate-100 shadow-sm transition-transform duration-300 hover:scale-105"
          />
          <Button variant="secondary" onClick={() => void downloadQrDataUrl(dataUrl)}>
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
        </div>
      )}
    </div>
  )
}
