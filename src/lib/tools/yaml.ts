import { parse, stringify } from 'yaml'

function parseYaml(input: string): unknown {
  const trimmed = input.trim()
  if (!trimmed) {
    throw new Error('YAML input is empty.')
  }
  return parse(trimmed)
}

export function formatYaml(input: string): string {
  const parsed = parseYaml(input)
  return stringify(parsed, { indent: 2, lineWidth: 0 }).trimEnd()
}

export function minifyYaml(input: string): string {
  const parsed = parseYaml(input)
  return stringify(parsed, { indent: 0, lineWidth: 0 }).trim()
}

export function validateYaml(input: string): boolean {
  parseYaml(input)
  return true
}
