import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCategories, getTags } from '@/lib/queries/categories'
import { PostForm } from '@/components/post/PostForm'

export const metadata = { title: 'Submit — Vibehaus' }

export default async function SubmitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [categories, tags] = await Promise.all([getCategories(), getTags()])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-card rounded-lg border border-border p-6">
        <h1 className="text-xl font-bold mb-6">Share something with Vibehaus</h1>
        <PostForm categories={categories} tags={tags} />
      </div>
    </div>
  )
}
