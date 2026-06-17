'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CommentForm } from './CommentForm'
import { formatDistanceToNow } from '@/lib/utils'
import { buildTree } from '@/lib/commentTree'
import type { CommentWithAuthor } from '@/lib/supabase/types'

interface CommentThreadProps {
  comments: CommentWithAuthor[]
  postId: string
  depth?: number
}

function CommentItem({ comment, postId, depth = 0 }: { comment: CommentWithAuthor; postId: string; depth?: number }) {
  const [replying, setReplying] = useState(false)
  const author = comment.profiles

  return (
    <div className={depth > 0 ? 'pl-4 border-l border-border' : ''}>
      <div className="py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Link href={`/u/${author?.username}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Avatar className="w-4 h-4">
              <AvatarImage src={author?.avatar_url ?? undefined} />
              <AvatarFallback>{author?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            @{author?.username}
          </Link>
          <span>·</span>
          <time>{formatDistanceToNow(comment.created_at)}</time>
        </div>
        <p className="text-sm">{comment.body}</p>
        {depth < 3 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs mt-1"
            onClick={() => setReplying(!replying)}
          >
            Reply
          </Button>
        )}
        {replying && (
          <div className="mt-2">
            <CommentForm postId={postId} parentId={comment.id} onCancel={() => setReplying(false)} />
          </div>
        )}
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </div>
  )
}

export function CommentThread({ comments, postId }: CommentThreadProps) {
  const tree = buildTree(comments)

  return (
    <div className="space-y-1">
      {tree.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  )
}
