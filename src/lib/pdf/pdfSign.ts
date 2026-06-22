import { Buffer } from 'buffer'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import signpdf from '@signpdf/signpdf'
import { plainAddPlaceholder } from '@signpdf/placeholder-plain'
import { P12Signer } from '@signpdf/signer-p12'

export type PageTarget = 'all' | 'last' | number

export type SignaturePlacement = {
  x: number
  y: number
  width: number
}

export type VisualSignOptions = {
  signaturePng: Uint8Array
  pageTarget: PageTarget
  placement: SignaturePlacement
  signerName?: string
  includeDate?: boolean
}

export type CertificateSignOptions = {
  p12Buffer: ArrayBuffer
  passphrase: string
  reason?: string
  name?: string
  location?: string
  contactInfo?: string
}

function isJpeg(bytes: Uint8Array) {
  return bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8
}

async function embedSignatureImage(pdf: PDFDocument, bytes: Uint8Array) {
  if (isJpeg(bytes)) {
    return pdf.embedJpg(bytes)
  }
  return pdf.embedPng(bytes)
}

export async function getPdfPageSize(source: ArrayBuffer, pageIndex = 0) {
  const pdf = await PDFDocument.load(source, { ignoreEncryption: true })
  const page = pdf.getPage(pageIndex)
  return page.getSize()
}

export function defaultBottomRightPlacement(
  pageWidth: number,
  signatureWidth = 150,
  margin = 36,
): SignaturePlacement {
  return {
    x: pageWidth - signatureWidth - margin,
    y: margin,
    width: signatureWidth,
  }
}

function resolvePageIndices(pageTarget: PageTarget, pageCount: number): number[] {
  if (pageTarget === 'all') {
    return Array.from({ length: pageCount }, (_, index) => index)
  }
  if (pageTarget === 'last') {
    return [pageCount - 1]
  }
  if (!Number.isInteger(pageTarget) || pageTarget < 1 || pageTarget > pageCount) {
    throw new Error(`Page ${pageTarget} is outside 1–${pageCount}.`)
  }
  return [pageTarget - 1]
}

export async function addVisualSignature(
  source: ArrayBuffer,
  options: VisualSignOptions,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(source, { ignoreEncryption: true })
  const pageCount = pdf.getPageCount()
  if (pageCount === 0) {
    throw new Error('This PDF has no pages.')
  }

  const pngImage = await embedSignatureImage(pdf, options.signaturePng)
  const aspect = pngImage.height / pngImage.width
  const drawWidth = options.placement.width
  const drawHeight = drawWidth * aspect
  const pageIndices = resolvePageIndices(options.pageTarget, pageCount)

  const needsText = Boolean(options.signerName || options.includeDate)
  const font = needsText ? await pdf.embedFont(StandardFonts.Helvetica) : null
  const textBlockHeight = needsText ? (options.signerName ? 24 : 0) + (options.includeDate ? 14 : 0) : 0

  for (const pageIndex of pageIndices) {
    const page = pdf.getPage(pageIndex)
    const { x, y } = options.placement

    page.drawImage(pngImage, {
      x,
      y: y + textBlockHeight,
      width: drawWidth,
      height: drawHeight,
    })

    if (font) {
      let textY = y + textBlockHeight - 4
      if (options.signerName) {
        page.drawText(options.signerName, {
          x,
          y: textY,
          size: 10,
          font,
          color: rgb(0.15, 0.15, 0.15),
        })
        textY -= 12
      }
      if (options.includeDate) {
        const dateStr = new Date().toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
        page.drawText(`Signed ${dateStr}`, {
          x,
          y: textY,
          size: 9,
          font,
          color: rgb(0.35, 0.35, 0.35),
        })
      }
    }
  }

  return pdf.save()
}

export async function signWithCertificate(
  source: ArrayBuffer,
  options: CertificateSignOptions,
): Promise<Uint8Array> {
  const pdfWithPlaceholder = plainAddPlaceholder({
    pdfBuffer: Buffer.from(source),
    reason: options.reason?.trim() || 'Document signed',
    contactInfo: options.contactInfo?.trim() || '',
    name: options.name?.trim() || 'Signer',
    location: options.location?.trim() || '',
    signatureLength: 8192,
  })

  const signer = new P12Signer(Buffer.from(options.p12Buffer), {
    passphrase: options.passphrase,
  })

  const signed = await signpdf.sign(pdfWithPlaceholder, signer)
  return new Uint8Array(signed)
}
