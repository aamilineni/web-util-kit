export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512'

export async function hashText(text: string, algorithm: HashAlgorithm): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest(algorithm, data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
