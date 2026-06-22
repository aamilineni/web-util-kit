function decodeBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  return atob(padded)
}

function parseJsonPart(value: string): unknown {
  return JSON.parse(decodeBase64Url(value)) as unknown
}

export type JwtDecoded = {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  expiresAt: string | null
  isExpired: boolean | null
}

export function decodeJwt(token: string): JwtDecoded {
  const trimmed = token.trim().replace(/^Bearer\s+/i, '')
  const parts = trimmed.split('.')

  if (parts.length !== 3) {
    throw new Error('Invalid JWT. Expected three dot-separated parts.')
  }

  const [headerPart, payloadPart, signature] = parts
  const header = parseJsonPart(headerPart) as Record<string, unknown>
  const payload = parseJsonPart(payloadPart) as Record<string, unknown>

  let expiresAt: string | null = null
  let isExpired: boolean | null = null

  if (typeof payload.exp === 'number') {
    const date = new Date(payload.exp * 1000)
    expiresAt = date.toISOString()
    isExpired = Date.now() > date.getTime()
  }

  return { header, payload, signature, expiresAt, isExpired }
}

export function formatJwtJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}
