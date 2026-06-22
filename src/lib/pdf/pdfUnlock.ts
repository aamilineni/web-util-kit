import { PDFDocument } from 'pdf-lib'
import type { QpdfInstance } from '@neslinesli93/qpdf-wasm'

type QpdfFs = QpdfInstance['FS'] & {
  writeFile: (path: string, data: Uint8Array) => void
  unlink: (path: string) => void
}

const INPUT_PATH = '/unlock-input.pdf'
const OUTPUT_PATH = '/unlock-output.pdf'

let qpdfInstance: QpdfInstance | null = null
let qpdfLoading: Promise<QpdfInstance> | null = null

async function getQpdf() {
  if (qpdfInstance) return qpdfInstance
  if (!qpdfLoading) {
    qpdfLoading = (async () => {
      const [{ default: createModule }, { default: qpdfWasmUrl }] = await Promise.all([
        import('@neslinesli93/qpdf-wasm'),
        import('@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url'),
      ])
      const instance = await createModule({
        locateFile: () => qpdfWasmUrl,
        noInitialRun: true,
      } as Parameters<typeof createModule>[0])
      qpdfInstance = instance
      return instance
    })()
  }
  return qpdfLoading
}

function cleanup(fs: QpdfFs, ...paths: string[]) {
  for (const path of paths) {
    try {
      fs.unlink(path)
    } catch {
      // ignore missing virtual files
    }
  }
}

async function unlockWithPdfLib(buffer: ArrayBuffer): Promise<Uint8Array> {
  const source = await PDFDocument.load(buffer, { ignoreEncryption: true })
  const unlocked = await PDFDocument.create()
  const copied = await unlocked.copyPages(source, source.getPageIndices())
  copied.forEach((page) => unlocked.addPage(page))
  return unlocked.save()
}

async function unlockWithQpdf(buffer: ArrayBuffer, password?: string): Promise<Uint8Array> {
  const qpdf = await getQpdf()
  const fs = qpdf.FS as QpdfFs

  fs.writeFile(INPUT_PATH, new Uint8Array(buffer))

  try {
    const args = password
      ? [`--password=${password}`, INPUT_PATH, '--decrypt', OUTPUT_PATH]
      : [INPUT_PATH, '--decrypt', OUTPUT_PATH]

    const exitCode = qpdf.callMain(args)
    if (exitCode !== 0) {
      throw new Error('QPDF could not decrypt this PDF.')
    }

    return fs.readFile(OUTPUT_PATH)
  } catch {
    throw new Error('QPDF could not decrypt this PDF.')
  } finally {
    cleanup(fs, INPUT_PATH, OUTPUT_PATH)
  }
}

export async function isPdfEncrypted(buffer: ArrayBuffer): Promise<boolean> {
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })
  return pdf.isEncrypted
}

export async function unlockPdf(buffer: ArrayBuffer, password?: string): Promise<Uint8Array> {
  const encrypted = await isPdfEncrypted(buffer)
  if (!encrypted) {
    return new Uint8Array(buffer)
  }

  const trimmedPassword = password?.trim()

  if (trimmedPassword) {
    try {
      return await unlockWithQpdf(buffer, trimmedPassword)
    } catch {
      throw new Error('Could not unlock PDF. Check the password and try again.')
    }
  }

  try {
    return await unlockWithQpdf(buffer)
  } catch {
    try {
      return await unlockWithPdfLib(buffer)
    } catch {
      throw new Error(
        'Could not unlock PDF. This file may need an open password — enter it above and try again.',
      )
    }
  }
}

export function unlockedFilename(name: string) {
  const stem = name.replace(/\.pdf$/i, '').replace(/[^\w.-]+/g, '_').replace(/_+/g, '_') || 'document'
  return `${stem}_unlocked.pdf`
}
