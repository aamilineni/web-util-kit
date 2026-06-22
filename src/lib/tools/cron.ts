import parser from 'cron-parser'
import cronstrue from 'cronstrue'

export type CronPreset = {
  label: string
  expression: string
}

export const CRON_PRESETS: CronPreset[] = [
  { label: 'Every minute', expression: '* * * * *' },
  { label: 'Every 5 minutes', expression: '*/5 * * * *' },
  { label: 'Every hour', expression: '0 * * * *' },
  { label: 'Daily at midnight', expression: '0 0 * * *' },
  { label: 'Daily at 9 AM', expression: '0 9 * * *' },
  { label: 'Weekdays at 9 AM', expression: '0 9 * * 1-5' },
  { label: 'Every Monday 9 AM', expression: '0 9 * * 1' },
  { label: 'First of month', expression: '0 0 1 * *' },
]

export const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

export type CronParseResult = {
  description: string
  nextRuns: string[]
}

export function describeCron(expression: string): string {
  return cronstrue.toString(expression, { throwExceptionOnParseError: true })
}

export function getNextCronRuns(
  expression: string,
  timezone: string,
  count = 8,
): CronParseResult {
  const trimmed = expression.trim()
  if (!trimmed) throw new Error('Enter a cron expression.')

  const description = describeCron(trimmed)
  const interval = parser.parse(trimmed, {
    tz: timezone,
    currentDate: new Date(),
  })

  const nextRuns: string[] = []
  for (let i = 0; i < count; i += 1) {
    const next = interval.next().toDate()
    nextRuns.push(
      new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(next),
    )
  }

  return { description, nextRuns }
}

export function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

export function parseCronFields(expression: string) {
  const parts = expression.trim().split(/\s+/)
  if (parts.length === 5) {
    return {
      seconds: null,
      minute: parts[0],
      hour: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4],
    }
  }
  if (parts.length === 6) {
    return {
      seconds: parts[0],
      minute: parts[1],
      hour: parts[2],
      dayOfMonth: parts[3],
      month: parts[4],
      dayOfWeek: parts[5],
    }
  }
  throw new Error('Cron expression must have 5 fields (or 6 with seconds).')
}
