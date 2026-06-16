'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link2, Zap } from 'lucide-react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setSent(true)
    setLoading(false)
  }

  async function handleGitHub() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Zap className="w-10 h-10 text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold">Join Vibehaus</h1>
        <p className="text-sm text-muted-foreground">The community for vibe coders</p>
      </div>

      {sent ? (
        <div className="rounded-lg border border-border p-4 text-center space-y-2">
          <p className="font-medium">Check your email ✉️</p>
          <p className="text-sm text-muted-foreground">We sent a magic link to {email}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGitHub}
          >
            <Link2 className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-2">or</span>
            </div>
          </div>

          <form onSubmit={handleMagicLink} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send magic link'}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
