'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const username = formData.get('username') as string
  const bio = formData.get('bio') as string | null
  const website = formData.get('website') as string | null
  const twitter = formData.get('twitter') as string | null
  const github = formData.get('github') as string | null
  const favoriteModels = (formData.get('favorite_models') as string | null)
    ?.split(',').map((s) => s.trim()).filter(Boolean) ?? []
  const techStack = (formData.get('tech_stack') as string | null)
    ?.split(',').map((s) => s.trim()).filter(Boolean) ?? []
  const languages = (formData.get('languages') as string | null)
    ?.split(',').map((s) => s.trim()).filter(Boolean) ?? []

  const { error } = await supabase
    .from('profiles')
    .update({
      username: username.trim(),
      bio: bio?.trim() || null,
      website: website?.trim() || null,
      twitter: twitter?.trim() || null,
      github: github?.trim() || null,
      favorite_models: favoriteModels,
      tech_stack: techStack,
      languages,
    })
    .eq('id', user.id)

  if (error) throw error
  revalidatePath(`/u/${username}`)
  redirect(`/u/${username}`)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
