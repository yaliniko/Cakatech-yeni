import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import React from 'react'
import './styles.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const grotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Çakatech #25160 — FTC Robotik Takımı',
    template: '%s · Çakatech #25160',
  },
  description: "Çakatech, FIRST Tech Challenge'da yarışan #25160 numaralı lise robotik takımı.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
