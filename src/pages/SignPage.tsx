import { useCallback, useRef, useState } from 'react'
import { Download, Loader2, Upload } from 'lucide-react'
import { FileDropzone } from '@/components/ui/FileDropzone'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { PdfViewer } from '@/components/viewer/PdfViewer'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { ToolShell } from '@/components/layout/ToolShell'
import { SignaturePad, exportSignaturePng } from '@/components/signature/SignaturePad'
import { downloadBytes, sanitizeFilename } from '@/lib/download'
import { PdfValidationError, readFileAsArrayBuffer } from '@/lib/pdf/fileValidation'
import { getPageCountInWorker } from '@/lib/pdf/pdfWorkerClient'
import {
  addVisualSignature,
  defaultBottomRightPlacement,
  getPdfPageSize,
  signWithCertificate,
  type PageTarget,
} from '@/lib/pdf/pdfSign'
import { SEO, usePageSeo } from '@/lib/seo'

type SignMode = 'visual' | 'certificate'
type PlacementPreset = 'bottom-right' | 'bottom-left' | 'custom'

function signedFilename(name: string) {
  const stem = sanitizeFilename(name).replace(/\.pdf$/i, '')
  return `${stem}_signed.pdf`
}

export function SignPage() {
  usePageSeo(SEO.sign)
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<SignMode>('visual')
  const [file, setFile] = useState<File | null>(null)
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false)
  const [uploadedSignature, setUploadedSignature] = useState<Uint8Array | null>(null)
  const [pageSelection, setPageSelection] = useState<'last' | 'all' | 'specific'>('last')
  const [specificPage, setSpecificPage] = useState(1)
  const [placementPreset, setPlacementPreset] = useState<PlacementPreset>('bottom-right')
  const [customX, setCustomX] = useState(36)
  const [customY, setCustomY] = useState(36)
  const [signatureWidth, setSignatureWidth] = useState(150)
  const [signerName, setSignerName] = useState('')
  const [includeDate, setIncludeDate] = useState(true)
  const [p12File, setP12File] = useState<File | null>(null)
  const [p12Buffer, setP12Buffer] = useState<ArrayBuffer | null>(null)
  const [passphrase, setPassphrase] = useState('')
  const [certName, setCertName] = useState('')
  const [certReason, setCertReason] = useState('Document signed')
  const [certLocation, setCertLocation] = useState('')
  const [result, setResult] = useState<ArrayBuffer | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadPdf = async (files: File[]) => {
    const selected = files[0]
    if (!selected) return

    setError(null)
    setSuccess(null)
    setResult(null)

    try {
      const data = await readFileAsArrayBuffer(selected)
      const count = await getPageCountInWorker(data)
      setFile(selected)
      setBuffer(data)
      setPageCount(count)
      setSpecificPage(count)
      setPageSelection('last')
    } catch (fileError) {
      setFile(null)
      setBuffer(null)
      setPageCount(0)
      setError(
        fileError instanceof PdfValidationError || fileError instanceof Error
          ? fileError.message
          : 'Could not load PDF.',
      )
    }
  }

  const loadSignatureImage = async (files: File[]) => {
    const selected = files[0]
    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      setError('Upload a PNG or JPG signature image.')
      return
    }

    try {
      const data = await selected.arrayBuffer()
      setUploadedSignature(new Uint8Array(data))
      setHasDrawnSignature(false)
      setError(null)
    } catch {
      setError('Could not read signature image.')
    }
  }

  const loadCertificate = async (files: File[]) => {
    const selected = files[0]
    if (!selected) return

    const lower = selected.name.toLowerCase()
    if (!lower.endsWith('.p12') && !lower.endsWith('.pfx')) {
      setError('Upload a .p12 or .pfx certificate file.')
      return
    }

    try {
      const data = await selected.arrayBuffer()
      setP12File(selected)
      setP12Buffer(data)
      setError(null)
    } catch {
      setError('Could not read certificate file.')
    }
  }

  const resolvePlacement = useCallback(async () => {
    if (!buffer) throw new Error('Upload a PDF first.')

    const { width: pageWidth } = await getPdfPageSize(buffer, 0)

    if (placementPreset === 'bottom-right') {
      return defaultBottomRightPlacement(pageWidth, signatureWidth)
    }
    if (placementPreset === 'bottom-left') {
      return { x: 36, y: 36, width: signatureWidth }
    }
    return { x: customX, y: customY, width: signatureWidth }
  }, [buffer, customX, customY, placementPreset, signatureWidth])

  const resolveSignaturePng = async () => {
    if (uploadedSignature) return uploadedSignature

    const canvas = signatureCanvasRef.current
    if (!canvas || !hasDrawnSignature) {
      throw new Error('Draw a signature or upload an image.')
    }
    return exportSignaturePng(canvas)
  }

  const handleVisualSign = async () => {
    if (!buffer || !file) {
      setError('Upload a PDF first.')
      return
    }

    setProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      const signaturePng = await resolveSignaturePng()
      const placement = await resolvePlacement()
      const target: PageTarget =
        pageSelection === 'specific' ? specificPage : pageSelection === 'all' ? 'all' : 'last'

      const signed = await addVisualSignature(buffer, {
        signaturePng,
        pageTarget: target,
        placement,
        signerName: signerName.trim() || undefined,
        includeDate,
      })

      const copy = signed.buffer.slice(signed.byteOffset, signed.byteOffset + signed.byteLength)
      setResult(copy)
      setSuccess('Signature added. Download your signed PDF below.')
    } catch (signError) {
      setError(signError instanceof Error ? signError.message : 'Signing failed.')
    } finally {
      setProcessing(false)
    }
  }

  const handleCertificateSign = async () => {
    if (!buffer || !file) {
      setError('Upload a PDF first.')
      return
    }
    if (!p12Buffer) {
      setError('Upload a .p12 or .pfx certificate.')
      return
    }
    if (!passphrase) {
      setError('Enter the certificate passphrase.')
      return
    }

    setProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      const signed = await signWithCertificate(buffer, {
        p12Buffer,
        passphrase,
        name: certName.trim() || undefined,
        reason: certReason.trim() || undefined,
        location: certLocation.trim() || undefined,
      })

      const copy = signed.buffer.slice(signed.byteOffset, signed.byteOffset + signed.byteLength)
      setResult(copy)
      setSuccess('PDF digitally signed. Download your signed PDF below.')
    } catch (signError) {
      setError(signError instanceof Error ? signError.message : 'Certificate signing failed.')
    } finally {
      setProcessing(false)
    }
  }

  const handleSign = () => {
    if (mode === 'visual') {
      void handleVisualSign()
    } else {
      void handleCertificateSign()
    }
  }

  const handleDownload = () => {
    if (!result || !file) return
    downloadBytes(new Uint8Array(result), signedFilename(file.name))
  }

  return (
    <ToolShell width="full">
      <ToolPageHeader
        category="PDF Tools"
        title="Sign PDF Online Free"
        description="Add a drawn signature or sign with a digital certificate (.p12). Private — files never leave your browser."
      />

      <SegmentedControl
        options={[
          { value: 'visual', label: 'Draw signature' },
          { value: 'certificate', label: 'Digital certificate' },
        ]}
        value={mode}
        onChange={setMode}
      />

      <FileDropzone
        label="Upload PDF to sign"
        hint="One file at a time"
        onFiles={(files) => void loadPdf(files)}
      />

      {file && (
        <Alert variant="info">
          Loaded <strong>{file.name}</strong> — {pageCount} page{pageCount === 1 ? '' : 's'}
        </Alert>
      )}

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {mode === 'visual' && buffer && (
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-4">
          <section className="space-y-3">
            <h2 className="font-medium text-slate-900">Your signature</h2>
            <SignaturePad
              ref={signatureCanvasRef}
              onChange={(hasSignature) => {
                setHasDrawnSignature(hasSignature)
                if (hasSignature) setUploadedSignature(null)
              }}
            />
            <div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800">
                <Upload className="h-4 w-4" />
                Or upload signature image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const files = event.target.files ? [...event.target.files] : []
                    void loadSignatureImage(files)
                    event.target.value = ''
                  }}
                />
              </label>
              {uploadedSignature && (
                <p className="mt-1 text-sm text-slate-500">Using uploaded signature image.</p>
              )}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-700">
              Signer name <span className="text-slate-400">(optional)</span>
              <input
                type="text"
                value={signerName}
                onChange={(event) => setSignerName(event.target.value)}
                placeholder="Jane Doe"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={includeDate}
                onChange={(event) => setIncludeDate(event.target.checked)}
                className="rounded border-slate-300"
              />
              Include signing date
            </label>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-slate-900">Pages</h3>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="page-target"
                  checked={pageSelection === 'last'}
                  onChange={() => setPageSelection('last')}
                />
                Last page
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="page-target"
                  checked={pageSelection === 'all'}
                  onChange={() => setPageSelection('all')}
                />
                All pages
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="page-target"
                  checked={pageSelection === 'specific'}
                  onChange={() => setPageSelection('specific')}
                />
                Page
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={specificPage}
                  disabled={pageSelection !== 'specific'}
                  onChange={(event) => setSpecificPage(Number(event.target.value))}
                  className="w-16 rounded-lg border border-slate-300 px-2 py-1"
                />
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-slate-900">Placement</h3>
            <SegmentedControl
              options={[
                { value: 'bottom-right', label: 'Bottom right' },
                { value: 'bottom-left', label: 'Bottom left' },
                { value: 'custom', label: 'Custom' },
              ]}
              value={placementPreset}
              onChange={setPlacementPreset}
            />
            <label className="block text-sm text-slate-700">
              Signature width (pt)
              <input
                type="number"
                min={60}
                max={400}
                value={signatureWidth}
                onChange={(event) => setSignatureWidth(Number(event.target.value))}
                className="mt-1 w-28 rounded-lg border border-slate-300 px-2 py-1"
              />
            </label>
            {placementPreset === 'custom' && (
              <div className="flex flex-wrap gap-3">
                <label className="text-sm text-slate-700">
                  X from left
                  <input
                    type="number"
                    min={0}
                    value={customX}
                    onChange={(event) => setCustomX(Number(event.target.value))}
                    className="ml-2 w-20 rounded-lg border border-slate-300 px-2 py-1"
                  />
                </label>
                <label className="text-sm text-slate-700">
                  Y from bottom
                  <input
                    type="number"
                    min={0}
                    value={customY}
                    onChange={(event) => setCustomY(Number(event.target.value))}
                    className="ml-2 w-20 rounded-lg border border-slate-300 px-2 py-1"
                  />
                </label>
              </div>
            )}
          </section>
        </div>
      )}

      {mode === 'certificate' && buffer && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <Alert variant="info">
            Signs the PDF with a PKCS#12 (.p12/.pfx) certificate. Your certificate and passphrase
            stay in your browser and are never uploaded.
          </Alert>

          <FileDropzone
            label="Upload certificate (.p12 / .pfx)"
            hint="Private key certificate file"
            onFiles={(files) => void loadCertificate(files)}
          />

          {p12File && (
            <p className="text-sm text-slate-600">
              Certificate: <strong>{p12File.name}</strong>
            </p>
          )}

          <label className="block text-sm text-slate-700">
            Certificate passphrase
            <input
              type="password"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              className="mt-1 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm"
              autoComplete="off"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-700">
              Signer name
              <input
                type="text"
                value={certName}
                onChange={(event) => setCertName(event.target.value)}
                placeholder="From certificate if empty"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm text-slate-700">
              Location <span className="text-slate-400">(optional)</span>
              <input
                type="text"
                value={certLocation}
                onChange={(event) => setCertLocation(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <label className="block text-sm text-slate-700">
            Reason
            <input
              type="text"
              value={certReason}
              onChange={(event) => setCertReason(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button disabled={!buffer || processing} onClick={handleSign}>
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing…
            </>
          ) : mode === 'visual' ? (
            'Add signature'
          ) : (
            'Sign with certificate'
          )}
        </Button>
        {result && (
          <Button variant="secondary" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download signed PDF
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
