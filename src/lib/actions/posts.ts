'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const body = formData.get('body') as string | null
  const url = formData.get('url') as string | null
  const categoryId = formData.get('category_id') as string | null
  const tagIds = formData.getAll('tag_ids') as string[]

  if (!title?.trim()) throw new Error('Title is required')

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      title: title.trim(),
      body: body?.trim() || null,
      url: url?.trim() || null,
      category_id: categoryId ? parseInt(categoryId) : null,
    })
    .select('id')
    .single()

  if (error) throw error

  if (tagIds.length) {
    await supabase.from('post_tags').insert(
      tagIds.map((tid) => ({ post_id: post.id, tag_id: parseInt(tid) }))
    )
  }

  revalidatePath('/')
  redirect(`/post/${post.id}`)
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) throw error
  revalidatePath('/')
  redirect('/')
}
