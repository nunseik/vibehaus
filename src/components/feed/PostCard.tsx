import Link from 'next/link'
import { formatDistanceToNow } from '@/lib/utils'
import { VoteButtons } from './VoteButtons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, ExternalLink } from 'lucide-react'
import type { PostWithAuthor } from '@/lib/supabase/types'

interface PostCardProps {
  post: PostWithAuthor
  userVote?: 1 | -1 | null
}

export function PostCard({ post, userVote = null }: PostCardProps) {
  const author = post.profiles
  const category = post.categories

  return (
    <article className="flex gap-3 px-4 py-3.5 bg-card border border-border border-l-2 border-l-emerald-500 hover:bg-muted/40 transition-colors rounded-r-lg">
      <VoteButtons postId={post.id} initialScore={post.score} initialUserVote={userVote} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
          {category && (
            <Link href={`/c/${category.slug}`} className="font-semibold text-emerald-600 uppercase tracking-wide hover:text-emerald-700 transition-colors">
              {category.name}
            </Link>
          )}
          <span className="text-border">·</span>
          <Link href={`/u/${author?.username}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Avatar className="w-3.5 h-3.5">
              <AvatarImage src={author?.avatar_url ?? undefined} />
              <AvatarFallback>{author?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            @{author?.username}
          </Link>
          <span className="text-border">·</span>
          <time>{formatDistanceToNow(post.created_at)}</time>
        </div>

        <div className="flex items-start gap-2">
          <Link href={`/post/${post.id}`} className="flex-1">
            <h2 className="font-semibold text-sm leading-snug text-foreground hover:text-primary transition-colors line-clamp-2 uppercase tracking-wide">
              {post.title}
            </h2>
          </Link>
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {post.body && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{post.body}</p>
        )}

        <div className="flex items-center gap-2 mt-2.5">
          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare className="w-3 h-3" />
            {post.comment_count}
          </Link>
          {post.tags?.map((tag) => (
            <span key={tag.id} className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 leading-none">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
