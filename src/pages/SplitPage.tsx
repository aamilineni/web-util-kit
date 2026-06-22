import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { FileDropzone } from '@/components/ui/FileDropzone'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { PdfViewer } from '@/components/viewer/PdfViewer'
import { downloadBytes, sanitizeFilename, splitFilename } from '@/lib/download'
import { PdfValidationError, readFileAsArrayBuffer } from '@/lib/pdf/fileValidation'
import { parsePageSelection } from '@/lib/pdf/pdfOperations'
import { getPageCountInWorker, splitPdfInWorker } from '@/lib/pdf/pdfWorkerClient'
import { SEO, usePageSeo } from '@/lib/seo'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'

type SplitMode = 'range' | 'every-n' | 'extract'

export function SplitPage() {
  usePageSeo(SEO.split)
  const [file, setFile] = useState<File | null>(null)
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [mode, setMode] = useState<SplitMode>('range')
  const [rangeStart, setRangeStart] = useState(1)
  const [rangeEnd, setRangeEnd] = useState(1)
  const [pagesPerFile, setPagesPerFile] = useState(1)
  const [pageSelection, setPageSelection] = useState('')
  const [results, setResults] = useState<Uint8Array[]>([])
  const [preview, setPreview] = useState<ArrayBuffer | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadFile = async (files: File[]) => {
    const selected = files[0]
    if (!selected) return

    setError(null)
    setSuccess(null)
    setResults([])
    setPreview(null)

    try {
      const data = await readFileAsArrayBuffer(selected)
      const count = await getPageCountInWorker(data)
      setFile(selected)
      setBuffer(data)
      setPageCount(count)
      setRangeStart(1)
      setRangeEnd(count)
      setPagesPerFile(1)
      setPageSelection('')
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

  const handleSplit = async () => {
    if (!buffer || !file) {
      setError('Upload a PDF first.')
      return
    }

    setProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      let outputs: Uint8Array[]

      if (mode === 'range') {
        outputs = await splitPdfInWorker(buffer, {
          mode: 'range',
          start: rangeStart,
          end: rangeEnd,
        })
      } else if (mode === 'every-n') {
        outputs = await splitPdfInWorker(buffer, {
          mode: 'every-n',
          pagesPerFile,
        })
      } else {
        const pages = parsePageSelection(pageSelection, pageCount)
        outputs = await splitPdfInWorker(buffer, { mode: 'extract', pages })
      }

      setResults(outputs)
      const first = outputs[0]
      if (first) {
        setPreview(first.buffer.slice(first.byteOffset, first.byteOffset + first.byteLength))
      }
      setSuccess(
        outputs.length === 1
          ? 'Split complete. Your PDF is ready to download.'
          : `Created ${outputs.length} PDF files. Download each below.`,
      )
    } catch (splitError) {
      setError(splitError instanceof Error ? splitError.message : 'Split failed.')
    } finally {
      setProcessing(false)
    }
  }

  const downloadAll = () => {
    if (!file) return
    const baseName = sanitizeFilename(file.name)
    results.forEach((bytes, index) => {
      downloadBytes(bytes, splitFilename(baseName, index, results.length))
    })
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="PDF Tools"
        title="Split PDF Online Free"
        description="Extract pages by range, split every N pages, or pick specific pages. Private and free."
      />

      <FileDropzone
        label="Upload a PDF to split"
        hint="One file at a time"
        onFiles={(files) => void loadFile(files)}
      />

      {file && (
        <Alert variant="info">
          Loaded <strong>{file.name}</strong> — {pageCount} page{pageCount === 1 ? '' : 's'}
        </Alert>
      )}

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {buffer && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <fieldset className="space-y-4">
            <legend className="text-sm font-medium text-slate-900">Split mode</legend>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
              <input
                type="radio"
                name="split-mode"
                checked={mode === 'range'}
                onChange={() => setMode('range')}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-slate-800">Page range</span>
                <span className="text-sm text-slate-500">Extract a continuous range of pages.</span>
              </span>
            </label>

            {mode === 'range' && (
              <div className="ml-7 flex flex-wrap gap-3">
                <label className="text-sm text-slate-600">
                  From
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={rangeStart}
                    onChange={(event) => setRangeStart(Number(event.target.value))}
                    className="ml-2 w-20 rounded-lg border border-slate-300 px-2 py-1"
                  />
                </label>
                <label className="text-sm text-slate-600">
                  To
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={rangeEnd}
                    onChange={(event) => setRangeEnd(Number(event.target.value))}
                    className="ml-2 w-20 rounded-lg border border-slate-300 px-2 py-1"
                  />
                </label>
              </div>
            )}

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
              <input
                type="radio"
                name="split-mode"
                checked={mode === 'every-n'}
                onChange={() => setMode('every-n')}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-slate-800">Every N pages</span>
                <span className="text-sm text-slate-500">
                  Split into multiple files with a fixed page count.
                </span>
              </span>
            </label>

            {mode === 'every-n' && (
              <label className="ml-7 text-sm text-slate-600">
                Pages per file
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={pagesPerFile}
                  onChange={(event) => setPagesPerFile(Number(event.target.value))}
                  className="ml-2 w-20 rounded-lg border border-slate-300 px-2 py-1"
                />
              </label>
            )}

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
              <input
                type="radio"
                name="split-mode"
                checked={mode === 'extract'}
                onChange={() => setMode('extract')}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-slate-800">Extract selected pages</span>
                <span className="text-sm text-slate-500">
                  Use commas and ranges, e.g. 1, 3, 5-8
                </span>
              </span>
            </label>

            {mode === 'extract' && (
              <div className="ml-7">
                <input
                  type="text"
                  value={pageSelection}
                  onChange={(event) => setPageSelection(event.target.value)}
                  placeholder="1, 3, 5-8"
                  className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            )}
          </fieldset>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button disabled={!buffer || processing} onClick={() => void handleSplit()}>
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Splitting…
            </>
          ) : (
            'Split PDF'
          )}
        </Button>

        {results.length > 0 && (
          <Button variant="secondary" onClick={downloadAll}>
            <Download className="h-4 w-4" />
            Download {results.length === 1 ? 'PDF' : `all ${results.length} PDFs`}
          </Button>
        )}
      </div>

      {results.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {results.map((bytes, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() =>
                downloadBytes(
                  bytes,
                  splitFilename(sanitizeFilename(file?.name ?? 'document.pdf'), index, results.length),
                )
              }
            >
              Download part {index + 1}
            </Button>
          ))}
        </div>
      )}

      {preview && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Preview</h2>
          <PdfViewer data={preview} />
        </section>
      )}
    </div>
  )
}
