'use client'

import { useRef, useState, useTransition } from 'react'
import { createComment } from '@/lib/actions/comments'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface CommentFormProps {
  postId: string
  parentId?: string
  onCancel?: () => void
}

export function CommentForm({ postId, parentId, onCancel }: CommentFormProps) {
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const ref = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setError(null)
    startTransition(async () => {
      try {
        await createComment(postId, body, parentId)
        setBody('')
        onCancel?.()
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        ref={ref}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        className="resize-none text-sm"
        disabled={isPending}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isPending || !body.trim()}>
          {isPending ? 'Posting…' : 'Comment'}
        </Button>
      </div>
    </form>
  )
}
