import * as React from 'react'
import { Metadata } from 'next/types'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'コーヒー焙煎モニター',
  description: 'コーヒー焙煎の温度モニタリングシステム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={inter.className}>
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
} 