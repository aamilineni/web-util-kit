export type DiffKind = 'added' | 'removed' | 'changed'

export type JsonDiffEntry = {
  kind: DiffKind
  path: string
  before?: unknown
  after?: unknown
}

export type JsonCompareResult = {
  equal: boolean
  diffs: JsonDiffEntry[]
}

function formatPath(segments: Array<string | number>): string {
  if (segments.length === 0) return '(root)'
  return segments.reduce<string>((acc, segment) => {
    if (typeof segment === 'number') return `${acc}[${segment}]`
    return acc ? `${acc}.${segment}` : segment
  }, '')
}

function stringifyValue(value: unknown) {
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return JSON.stringify(value)
  return JSON.stringify(value, null, 0) ?? String(value)
}

export function parseJsonInput(input: string, label: string): unknown {
  const trimmed = input.trim()
  if (!trimmed) throw new Error(`${label} JSON is empty.`)
  return JSON.parse(trimmed) as unknown
}

export function compareJson(left: unknown, right: unknown): JsonCompareResult {
  const diffs: JsonDiffEntry[] = []
  walkCompare(left, right, [], diffs)
  return { equal: diffs.length === 0, diffs }
}

function walkCompare(
  left: unknown,
  right: unknown,
  path: Array<string | number>,
  diffs: JsonDiffEntry[],
) {
  if (deepEqual(left, right)) return

  const leftIsArray = Array.isArray(left)
  const rightIsArray = Array.isArray(right)

  if (leftIsArray && rightIsArray) {
    const leftArr = left
    const rightArr = right
    const max = Math.max(leftArr.length, rightArr.length)

    for (let index = 0; index < max; index += 1) {
      if (index >= leftArr.length) {
        diffs.push({
          kind: 'added',
          path: formatPath([...path, index]),
          after: rightArr[index],
        })
      } else if (index >= rightArr.length) {
        diffs.push({
          kind: 'removed',
          path: formatPath([...path, index]),
          before: leftArr[index],
        })
      } else {
        walkCompare(leftArr[index], rightArr[index], [...path, index], diffs)
      }
    }
    return
  }

  const leftIsObject = isPlainObject(left)
  const rightIsObject = isPlainObject(right)

  if (leftIsObject && rightIsObject) {
    const leftObj = left as Record<string, unknown>
    const rightObj = right as Record<string, unknown>
    const keys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)])

    for (const key of keys) {
      if (!(key in leftObj)) {
        diffs.push({
          kind: 'added',
          path: formatPath([...path, key]),
          after: rightObj[key],
        })
      } else if (!(key in rightObj)) {
        diffs.push({
          kind: 'removed',
          path: formatPath([...path, key]),
          before: leftObj[key],
        })
      } else {
        walkCompare(leftObj[key], rightObj[key], [...path, key], diffs)
      }
    }
    return
  }

  diffs.push({
    kind: 'changed',
    path: formatPath(path),
    before: left,
    after: right,
  })
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a === null || b === null) return a === b

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => deepEqual(item, b[index]))
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false
    return aKeys.every((key) => deepEqual(a[key], b[key]))
  }

  return false
}

export function formatDiffValue(entry: JsonDiffEntry) {
  if (entry.kind === 'added') {
    return { label: 'Added', value: stringifyValue(entry.after) }
  }
  if (entry.kind === 'removed') {
    return { label: 'Removed', value: stringifyValue(entry.before) }
  }
  return {
    label: 'Changed',
    before: stringifyValue(entry.before),
    after: stringifyValue(entry.after),
  }
}

export { stringifyValue }
