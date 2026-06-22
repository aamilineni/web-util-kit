import { PDFDocument } from 'pdf-lib'

export async function mergePdfs(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  if (buffers.length === 0) {
    throw new Error('Add at least one PDF to merge.')
  }

  const merged = await PDFDocument.create()

  for (const buffer of buffers) {
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const copiedPages = await merged.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => merged.addPage(page))
  }

  return merged.save()
}

export type SplitMode = 'range' | 'every-n' | 'extract'

export type SplitOptions =
  | { mode: 'range'; start: number; end: number }
  | { mode: 'every-n'; pagesPerFile: number }
  | { mode: 'extract'; pages: number[] }

function parsePageNumbers(input: string, totalPages: number): number[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  const pages = new Set<number>()

  for (const part of trimmed.split(',')) {
    const segment = part.trim()
    if (!segment) continue

    if (segment.includes('-')) {
      const [startRaw, endRaw] = segment.split('-').map((value) => value.trim())
      const start = Number(startRaw)
      const end = Number(endRaw)

      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error(`Invalid page range "${segment}".`)
      }
      if (start < 1 || end < 1 || start > totalPages || end > totalPages) {
        throw new Error(`Range "${segment}" is outside 1–${totalPages}.`)
      }
      if (start > end) {
        throw new Error(`Range "${segment}" has start greater than end.`)
      }

      for (let page = start; page <= end; page += 1) {
        pages.add(page)
      }
      continue
    }

    const page = Number(segment)
    if (!Number.isInteger(page)) {
      throw new Error(`Invalid page number "${segment}".`)
    }
    if (page < 1 || page > totalPages) {
      throw new Error(`Page ${page} is outside 1–${totalPages}.`)
    }
    pages.add(page)
  }

  return [...pages].sort((a, b) => a - b)
}

async function extractPages(source: ArrayBuffer, pageNumbers: number[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(source, { ignoreEncryption: true })
  const target = await PDFDocument.create()
  const indices = pageNumbers.map((page) => page - 1)
  const copied = await target.copyPages(pdf, indices)
  copied.forEach((page) => target.addPage(page))
  return target.save()
}

export async function splitPdf(source: ArrayBuffer, options: SplitOptions): Promise<Uint8Array[]> {
  const pdf = await PDFDocument.load(source, { ignoreEncryption: true })
  const totalPages = pdf.getPageCount()

  if (totalPages === 0) {
    throw new Error('This PDF has no pages.')
  }

  if (options.mode === 'range') {
    const { start, end } = options
    if (start < 1 || end < 1 || start > totalPages || end > totalPages) {
      throw new Error(`Range must be between 1 and ${totalPages}.`)
    }
    if (start > end) {
      throw new Error('Start page must be less than or equal to end page.')
    }

    const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index)
    return [await extractPages(source, pages)]
  }

  if (options.mode === 'every-n') {
    const { pagesPerFile } = options
    if (!Number.isInteger(pagesPerFile) || pagesPerFile < 1) {
      throw new Error('Pages per file must be at least 1.')
    }

    const outputs: Uint8Array[] = []
    for (let start = 1; start <= totalPages; start += pagesPerFile) {
      const end = Math.min(start + pagesPerFile - 1, totalPages)
      const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index)
      outputs.push(await extractPages(source, pages))
    }
    return outputs
  }

  const pages = options.pages
  if (pages.length === 0) {
    throw new Error('Select at least one page to extract.')
  }

  for (const page of pages) {
    if (page < 1 || page > totalPages) {
      throw new Error(`Page ${page} is outside 1–${totalPages}.`)
    }
  }

  return [await extractPages(source, pages)]
}

export function parsePageSelection(input: string, totalPages: number) {
  return parsePageNumbers(input, totalPages)
}

export async function getPageCount(source: ArrayBuffer) {
  const pdf = await PDFDocument.load(source, { ignoreEncryption: true })
  return pdf.getPageCount()
}
