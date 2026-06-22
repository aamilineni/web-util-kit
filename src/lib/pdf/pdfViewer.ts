import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export { pdfjs }

export async function loadPdfDocument(data: ArrayBuffer) {
  const copy = data.slice(0)
  const task = pdfjs.getDocument({ data: copy })
  return task.promise
}

export async function renderPageToCanvas(
  page: pdfjs.PDFPageProxy,
  canvas: HTMLCanvasElement,
  scale: number,
) {
  const viewport = page.getViewport({ scale })
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not get canvas context')

  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({
    canvasContext: context,
    viewport,
    canvas,
  }).promise
}
