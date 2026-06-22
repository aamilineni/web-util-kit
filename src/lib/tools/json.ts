export function formatJson(input: string): string {
  const parsed = JSON.parse(input) as unknown
  return JSON.stringify(parsed, null, 2)
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input) as unknown
  return JSON.stringify(parsed)
}

export function validateJson(input: string): boolean {
  JSON.parse(input)
  return true
}
