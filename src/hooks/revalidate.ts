import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// Revalidate the whole public site (all locales share the [locale] root layout).
async function revalidateSite() {
  // Only run inside the Next.js server runtime; skip during the seed/CLI (tsx) and build-time.
  if (!process.env.NEXT_RUNTIME) return
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // outside a render/request scope or next/cache unavailable — ignore
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateSite()
  return doc
}
export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateSite()
  return doc
}
export const revalidateGlobalAfterChange: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidateSite()
  return doc
}
