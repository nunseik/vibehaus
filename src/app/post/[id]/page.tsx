import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPost } from '@/lib/queries/posts'
import { createClient } from '@/lib/supabase/server'
import { getUserVoteForPost } from '@/lib/actions/votes'
import { VoteButtons } from '@/components/feed/VoteButtons'
import { CommentThread } from '@/components/post/CommentThread'
import { CommentForm } from '@/components/post/CommentForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'
import type { Metadata } from 'next'
import type { CommentWithAuthor } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return {}
  return { title: `${post.title} — Vibehaus` }
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const [post, supabase] = await Promise.all([getPost(id), createClient()])

  if (!post) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const userVote = user ? await getUserVoteForPost(id) : null
  const author = post.profiles
  const category = post.categories

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <article className="rounded-lg border border-border p-5">
        <div className="flex gap-4">
          <VoteButtons postId={post.id} initialScore={post.score} initialUserVote={userVote} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              {category && (
                <Link href={`/c/${category.slug}`} className="hover:text-foreground">
                  {category.icon} {category.name}
                </Link>
              )}
              <span>·</span>
              <Link href={`/u/${author?.username}`} className="flex items-center gap-1 hover:text-foreground">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={author?.avatar_url ?? undefined} />
                  <AvatarFallback>{author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                @{author?.username}
              </Link>
              <span>·</span>
              <time>{formatDistanceToNow(post.created_at)}</time>
            </div>

            <h1 className="text-xl font-bold leading-snug">{post.title}</h1>

            {post.url && (
              <a href={post.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline mt-2">
                {post.url}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {post.body && (
              <div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{post.body}</div>
            )}

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">{tag.name}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      <div className="mt-6 space-y-4">
        <h2 className="font-semibold text-sm">{post.comment_count} Comments</h2>

        {user ? (
          <CommentForm postId={id} />
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/auth" className="text-primary hover:underline">Sign in</Link> to comment.
          </p>
        )}

        <CommentThread
          comments={(post.comments ?? []) as CommentWithAuthor[]}
          postId={id}
        />
      </div>
    </div>
  )
}
