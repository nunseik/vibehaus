'use client'

import { useEffect } from 'react'

export function BackgroundApplier({ url }: { url: string | null }) {
  useEffect(() => {
    if (url) {
      document.body.classList.add('has-bg')
      return () => document.body.classList.remove('has-bg')
    }
  }, [url])

  if (!url) return null
  return (
    <div
      className="fixed top-0 left-0 right-0 -z-10 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${url})`, bottom: '-30vh' }}
    >
      <div className="absolute inset-0 bg-black/55" />
    </div>
  )
}
