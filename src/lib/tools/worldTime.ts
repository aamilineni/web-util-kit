export type ZoneClock = {
  id: string
  timeZone: string
  city: string
}

export const DEFAULT_ZONES: ZoneClock[] = [
  { id: 'la', timeZone: 'America/Los_Angeles', city: 'Los Angeles' },
  { id: 'ny', timeZone: 'America/New_York', city: 'New York' },
  { id: 'lon', timeZone: 'Europe/London', city: 'London' },
  { id: 'par', timeZone: 'Europe/Paris', city: 'Paris' },
  { id: 'dub', timeZone: 'Asia/Dubai', city: 'Dubai' },
  { id: 'mum', timeZone: 'Asia/Kolkata', city: 'Mumbai' },
  { id: 'sg', timeZone: 'Asia/Singapore', city: 'Singapore' },
  { id: 'tok', timeZone: 'Asia/Tokyo', city: 'Tokyo' },
  { id: 'syd', timeZone: 'Australia/Sydney', city: 'Sydney' },
]

export const POPULAR_ZONES: { timeZone: string; city: string }[] = [
  { timeZone: 'Pacific/Honolulu', city: 'Honolulu' },
  { timeZone: 'America/Chicago', city: 'Chicago' },
  { timeZone: 'America/Denver', city: 'Denver' },
  { timeZone: 'America/Toronto', city: 'Toronto' },
  { timeZone: 'America/Sao_Paulo', city: 'São Paulo' },
  { timeZone: 'Europe/Berlin', city: 'Berlin' },
  { timeZone: 'Europe/Moscow', city: 'Moscow' },
  { timeZone: 'Africa/Cairo', city: 'Cairo' },
  { timeZone: 'Asia/Jerusalem', city: 'Jerusalem' },
  { timeZone: 'Asia/Bangkok', city: 'Bangkok' },
  { timeZone: 'Asia/Seoul', city: 'Seoul' },
  { timeZone: 'Pacific/Auckland', city: 'Auckland' },
  ...DEFAULT_ZONES.map(({ timeZone, city }) => ({ timeZone, city })),
]

type ZonedParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  weekday: string
}

export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0)

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour') % 24,
    minute: read('minute'),
    second: read('second'),
    weekday: parts.find((part) => part.type === 'weekday')?.value ?? '',
  }
}

export function getHourFraction(date: Date, timeZone: string) {
  const parts = getZonedParts(date, timeZone)
  return parts.hour + parts.minute / 60 + parts.second / 3600
}

export function getUtcOffsetLabel(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
  }).formatToParts(date)
  return parts.find((part) => part.type === 'timeZoneName')?.value ?? 'UTC'
}

export function formatClockTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)
}

export function formatClockDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function dateAtMinutesInZone(
  baseDate: Date,
  timeZone: string,
  minutesFromMidnight: number,
): Date {
  const parts = getZonedParts(baseDate, timeZone)
  const hour = Math.floor(minutesFromMidnight / 60) % 24
  const minute = Math.floor(minutesFromMidnight % 60)

  let utc = Date.UTC(parts.year, parts.month - 1, parts.day, hour, minute, 0)

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const current = getZonedParts(new Date(utc), timeZone)
    const targetMinutes = hour * 60 + minute
    const currentMinutes = current.hour * 60 + current.minute
    const dayShift = (parts.day - current.day) * 24 * 60
    const delta = dayShift + (targetMinutes - currentMinutes)
    if (delta === 0) break
    utc += delta * 60 * 1000
  }

  return new Date(utc)
}

export function listAllTimeZones() {
  if (typeof Intl.supportedValuesOf === 'function') {
    return Intl.supportedValuesOf('timeZone')
  }
  return POPULAR_ZONES.map((zone) => zone.timeZone)
}

export function searchTimeZones(query: string, limit = 12) {
  const q = query.trim().toLowerCase()
  const pool = [...POPULAR_ZONES]

  for (const timeZone of listAllTimeZones()) {
    if (!pool.some((entry) => entry.timeZone === timeZone)) {
      const city = timeZone.split('/').pop()?.replace(/_/g, ' ') ?? timeZone
      pool.push({ timeZone, city })
    }
  }

  if (!q) return pool.slice(0, limit)

  return pool
    .filter(
      (entry) =>
        entry.city.toLowerCase().includes(q) || entry.timeZone.toLowerCase().includes(q),
    )
    .slice(0, limit)
}

export function isBusinessHour(hourFraction: number) {
  return hourFraction >= 9 && hourFraction < 17
}

export function isNightHour(hourFraction: number) {
  return hourFraction < 6 || hourFraction >= 22
}
