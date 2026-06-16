import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Link2, X, Globe, Bot, Code2, Wrench } from 'lucide-react'
import type { Profile } from '@/lib/supabase/types'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ProfileHeaderProps {
  profile: Profile
  isOwnProfile: boolean
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={profile.avatar_url ?? undefined} />
          <AvatarFallback className="text-xl">{profile.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">@{profile.username}</h1>
          {profile.bio && <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>}
          <div className="flex items-center gap-3 mt-2">
            {profile.github && (
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs">
                <Link2 className="w-4 h-4" /> GitHub
              </a>
            )}
            {profile.twitter && (
              <a href={`https://x.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs">
                <X className="w-3 h-3" /> X
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        {isOwnProfile && (
          <Link href="/settings" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            Edit profile
          </Link>
        )}
      </div>

      {profile.favorite_models.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Bot className="w-3.5 h-3.5" /> Fav AI Models
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.favorite_models.map((m) => (
              <Badge key={m} variant="secondary">{m}</Badge>
            ))}
          </div>
        </div>
      )}

      {profile.tech_stack.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5" /> Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.tech_stack.map((s) => (
              <Badge key={s} variant="outline">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {profile.languages.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5" /> Languages
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.languages.map((l) => (
              <Badge key={l} variant="outline">{l}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
