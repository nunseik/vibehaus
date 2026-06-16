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
      <div className="flex gap-1 mb-4 border-b border-border pb-3">
        {SORT_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`${baseHref}?sort=${tab.value}`}
            className={cn(
              'px-3 py-1.5 text-sm rounded-md transition-colors',
              sort === tab.value
                ? 'bg-muted text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
