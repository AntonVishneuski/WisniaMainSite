type LexNode = { type?: string; text?: string; children?: LexNode[] }

function collectText(node: LexNode | undefined): string {
  if (!node) return ''
  let out = node.text ?? ''
  for (const c of node.children ?? []) out += ' ' + collectText(c)
  return out
}

export function readingMinutes(body: { root?: LexNode } | null | undefined, wpm = 200): number {
  const text = collectText(body?.root).trim()
  const words = text ? text.split(/\s+/).length : 0
  return Math.max(1, Math.round(words / wpm))
}
