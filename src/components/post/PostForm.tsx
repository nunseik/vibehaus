'use client'

import { useTransition } from 'react'
import { createPost } from '@/lib/actions/posts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { Category, Tag } from '@/lib/supabase/types'
import { useState } from 'react'

interface PostFormProps {
  categories: Category[]
  tags: Tag[]
}

export function PostForm({ categories, tags }: PostFormProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  function toggleTag(id: number) {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  function handleSubmit(formData: FormData) {
    selectedTags.forEach((id) => formData.append('tag_ids', String(id)))
    startTransition(async () => {
      await createPost(formData)
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" placeholder="What are you sharing?" required maxLength={300} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="url">Link (optional)</Label>
        <Input id="url" name="url" type="url" placeholder="https://..." />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Body (optional)</Label>
        <Textarea
          id="body"
          name="body"
          placeholder="Share more details, code snippets, or context..."
          rows={6}
          className="resize-y"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category_id">Category</Label>
        <select
          id="category_id"
          name="category_id"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
            >
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
        {isPending ? 'Publishing…' : 'Publish Post'}
      </Button>
    </form>
  )
}
