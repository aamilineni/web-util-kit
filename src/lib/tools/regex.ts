export type RegexMatchResult = {
  matches: RegExpMatchArray[]
  groups: string[]
  error: string | null
}

export function testRegex(pattern: string, flags: string, text: string): RegexMatchResult {
  try {
    const regex = new RegExp(pattern, flags)
    const matches = [...text.matchAll(regex)]
    const groups = matches.flatMap((match) =>
      match.slice(1).filter((group): group is string => group !== undefined),
    )
    return { matches, groups, error: null }
  } catch (error) {
    return {
      matches: [],
      groups: [],
      error: error instanceof Error ? error.message : 'Invalid regular expression.',
    }
  }
}

export function highlightMatches(text: string, pattern: string, flags: string) {
  const result = testRegex(pattern, flags, text)
  if (result.error || !pattern) return { html: escapeHtml(text), ...result }

  const regex = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`)
  let lastIndex = 0
  let html = ''
  for (const match of text.matchAll(regex)) {
    const start = match.index ?? 0
    html += escapeHtml(text.slice(lastIndex, start))
    html += `<mark class="rounded bg-amber-200 px-0.5">${escapeHtml(match[0])}</mark>`
    lastIndex = start + match[0].length
  }
  html += escapeHtml(text.slice(lastIndex))
  return { html, ...result }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
