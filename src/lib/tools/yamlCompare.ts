import { parse } from 'yaml'
import {
  compareJson,
  formatDiffValue,
  type JsonCompareResult,
  type JsonDiffEntry,
} from '@/lib/tools/jsonCompare'

export type YamlCompareResult = JsonCompareResult
export type YamlDiffEntry = JsonDiffEntry

export function parseYamlInput(input: string, label: string): unknown {
  const trimmed = input.trim()
  if (!trimmed) throw new Error(`${label} YAML is empty.`)

  try {
    return parse(trimmed)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid YAML.'
    throw new Error(`${label} YAML is invalid: ${message}`)
  }
}

export function compareYaml(left: unknown, right: unknown): YamlCompareResult {
  return compareJson(left, right)
}

export { formatDiffValue }
