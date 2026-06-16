import { Suspense } from 'react'
import { getFeed, type SortMode } from '@/lib/queries/posts'
import { PostFeed } from '@/components/feed/PostFeed'
import { Sidebar } from '@/components/layout/Sidebar'

interface HomeProps {
  searchParams: Promise<{ sort?: string }>
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { sort = 'hot' } = await searchParams
  const validSort = (['hot', 'new', 'top'] as const).includes(sort as SortMode)
    ? (sort as SortMode)
    : 'hot'

  const posts = await getFeed(validSort)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      <section>
        <PostFeed posts={posts} sort={validSort} baseHref="/" />
      </section>
      <Suspense>
        <Sidebar />
      </Suspense>
    </div>
  )
}
