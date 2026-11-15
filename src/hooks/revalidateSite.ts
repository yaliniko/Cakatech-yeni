import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// Not: (frontend) layout'u şu an `force-dynamic` olduğundan sayfalar zaten her ziyarette taze okunuyor;
// bu kancalar o ayar kaldırılırsa (önbellekli yayına dönülürse) devreye girer ve zararsızdır.
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
