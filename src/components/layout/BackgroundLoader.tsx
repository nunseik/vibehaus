import { createClient } from '@/lib/supabase/server'
import { BackgroundApplier } from './BackgroundApplier'

export async function BackgroundLoader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('background_image_url')
    .eq('id', user.id)
    .single()

  return <BackgroundApplier url={data?.background_image_url ?? null} />
}
