'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.cookie = `theme=${next ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`
  }

  return (
    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={toggle} aria-label="Toggle theme">
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}
