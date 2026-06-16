import { createClient } from '@/lib/supabase/server'
import type { Profile, FeaturedUser } from '@/lib/supabase/types'

export async function getProfile(username: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()
  if (error) return null
  return data as Profile
}

export async function getFeaturedUsers(): Promise<FeaturedUser[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('featured_users').select('*')
  return (data ?? []) as FeaturedUser[]
}

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return profile as Profile | null
}
