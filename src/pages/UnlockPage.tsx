import { useState } from 'react'
import { Download, Loader2, Unlock } from 'lucide-react'
import { FileDropzone } from '@/components/ui/FileDropzone'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { PdfViewer } from '@/components/viewer/PdfViewer'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { ToolShell } from '@/components/layout/ToolShell'
import { downloadBytes } from '@/lib/download'
import { formatFileSize, PdfValidationError, readFileAsArrayBuffer } from '@/lib/pdf/fileValidation'
import { isPdfEncrypted, unlockPdf, unlockedFilename } from '@/lib/pdf/pdfUnlock'
import { SEO, usePageSeo } from '@/lib/seo'

export function UnlockPage() {
  usePageSeo(SEO.unlock)
  const [file, setFile] = useState<File | null>(null)
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null)
  const [encrypted, setEncrypted] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<ArrayBuffer | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadFile = async (files: File[]) => {
    const selected = files[0]
    if (!selected) return

    setError(null)
    setSuccess(null)
    setResult(null)
    setPassword('')

    try {
      const data = await readFileAsArrayBuffer(selected)
      const isEncrypted = await isPdfEncrypted(data)
      setFile(selected)
      setBuffer(data)
      setEncrypted(isEncrypted)
    } catch (fileError) {
      setFile(null)
      setBuffer(null)
      setEncrypted(null)
      setError(
        fileError instanceof PdfValidationError || fileError instanceof Error
          ? fileError.message
          : 'Could not load PDF.',
      )
    }
  }

  const handleUnlock = async () => {
    if (!buffer || !file) {
      setError('Upload a PDF first.')
      return
    }

    setProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      if (encrypted === false) {
        setResult(buffer.slice(0))
        setSuccess('This PDF is not password protected. You can download it below.')
        return
      }

      const unlocked = await unlockPdf(buffer, password || undefined)
      const copy = unlocked.buffer.slice(unlocked.byteOffset, unlocked.byteOffset + unlocked.byteLength)
      setResult(copy)
      setSuccess('PDF unlocked successfully. Download your file below.')
    } catch (unlockError) {
      setResult(null)
      setError(
        unlockError instanceof Error
          ? unlockError.message
          : 'Could not unlock PDF. Try entering the correct password.',
      )
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!result || !file) return
    downloadBytes(new Uint8Array(result), unlockedFilename(file.name))
  }

  return (
    <ToolShell width="full">
      <ToolPageHeader
        category="PDF Tools"
        title="Unlock PDF Online Free"
        description="Remove PDF password protection and restrictions. Enter the open password if needed — files stay in your browser."
      />

      <FileDropzone
        label="Upload a protected PDF"
        hint="Drop a file or click to browse"
        onFiles={(files) => void loadFile(files)}
      />

      {file && (
        <Alert variant="info">
          Loaded <strong>{file.name}</strong> ({formatFileSize(file.size)})
          {encrypted === false && ' — no encryption detected'}
          {encrypted === true && ' — password or restrictions detected'}
        </Alert>
      )}

      {encrypted && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="block text-sm font-medium text-slate-900">
            PDF password <span className="font-normal text-slate-500">(if required to open)</span>
          </label>
          <p className="mt-1 text-sm text-slate-500">
            Leave blank for owner-restricted PDFs (printing/copying disabled). Enter the password if
            the file asks for one when opening.
          </p>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Optional open password"
            autoComplete="off"
            className="mt-3 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="flex flex-wrap gap-3">
        <Button disabled={!buffer || processing} onClick={() => void handleUnlock()}>
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Unlocking…
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4" />
              Unlock PDF
            </>
          )}
        </Button>
        {result && (
          <Button variant="secondary" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download unlocked PDF
          </Button>
        )}
      </div>

      {result && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Preview</h2>
          <PdfViewer data={result} />
        </section>
      )}
    </ToolShell>
  )
}
