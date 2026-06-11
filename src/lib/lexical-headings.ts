type LexNode = { type?: string; tag?: string; text?: string; children?: LexNode[] }

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l').replace(/Ł/g, 'l')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function nodeText(node: LexNode): string {
  let out = node.text ?? ''
  for (const c of node.children ?? []) out += nodeText(c)
  return out
}

export type Heading = { id: string; text: string; level: number }

export function extractHeadings(body: { root?: LexNode } | null | undefined): Heading[] {
  const out: Heading[] = []
  for (const node of body?.root?.children ?? []) {
    if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
      const text = nodeText(node).trim()
      if (text) out.push({ id: slugify(text), text, level: node.tag === 'h2' ? 2 : 3 })
    }
  }
  return out
}
