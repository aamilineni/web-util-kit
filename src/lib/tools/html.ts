export function encodeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export function decodeHtml(text: string): string {
  const div = document.createElement('textarea')
  div.innerHTML = text
  return div.value
}
