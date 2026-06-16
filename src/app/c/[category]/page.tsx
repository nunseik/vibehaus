import { notFound } from 'next/navigation'
import { getCategoryFeed, type SortMode } from '@/lib/queries/posts'
import { getCategory } from '@/lib/queries/categories'
import { PostFeed } from '@/components/feed/PostFeed'
import { Sidebar } from '@/components/layout/Sidebar'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const cat = await getCategory(slug)
  if (!cat) return {}
  return { title: `${cat.icon} ${cat.name} — Vibehaus` }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params
  const { sort = 'hot' } = await searchParams
  const validSort = (['hot', 'new', 'top'] as const).includes(sort as SortMode)
    ? (sort as SortMode)
    : 'hot'

  const [cat, posts] = await Promise.all([
    getCategory(slug),
    getCategoryFeed(slug, validSort),
  ])

  if (!cat) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      <section>
        <div className="mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span>{cat.icon}</span>
            {cat.name}
          </h1>
          {cat.description && (
            <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
          )}
        </div>
        <PostFeed posts={posts} sort={validSort} baseHref={`/c/${slug}`} />
      </section>
      <Sidebar />
    </div>
  )
}
