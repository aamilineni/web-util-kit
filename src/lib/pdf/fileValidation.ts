const MAX_FILE_SIZE = 100 * 1024 * 1024

export class PdfValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PdfValidationError'
  }
}

export function validatePdfFile(file: File) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new PdfValidationError(`"${file.name}" is not a PDF file.`)
  }

  if (file.size === 0) {
    throw new PdfValidationError(`"${file.name}" is empty.`)
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new PdfValidationError(
      `"${file.name}" exceeds the 100 MB limit. Try a smaller file.`,
    )
  }
}

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  validatePdfFile(file)
  return file.arrayBuffer()
}

export async function readFilesAsArrayBuffers(files: File[]): Promise<ArrayBuffer[]> {
  return Promise.all(files.map(readFileAsArrayBuffer))
}

export function formatFileSize(bytes: number) {
  if (bytes < 1000) return `${bytes} B`
  if (bytes < 1000 * 1000) return `${(bytes / 1000).toFixed(1)} KB`
  return `${(bytes / (1000 * 1000)).toFixed(1)} MB`
}
