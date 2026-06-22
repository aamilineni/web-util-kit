const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?'

export type PasswordOptions = {
  length: number
  lowercase: boolean
  uppercase: boolean
  digits: boolean
  symbols: boolean
}

export function generatePassword(options: PasswordOptions): string {
  let pool = ''
  if (options.lowercase) pool += LOWER
  if (options.uppercase) pool += UPPER
  if (options.digits) pool += DIGITS
  if (options.symbols) pool += SYMBOLS

  if (!pool) throw new Error('Select at least one character type.')

  const length = Math.min(Math.max(options.length, 4), 128)
  const values = crypto.getRandomValues(new Uint32Array(length))

  return Array.from(values, (value) => pool[value % pool.length]).join('')
}

export function passwordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score <= 4) return { score, label: 'Fair', color: 'bg-amber-500' }
  if (score <= 5) return { score, label: 'Strong', color: 'bg-emerald-500' }
  return { score, label: 'Excellent', color: 'bg-brand-600' }
}
