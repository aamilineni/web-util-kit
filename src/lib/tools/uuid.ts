export function generateUuids(count: number): string[] {
  const safeCount = Math.min(Math.max(Math.floor(count), 1), 500)
  return Array.from({ length: safeCount }, () => crypto.randomUUID())
}
