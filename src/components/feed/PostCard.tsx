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
    <article className="flex gap-3 p-4 rounded-lg border border-border bg-card hover:border-border/80 transition-colors">
      <VoteButtons postId={post.id} initialScore={post.score} initialUserVote={userVote} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
          {category && (
            <Link href={`/c/${category.slug}`} className="hover:text-foreground transition-colors">
              {category.icon} {category.name}
            </Link>
          )}
          <span>·</span>
          <Link href={`/u/${author?.username}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Avatar className="w-4 h-4">
              <AvatarImage src={author?.avatar_url ?? undefined} />
              <AvatarFallback>{author?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            @{author?.username}
          </Link>
          <span>·</span>
          <time>{formatDistanceToNow(post.created_at)}</time>
        </div>

        <div className="flex items-start gap-2">
          <Link href={`/post/${post.id}`} className="flex-1">
            <h2 className="font-medium text-sm leading-snug hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {post.body && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.body}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {post.comment_count} comments
          </Link>
          {post.tags?.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs py-0 h-5">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  )
}
