import QRCode from 'qrcode'

export async function generateQrDataUrl(text: string, size = 256): Promise<string> {
  if (!text.trim()) throw new Error('Enter text or a URL to encode.')
  return QRCode.toDataURL(text, {
    width: size,
    margin: 2,
    color: { dark: '#1e1b4b', light: '#ffffff' },
  })
}

export async function downloadQrDataUrl(dataUrl: string, filename = 'qrcode.png') {
  const anchor = document.createElement('a')
  anchor.href = dataUrl
  anchor.download = filename
  anchor.click()
}
