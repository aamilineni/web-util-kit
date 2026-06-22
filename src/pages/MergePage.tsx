import { useCallback, useState } from 'react'
import { Download, GripVertical, Loader2, Trash2 } from 'lucide-react'
import { FileDropzone } from '@/components/ui/FileDropzone'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { PdfViewer } from '@/components/viewer/PdfViewer'
import { defaultMergedFilename, downloadBytes } from '@/lib/download'
import { formatFileSize, PdfValidationError, readFileAsArrayBuffer } from '@/lib/pdf/fileValidation'
import { mergePdfsInWorker } from '@/lib/pdf/pdfWorkerClient'
import { SEO, usePageSeo } from '@/lib/seo'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'
import { ToolShell } from '@/components/layout/ToolShell'

type MergeItem = {
  id: string
  file: File
  buffer: ArrayBuffer
}

export function MergePage() {
  usePageSeo(SEO.merge)
  const [items, setItems] = useState<MergeItem[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [result, setResult] = useState<ArrayBuffer | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const addFiles = useCallback(async (files: File[]) => {
    setError(null)
    setSuccess(null)
    setResult(null)

    const nextItems: MergeItem[] = []

    for (const file of files) {
      try {
        const buffer = await readFileAsArrayBuffer(file)
        nextItems.push({
          id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
          file,
          buffer,
        })
      } catch (fileError) {
        const message =
          fileError instanceof PdfValidationError
            ? fileError.message
            : `Could not read "${file.name}".`
        setError(message)
        return
      }
    }

    setItems((current) => [...current, ...nextItems])
  }, [])

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    setResult(null)
    setSuccess(null)
  }

  const reorder = (from: number, to: number) => {
    if (from === to) return
    setItems((current) => {
      const updated = [...current]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return updated
    })
    setResult(null)
    setSuccess(null)
  }

  const handleMerge = async () => {
    if (items.length === 0) {
      setError('Add at least one PDF to merge.')
      return
    }

    setProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      const merged = await mergePdfsInWorker(items.map((item) => item.buffer))
      const copy = merged.buffer.slice(merged.byteOffset, merged.byteOffset + merged.byteLength)
      setResult(copy)
      setSuccess(`Merged ${items.length} file${items.length === 1 ? '' : 's'} successfully.`)
    } catch (mergeError) {
      setError(mergeError instanceof Error ? mergeError.message : 'Merge failed.')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    downloadBytes(new Uint8Array(result), defaultMergedFilename())
  }

  return (
    <ToolShell width="full">
      <ToolPageHeader
        category="PDF Tools"
        title="Merge PDF Files Online Free"
        description="Combine multiple PDFs into one document. Drag to reorder — no upload, no signup."
      />

      <FileDropzone
        multiple
        label="Add PDF files to merge"
        hint="Drop multiple files or click to browse"
        onFiles={(files) => void addFiles(files)}
      />

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {items.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-medium text-slate-900">File order</h2>
            <p className="text-sm text-slate-500">Drag to reorder before merging.</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <li
                key={item.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) reorder(dragIndex, index)
                  setDragIndex(null)
                }}
                className="flex items-center gap-3 px-4 py-3"
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">{item.file.name}</p>
                  <p className="text-sm text-slate-500">{formatFileSize(item.file.size)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button disabled={items.length === 0 || processing} onClick={() => void handleMerge()}>
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Merging…
            </>
          ) : (
            'Merge PDFs'
          )}
        </Button>
        {result && (
          <Button variant="secondary" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download merged PDF
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
