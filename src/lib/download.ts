export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function downloadText(text: string, filename: string, mimeType = 'text/plain;charset=utf-8') {
  downloadBlob(new Blob([text], { type: mimeType }), filename)
}

export function downloadCsv(rows: string[][], filename: string) {
  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')
  downloadText(csv, filename, 'text/csv;charset=utf-8')
}

export function uuidsCsvFilename() {
  return `uuids_${new Date().toISOString().slice(0, 10)}.csv`
}

export function downloadBytes(bytes: Uint8Array, filename: string) {
  const copy = new Uint8Array(bytes)
  const blob = new Blob([copy], { type: 'application/pdf' })
  downloadBlob(blob, filename)
}

export function sanitizeFilename(name: string) {
  return name.replace(/[^\w.-]+/g, '_').replace(/_+/g, '_') || 'document.pdf'
}

export function defaultMergedFilename() {
  return `merged_${new Date().toISOString().slice(0, 10)}.pdf`
}

export function splitFilename(baseName: string, index: number, total: number) {
  const stem = baseName.replace(/\.pdf$/i, '')
  const padded = String(index + 1).padStart(String(total).length, '1')
  return sanitizeFilename(`${stem}_part_${padded}.pdf`)
}
