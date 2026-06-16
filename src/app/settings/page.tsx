import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/queries/users'
import { updateProfile } from '@/lib/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export const metadata = { title: 'Settings — Vibehaus' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const profile = await getCurrentUser()
  if (!profile) redirect('/auth')

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Profile Settings</h1>
      <form action={updateProfile} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="username">Username *</Label>
          <Input id="username" name="username" defaultValue={profile.username} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" defaultValue={profile.bio ?? ''} rows={3} className="resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="github">GitHub username</Label>
            <Input id="github" name="github" defaultValue={profile.github ?? ''} placeholder="octocat" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="twitter">Twitter/X handle</Label>
            <Input id="twitter" name="twitter" defaultValue={profile.twitter ?? ''} placeholder="handle" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" type="url" defaultValue={profile.website ?? ''} placeholder="https://..." />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="favorite_models">Favorite AI Models</Label>
          <Input
            id="favorite_models"
            name="favorite_models"
            defaultValue={profile.favorite_models.join(', ')}
            placeholder="Claude Opus 4, GPT-4o, Gemini"
          />
          <p className="text-xs text-muted-foreground">Comma-separated</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tech_stack">Tech Stack</Label>
          <Input
            id="tech_stack"
            name="tech_stack"
            defaultValue={profile.tech_stack.join(', ')}
            placeholder="Next.js, Supabase, Vercel"
          />
          <p className="text-xs text-muted-foreground">Comma-separated</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="languages">Programming Languages</Label>
          <Input
            id="languages"
            name="languages"
            defaultValue={profile.languages.join(', ')}
            placeholder="TypeScript, Python, Rust"
          />
          <p className="text-xs text-muted-foreground">Comma-separated</p>
        </div>

        <Button type="submit" className="w-full">Save changes</Button>
      </form>
    </div>
  )
}
