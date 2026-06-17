import type { Metadata } from 'next'
import { IBM_Plex_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

const ibmPlexSans = IBM_Plex_Sans({ variable: '--font-geist-sans', subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vibehaus — For Vibe Coders',
  description: 'Share tips, tricks, and builds with the vibe coding community.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
