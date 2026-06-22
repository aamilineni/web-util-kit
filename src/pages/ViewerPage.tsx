import { useState } from 'react'
import { Download } from 'lucide-react'
import { FileDropzone } from '@/components/ui/FileDropzone'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { PdfViewer } from '@/components/viewer/PdfViewer'
import { downloadBytes, sanitizeFilename } from '@/lib/download'
import { formatFileSize, PdfValidationError, readFileAsArrayBuffer } from '@/lib/pdf/fileValidation'
import { SEO, usePageSeo } from '@/lib/seo'
import { ToolPageHeader } from '@/components/tools/ToolPageHeader'

export function ViewerPage() {
  usePageSeo(SEO.view)
  const [file, setFile] = useState<File | null>(null)
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadFile = async (files: File[]) => {
    const selected = files[0]
    if (!selected) return

    setError(null)

    try {
      const data = await readFileAsArrayBuffer(selected)
      setFile(selected)
      setBuffer(data)
    } catch (fileError) {
      setFile(null)
      setBuffer(null)
      setError(
        fileError instanceof PdfValidationError || fileError instanceof Error
          ? fileError.message
          : 'Could not load PDF.',
      )
    }
  }

  const handleDownload = () => {
    if (!buffer || !file) return
    downloadBytes(new Uint8Array(buffer), sanitizeFilename(file.name))
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        category="PDF Tools"
        title="View PDF Online Free"
        description="Open and read PDF files with zoom, page navigation, and thumbnails. No upload needed."
      />

      <FileDropzone
        label="Open a PDF"
        hint="Drop a file or click to browse"
        onFiles={(files) => void loadFile(files)}
      />

      {error && <Alert variant="error">{error}</Alert>}

      {file && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Viewing <span className="font-medium text-slate-800">{file.name}</span> (
            {formatFileSize(file.size)})
          </p>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      )}

      <PdfViewer data={buffer} />
    </div>
  )
}
