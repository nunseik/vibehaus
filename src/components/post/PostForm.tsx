'use client'

import { useTransition, useState } from 'react'
import { createPost, updatePost } from '@/lib/actions/posts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { Category, Tag } from '@/lib/supabase/types'

interface PostFormProps {
  categories: Category[]
  tags: Tag[]
  post?: {
    id: string
    title: string
    body: string | null
    url: string | null
    category_id: number | null
    tags: { id: number }[]
  }
}

export function PostForm({ categories, tags, post }: PostFormProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedTags, setSelectedTags] = useState<number[]>(
    post?.tags.map((t) => t.id) ?? []
  )
  const isEditing = !!post

  function toggleTag(id: number) {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  function handleSubmit(formData: FormData) {
    selectedTags.forEach((id) => formData.append('tag_ids', String(id)))
    startTransition(async () => {
      if (isEditing) {
        await updatePost(post.id, formData)
      } else {
        await createPost(formData)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="What are you sharing?"
          required
          maxLength={300}
          defaultValue={post?.title ?? ''}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="url">Link (optional)</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://..."
          defaultValue={post?.url ?? ''}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Body (optional)</Label>
        <Textarea
          id="body"
          name="body"
          placeholder="Share more details, code snippets, or context..."
          rows={6}
          className="resize-y"
          defaultValue={post?.body ?? ''}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category_id">Category</Label>
        <select
          id="category_id"
          name="category_id"
          defaultValue={post?.category_id ?? ''}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}>
              <Badge
                variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                className="cursor-pointer"
              >
                {tag.name}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (isEditing ? 'Saving…' : 'Publishing…') : (isEditing ? 'Save Changes' : 'Publish Post')}
      </Button>
    </form>
  )
}
