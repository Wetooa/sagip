import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cebu Flood Hazard Map Demo',
  description: 'Interactive map visualization of Cebu flood hazard data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
