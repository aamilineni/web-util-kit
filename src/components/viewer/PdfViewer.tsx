import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { loadPdfDocument, renderPageToCanvas } from '@/lib/pdf/pdfViewer'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

type PdfViewerProps = {
  data: ArrayBuffer | null
  className?: string
}

export function PdfViewer({ data, className = '' }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [thumbnails, setThumbnails] = useState<string[]>([])

  useEffect(() => {
    if (!data) {
      setPageCount(0)
      setCurrentPage(1)
      setThumbnails([])
      setError(null)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const document = await loadPdfDocument(data!)
        if (cancelled) return

        setPageCount(document.numPages)
        setCurrentPage(1)

        const thumbUrls: string[] = []
        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
          const page = await document.getPage(pageNumber)
          const viewport = page.getViewport({ scale: 0.2 })
          const canvas = window.document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const context = canvas.getContext('2d')
          if (!context) continue

          await page.render({
            canvasContext: context,
            viewport,
            canvas,
          }).promise

          thumbUrls.push(canvas.toDataURL())
        }

        if (!cancelled) {
          setThumbnails(thumbUrls)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : 'Failed to load PDF.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [data])

  useEffect(() => {
    if (!data || pageCount === 0) return

    let cancelled = false

    async function renderCurrentPage() {
      setLoading(true)
      try {
        const document = await loadPdfDocument(data!)
        const page = await document.getPage(currentPage)
        const canvas = canvasRef.current
        if (!canvas || cancelled) return
        await renderPageToCanvas(page, canvas, scale)
      } catch (renderError) {
        if (!cancelled) {
          setError(
            renderError instanceof Error ? renderError.message : 'Failed to render page.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void renderCurrentPage()

    return () => {
      cancelled = true
    }
  }, [data, currentPage, scale, pageCount])

  if (!data) {
    return (
      <div
        className={`flex min-h-80 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 text-sm text-slate-500 ${className}`}
      >
        Upload a PDF to preview it here.
      </div>
    )
  }

  return (
    <div className={`grid gap-3 sm:gap-4 xl:grid-cols-[minmax(120px,160px)_1fr] 2xl:grid-cols-[minmax(140px,180px)_1fr] ${className}`}>
      <aside className="hidden max-h-[min(75vh,720px)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 xl:block">
        <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          Pages
        </p>
        <div className="space-y-2">
          {thumbnails.map((thumb, index) => {
            const pageNumber = index + 1
            const isActive = pageNumber === currentPage
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`block w-full rounded-lg border p-1 text-left transition-colors ${
                  isActive
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <img src={thumb} alt={`Page ${pageNumber}`} className="w-full rounded" />
                <span className="mt-1 block text-center text-xs text-slate-500">
                  {pageNumber}
                </span>
              </button>
            )
          })}
        </div>
      </aside>

      <div className="flex min-h-80 flex-col rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1 || loading}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {pageCount || '—'}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= pageCount || loading}
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale((value) => Math.max(0.5, value - 0.2))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-sm text-slate-600">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale((value) => Math.min(3, value + 0.2))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative flex flex-1 items-start justify-center overflow-auto bg-slate-100 p-4">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
              <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            </div>
          )}
          {error ? (
            <Alert variant="error">{error}</Alert>
          ) : (
            <canvas ref={canvasRef} className="max-w-full shadow-md" />
          )}
        </div>
      </div>
    </div>
  )
}
