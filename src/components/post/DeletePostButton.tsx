'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deletePost } from '@/lib/actions/posts'
import { Button } from '@/components/ui/button'

export function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    startTransition(async () => {
      await deletePost(postId)
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="h-7 px-2 text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </Button>
  )
}
