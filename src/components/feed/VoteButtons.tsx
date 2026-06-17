'use client'

import { useOptimistic, useTransition } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { castVote } from '@/lib/actions/votes'
import { cn } from '@/lib/utils'

interface VoteButtonsProps {
  postId: string
  initialScore: number
  initialUserVote: 1 | -1 | null
}

export function VoteButtons({ postId, initialScore, initialUserVote }: VoteButtonsProps) {
  const [, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(
    { score: initialScore, userVote: initialUserVote },
    (state, newVote: 1 | -1) => {
      if (state.userVote === newVote) {
        return { score: state.score - newVote, userVote: null }
      }
      const delta = newVote - (state.userVote ?? 0)
      return { score: state.score + delta, userVote: newVote }
    }
  )

  function handleVote(value: 1 | -1) {
    startTransition(async () => {
      setOptimistic(value)
      await castVote(postId, value)
    })
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={() => handleVote(1)}
        className={cn(
          'p-1 rounded hover:bg-muted transition-colors',
          optimistic.userVote === 1 ? 'text-emerald-600' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Upvote"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <span className={cn(
        'text-xs font-semibold tabular-nums',
        optimistic.userVote === 1 && 'text-emerald-600',
        optimistic.userVote === -1 && 'text-muted-foreground'
      )}>
        {optimistic.score}
      </span>
      <button
        onClick={() => handleVote(-1)}
        className={cn(
          'p-1 rounded hover:bg-muted transition-colors',
          optimistic.userVote === -1 ? 'text-zinc-400' : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Downvote"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  )
}
