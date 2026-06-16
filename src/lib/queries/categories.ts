import { createClient } from '@/lib/supabase/server'
import type { Category, Tag } from '@/lib/supabase/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('id')
  return (data ?? []) as Category[]
}

export async function getCategory(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).single()
  return data as Category | null
}

export async function getTags(): Promise<Tag[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('tags').select('*').order('name')
  return (data ?? []) as Tag[]
}
