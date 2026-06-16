'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function castVote(postId: string, value: 1 | -1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check existing vote
  const { data: existing } = await supabase
    .from('votes')
    .select('value')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing?.value === value) {
    // Same vote → remove it (toggle off)
    await supabase.from('votes').delete().eq('user_id', user.id).eq('post_id', postId)
  } else if (existing) {
    // Different value → update
    await supabase.from('votes').update({ value }).eq('user_id', user.id).eq('post_id', postId)
  } else {
    // New vote
    await supabase.from('votes').insert({ user_id: user.id, post_id: postId, value })
  }

  revalidatePath('/')
}

export async function getUserVoteForPost(postId: string): Promise<1 | -1 | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('votes')
    .select('value')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  return (data?.value as 1 | -1) ?? null
}
