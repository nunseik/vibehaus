import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createComment, deleteComment } from '../comments'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const mockCreateClient = vi.mocked(createClient)
const mockRevalidatePath = vi.mocked(revalidatePath)

function makeChain() {
  const chain: any = {
    then(res: Function, rej?: Function) {
      return Promise.resolve({ data: null, error: null }).then(res as any, rej as any)
    },
  }
  for (const m of ['select', 'eq', 'delete', 'insert']) {
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

beforeEach(() => {
  vi.clearAllMocks()
})

describe('createComment', () => {
  it('throws when user is not authenticated', async () => {
    makeSupabase(null)
    await expect(createComment('post-1', 'hello')).rejects.toThrow('Not authenticated')
  })

  it('throws when body is empty', async () => {
    makeSupabase()
    await expect(createComment('post-1', '')).rejects.toThrow('Comment body is required')
  })

  it('throws when body is only whitespace', async () => {
    makeSupabase()
    await expect(createComment('post-1', '   ')).rejects.toThrow('Comment body is required')
  })

  it('inserts a top-level comment without parentId', async () => {
    const { _chain } = makeSupabase()

    await createComment('post-1', 'Great post!')

    expect(_chain.insert).toHaveBeenCalledWith({
      post_id: 'post-1',
      author_id: 'user-1',
      parent_id: null,
      body: 'Great post!',
    })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/post/post-1')
  })

  it('inserts a reply with parentId', async () => {
    const { _chain } = makeSupabase()

    await createComment('post-1', 'Great reply!', 'comment-parent')

    expect(_chain.insert).toHaveBeenCalledWith({
      post_id: 'post-1',
      author_id: 'user-1',
      parent_id: 'comment-parent',
      body: 'Great reply!',
    })
  })

  it('trims whitespace from body before inserting', async () => {
    const { _chain } = makeSupabase()

    await createComment('post-1', '  trimmed  ')

    expect(_chain.insert).toHaveBeenCalledWith(expect.objectContaining({ body: 'trimmed' }))
  })
})

describe('deleteComment', () => {
  it('throws when user is not authenticated', async () => {
    makeSupabase(null)
    await expect(deleteComment('comment-1', 'post-1')).rejects.toThrow('Not authenticated')
  })

  it('deletes with matching comment id and author id', async () => {
    const { _chain } = makeSupabase()

    await deleteComment('comment-1', 'post-1')

    expect(_chain.delete).toHaveBeenCalled()
    expect(_chain.eq).toHaveBeenCalledWith('id', 'comment-1')
    expect(_chain.eq).toHaveBeenCalledWith('author_id', 'user-1')
    expect(mockRevalidatePath).toHaveBeenCalledWith('/post/post-1')
  })
})
