import Link from 'next/link'
import { getFeaturedUsers } from '@/lib/queries/users'
import { getCategories } from '@/lib/queries/categories'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, Layers } from 'lucide-react'

export async function Sidebar() {
  const [featuredUsers, categories] = await Promise.all([
    getFeaturedUsers(),
    getCategories(),
  ])

  return (
    <aside className="space-y-6">
      {featuredUsers.length > 0 && (
        <div className="rounded-lg border border-border p-4">
          <h2 className="flex items-center gap-1.5 font-semibold text-sm mb-3">
            <Star className="w-4 h-4 text-yellow-400" />
            Featured Vibers
          </h2>
          <ul className="space-y-3">
            {featuredUsers.map((u) => (
              <li key={u.author_id}>
                <Link href={`/u/${u.username ?? ''}`} className="flex items-center gap-2 group">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={u.avatar_url ?? undefined} />
                    <AvatarFallback>{(u.username ?? '?')[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium group-hover:underline truncate">@{u.username}</p>
                    <p className="text-xs text-muted-foreground">{u.total_score} pts · {u.post_count} posts</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border border-border p-4">
        <h2 className="flex items-center gap-1.5 font-semibold text-sm mb-3">
          <Layers className="w-4 h-4" />
          Categories
        </h2>
        <ul className="space-y-1.5">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/c/${cat.slug}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
