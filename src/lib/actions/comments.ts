'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createComment(postId: string, body: string, parentId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  if (!body?.trim()) throw new Error('Comment body is required')

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    author_id: user.id,
    parent_id: parentId ?? null,
    body: body.trim(),
  })

  if (error) throw error
  revalidatePath(`/post/${postId}`)
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('author_id', user.id)

  revalidatePath(`/post/${postId}`)
}
