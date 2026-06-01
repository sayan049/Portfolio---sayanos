import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'SayanOS — Sayan Patra',
  description: 'Full-Stack Engineer · Realtime Systems · AI Products · SayanOS v1.0',
  keywords: ['Sayan Patra', 'Full Stack Developer', 'MERN', 'React', 'Next.js', 'Portfolio'],
  authors: [{ name: 'Sayan Patra' }],
  openGraph: {
    title: 'SayanOS — Sayan Patra',
    description: 'Full-Stack Engineer building scalable systems and immersive experiences.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="noise-grain">
        {children}
      </body>
    </html>
  )
}