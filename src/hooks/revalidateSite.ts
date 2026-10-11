import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// Panelde içerik değişince sitenin önbelleğe alınmış sayfalarını yeniler.
// Next dışında (ör. `payload migrate` CLI) çağrılırsa revalidatePath hata verir; yok sayılır.
const revalidate = (context: Record<string, unknown>) => {
  if (context.disableRevalidate) return
  try {
    revalidatePath('/[lang]', 'layout')
  } catch {
    // Next istek bağlamı yok.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidate(req.context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidate(req.context)
  return doc
}

export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
