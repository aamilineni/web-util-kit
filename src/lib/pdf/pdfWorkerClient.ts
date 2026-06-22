import PdfWorker from '@/lib/workers/pdf.worker?worker'
import type { SplitOptions } from '@/lib/pdf/pdfOperations'
import type { WorkerRequest, WorkerResponse } from '@/lib/pdf/workerTypes'

let worker: Worker | null = null
let taskId = 0

function getWorker() {
  if (!worker) {
    worker = new PdfWorker()
  }
  return worker
}

function runTask<T extends Uint8Array | Uint8Array[] | number>(
  request: WorkerRequest,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const instance = getWorker()

    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.id !== request.id) return
      instance.removeEventListener('message', handleMessage)

      if (event.data.ok) {
        resolve(event.data.result as T)
      } else {
        reject(new Error(event.data.error))
      }
    }

    instance.addEventListener('message', handleMessage)
    instance.postMessage(request)
  })
}

function nextTaskId() {
  return `task-${++taskId}`
}

export function mergePdfsInWorker(buffers: ArrayBuffer[]) {
  return runTask<Uint8Array>({ id: nextTaskId(), type: 'merge', buffers })
}

export function splitPdfInWorker(buffer: ArrayBuffer, options: SplitOptions) {
  return runTask<Uint8Array[]>({ id: nextTaskId(), type: 'split', buffer, options })
}

export function getPageCountInWorker(buffer: ArrayBuffer) {
  return runTask<number>({ id: nextTaskId(), type: 'page-count', buffer })
}
