import type { Metadata } from 'next'
import { Lexend_Deca, Roboto_Mono } from 'next/font/google'
import './globals.css'

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend-deca',
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

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
      className={`${lexendDeca.variable} ${robotoMono.variable}`}
    >
      <body className="noise-grain">
        {children}
      </body>
    </html>
  )
}