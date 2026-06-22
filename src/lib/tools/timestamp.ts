export function unixToDate(unix: string, unit: 'seconds' | 'milliseconds'): Date | null {
  const value = Number(unix.trim())
  if (!Number.isFinite(value)) return null
  const ms = unit === 'seconds' ? value * 1000 : value
  const date = new Date(ms)
  return Number.isNaN(date.getTime()) ? null : date
}

export function dateToUnix(date: Date, unit: 'seconds' | 'milliseconds') {
  return unit === 'seconds' ? Math.floor(date.getTime() / 1000) : date.getTime()
}

export function formatDate(date: Date) {
  return date.toISOString()
}

export function formatLocal(date: Date) {
  return date.toLocaleString(undefined, {
    dateStyle: 'full',
    timeStyle: 'long',
  })
}

export function nowUnix(unit: 'seconds' | 'milliseconds') {
  return dateToUnix(new Date(), unit)
}
