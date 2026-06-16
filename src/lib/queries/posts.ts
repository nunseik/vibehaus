import { createClient } from '@/lib/supabase/server'
import type { PostWithAuthor } from '@/lib/supabase/types'

export type SortMode = 'hot' | 'new' | 'top'

const POST_SELECT = `
  *,
  profiles:author_id ( username, avatar_url ),
  categories:category_id ( slug, name, icon ),
  tags:post_tags ( tags ( id, slug, name ) )
`

function getOrderColumns(sort: SortMode): { column: string; ascending: boolean }[] {
  switch (sort) {
    case 'new':
      return [{ column: 'created_at', ascending: false }]
    case 'top':
      return [
        { column: 'score', ascending: false },
        { column: 'created_at', ascending: false },
      ]
    default:
      return [
        { column: 'created_at', ascending: false },
        { column: 'score', ascending: false },
      ]
  }
}

// Supabase returns nested tags as [{ tags: { id, slug, name } }] — flatten them
function normalizePostTags(posts: unknown[]): PostWithAuthor[] {
  return (posts as PostWithAuthor[]).map((post) => ({
    ...post,
    tags: (
      (post as unknown as { tags: { tags: { id: number; slug: string; name: string } }[] }).tags ?? []
    ).map((pt) => pt.tags),
  }))
}

export async function getFeed(sort: SortMode = 'hot', page = 0, limit = 25): Promise<PostWithAuthor[]> {
  const supabase = await createClient()
  const orders = getOrderColumns(sort)

  let query = supabase.from('posts').select(POST_SELECT).range(page * limit, (page + 1) * limit - 1)
  for (const o of orders) {
    query = query.order(o.column, { ascending: o.ascending })
  }

  const { data, error } = await query
  if (error) throw error
  return normalizePostTags(data ?? [])
}

export async function getCategoryFeed(
  categorySlug: string,
  sort: SortMode = 'hot',
  page = 0,
  limit = 25
): Promise<PostWithAuthor[]> {
  const supabase = await createClient()
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single()
  if (!cat) return []

  const orders = getOrderColumns(sort)
  let query = supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('category_id', cat.id)
    .range(page * limit, (page + 1) * limit - 1)

  for (const o of orders) {
    query = query.order(o.column, { ascending: o.ascending })
  }

  const { data, error } = await query
  if (error) throw error
  return normalizePostTags(data ?? [])
}

export async function getPost(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(`${POST_SELECT}, comments ( *, profiles:author_id ( username, avatar_url ) )`)
    .eq('id', id)
    .single()
  if (error) throw error
  if (!data) return null
  const [normalized] = normalizePostTags([data])
  return { ...normalized, comments: (data as unknown as { comments: unknown[] }).comments ?? [] }
}

export async function getUserPosts(username: string, sort: SortMode = 'new'): Promise<PostWithAuthor[]> {
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('id').eq('username', username).single()
  if (!profile) return []

  const orders = getOrderColumns(sort)
  let query = supabase.from('posts').select(POST_SELECT).eq('author_id', profile.id)
  for (const o of orders) {
    query = query.order(o.column, { ascending: o.ascending })
  }

  const { data, error } = await query
  if (error) throw error
  return normalizePostTags(data ?? [])
}

export async function getUserVotedPosts(username: string, value: 1 | -1): Promise<PostWithAuthor[]> {
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('id').eq('username', username).single()
  if (!profile) return []

  const { data: voteRows } = await supabase
    .from('votes')
    .select('post_id')
    .eq('user_id', profile.id)
    .eq('value', value)

  const ids = (voteRows ?? []).map((v) => v.post_id)
  if (!ids.length) return []

  const { data, error } = await supabase.from('posts').select(POST_SELECT).in('id', ids)
  if (error) throw error
  return normalizePostTags(data ?? [])
}
