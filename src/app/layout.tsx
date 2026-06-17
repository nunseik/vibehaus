import type { Metadata } from 'next'
import { IBM_Plex_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { BackgroundLoader } from '@/components/layout/BackgroundLoader'

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`

const ibmPlexSans = IBM_Plex_Sans({ variable: '--font-geist-sans', subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vibehaus — For Vibe Coders',
  description: 'Share tips, tricks, and builds with the vibe coding community.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <BackgroundLoader />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
