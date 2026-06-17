import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPost, deletePost } from '../posts'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const mockCreateClient = vi.mocked(createClient)
const mockRevalidatePath = vi.mocked(revalidatePath)
const mockRedirect = vi.mocked(redirect)

function makeChain() {
  const chain: any = {
    then(res: Function, rej?: Function) {
      return Promise.resolve({ data: null, error: null }).then(res as any, rej as any)
    },
  }
  for (const m of ['select', 'eq', 'delete', 'update', 'insert', 'order', 'range']) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }
  chain.single = vi.fn().mockResolvedValue({ data: null, error: null })
  return chain
}

function makeSupabase(userId: string | null = 'user-1') {
  const chain = makeChain()
  const client = {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: userId ? { id: userId } : null } }) },
    from: vi.fn().mockReturnValue(chain),
    _chain: chain,
  }
  mockCreateClient.mockResolvedValue(client as any)
  return client
}

function makeFormData(fields: Record<string, string | string[]>) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, v))
    } else {
      fd.append(key, value)
    }
  }
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('createPost', () => {
  it('throws when user is not authenticated', async () => {
    makeSupabase(null)
    await expect(createPost(makeFormData({ title: 'Hello' }))).rejects.toThrow('Not authenticated')
  })

  it('throws when title is missing', async () => {
    makeSupabase()
    await expect(createPost(makeFormData({ title: '' }))).rejects.toThrow('Title is required')
  })

  it('throws when title is only whitespace', async () => {
    makeSupabase()
    await expect(createPost(makeFormData({ title: '   ' }))).rejects.toThrow('Title is required')
  })

  it('inserts a post and redirects to its page', async () => {
    const { _chain } = makeSupabase()
    _chain.single.mockResolvedValueOnce({ data: { id: 'post-abc' }, error: null })

    await createPost(makeFormData({ title: 'My Post' }))

    expect(_chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ author_id: 'user-1', title: 'My Post' })
    )
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
    expect(mockRedirect).toHaveBeenCalledWith('/post/post-abc')
  })

  it('inserts post_tags when tag_ids are provided', async () => {
    const { _chain, from } = makeSupabase()
    _chain.single.mockResolvedValueOnce({ data: { id: 'post-xyz' }, error: null })

    await createPost(makeFormData({ title: 'Tagged Post', tag_ids: ['1', '2'] }))

    const postTagsCall = vi.mocked(from).mock.calls.find(([table]) => table === 'post_tags')
    expect(postTagsCall).toBeDefined()
    expect(_chain.insert).toHaveBeenCalledWith([
      { post_id: 'post-xyz', tag_id: 1 },
      { post_id: 'post-xyz', tag_id: 2 },
    ])
  })
})

describe('deletePost', () => {
  it('throws when user is not authenticated', async () => {
    makeSupabase(null)
    await expect(deletePost('post-1')).rejects.toThrow('Not authenticated')
  })

  it('deletes the post and redirects home', async () => {
    const { _chain } = makeSupabase()

    await deletePost('post-1')

    expect(_chain.delete).toHaveBeenCalled()
    expect(_chain.eq).toHaveBeenCalledWith('id', 'post-1')
    expect(_chain.eq).toHaveBeenCalledWith('author_id', 'user-1')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
    expect(mockRedirect).toHaveBeenCalledWith('/')
  })

  it('throws when the DB returns an error', async () => {
    const { _chain } = makeSupabase()
    // Override the thenable to return an error
    _chain.then = (res: Function, rej?: Function) =>
      Promise.resolve({ data: null, error: new Error('DB error') }).then(res as any, rej as any)

    await expect(deletePost('post-1')).rejects.toThrow('DB error')
  })
})
