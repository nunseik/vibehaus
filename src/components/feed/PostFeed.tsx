import Link from 'next/link'
import { PostCard } from './PostCard'
import type { PostWithAuthor } from '@/lib/supabase/types'
import type { SortMode } from '@/lib/queries/posts'
import { cn } from '@/lib/utils'

interface PostFeedProps {
  posts: PostWithAuthor[]
  sort: SortMode
  baseHref: string
}

const SORT_TABS: { label: string; value: SortMode }[] = [
  { label: '🔥 Hot', value: 'hot' },
  { label: '✨ New', value: 'new' },
  { label: '⬆ Top', value: 'top' },
]

export function PostFeed({ posts, sort, baseHref }: PostFeedProps) {
  return (
    <div>
      <div className="flex gap-1 mb-4">
        {SORT_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`${baseHref}?sort=${tab.value}`}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              sort === tab.value
                ? 'bg-card text-foreground font-medium'
                : 'bg-card/50 text-muted-foreground hover:bg-card/75 hover:text-foreground'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 text-sm">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
