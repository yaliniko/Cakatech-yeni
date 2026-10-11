import { notFound } from 'next/navigation'

// Eşleşmeyen her yol sitenin kendi 404 sayfasına (layout'lu) düşsün.
export default function CatchAll() {
  notFound()
}
