const PBKDF2_ITERATIONS = 100_000

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value.trim())
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

async function deriveKey(passphrase: string, salt: Uint8Array) {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptAes(plaintext: string, passphrase: string): Promise<string> {
  if (!passphrase) throw new Error('Passphrase is required.')

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, salt)
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  )

  return JSON.stringify({
    v: 1,
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(ciphertext)),
  })
}

export async function decryptAes(payload: string, passphrase: string): Promise<string> {
  if (!passphrase) throw new Error('Passphrase is required.')

  let parsed: { salt: string; iv: string; data: string }
  try {
    parsed = JSON.parse(payload.trim()) as { salt: string; iv: string; data: string }
  } catch {
    throw new Error('Invalid encrypted payload. Paste the full JSON output from encrypt.')
  }

  if (!parsed.salt || !parsed.iv || !parsed.data) {
    throw new Error('Encrypted payload is missing salt, iv, or data.')
  }

  const salt = fromBase64(parsed.salt)
  const iv = fromBase64(parsed.iv)
  const data = fromBase64(parsed.data)
  const key = await deriveKey(passphrase, salt)

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return new TextDecoder().decode(decrypted)
}
