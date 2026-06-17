import { notFound, redirect } from 'next/navigation'
import { getPost } from '@/lib/queries/posts'
import { getCategories, getTags } from '@/lib/queries/categories'
import { createClient } from '@/lib/supabase/server'
import { PostForm } from '@/components/post/PostForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const [post, categories, tags, supabase] = await Promise.all([
    getPost(id),
    getCategories(),
    getTags(),
    createClient(),
  ])

  if (!post) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== post.author_id) redirect(`/post/${id}`)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h1 className="text-xl font-bold mb-6">Edit Post</h1>
        <PostForm
          categories={categories}
          tags={tags}
          post={{
            id: post.id,
            title: post.title,
            body: post.body,
            url: post.url,
            category_id: post.category_id,
            tags: post.tags ?? [],
          }}
        />
      </div>
    </div>
  )
}
