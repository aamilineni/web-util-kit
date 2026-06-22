import type { SplitOptions } from '@/lib/pdf/pdfOperations'

export type WorkerRequest =
  | { id: string; type: 'merge'; buffers: ArrayBuffer[] }
  | { id: string; type: 'split'; buffer: ArrayBuffer; options: SplitOptions }
  | { id: string; type: 'page-count'; buffer: ArrayBuffer }

export type WorkerResponse =
  | { id: string; ok: true; result: Uint8Array | Uint8Array[] | number }
  | { id: string; ok: false; error: string }
