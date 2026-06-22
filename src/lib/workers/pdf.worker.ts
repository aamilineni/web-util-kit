import { getPageCount, mergePdfs, splitPdf } from '@/lib/pdf/pdfOperations'
import type { WorkerRequest, WorkerResponse } from '@/lib/pdf/workerTypes'

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const message = event.data

  try {
    let result: Uint8Array | Uint8Array[] | number

    switch (message.type) {
      case 'merge':
        result = await mergePdfs(message.buffers)
        break
      case 'split':
        result = await splitPdf(message.buffer, message.options)
        break
      case 'page-count':
        result = await getPageCount(message.buffer)
        break
      default:
        throw new Error('Unknown worker task.')
    }

    const response: WorkerResponse = { id: message.id, ok: true, result }
    self.postMessage(response)
  } catch (error) {
    const response: WorkerResponse = {
      id: message.id,
      ok: false,
      error: error instanceof Error ? error.message : 'Something went wrong.',
    }
    self.postMessage(response)
  }
}

export {}
