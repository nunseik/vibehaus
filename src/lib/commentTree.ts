import type { CommentWithAuthor } from '@/lib/supabase/types'

export function buildTree(comments: CommentWithAuthor[]): CommentWithAuthor[] {
  const map = new Map<string, CommentWithAuthor>()
  const roots: CommentWithAuthor[] = []
  comments.forEach((c) => map.set(c.id, { ...c, replies: [] }))
  map.forEach((c) => {
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.replies!.push(c)
    } else {
      roots.push(c)
    }
  })
  return roots
}
