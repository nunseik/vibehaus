import { describe, it, expect, vi, beforeEach } from 'vitest'
import { castVote, getUserVoteForPost } from '../votes'

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
  for (const m of ['select', 'eq', 'delete', 'update', 'insert']) {
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

describe('castVote', () => {
  it('throws when user is not authenticated', async () => {
    makeSupabase(null)
    await expect(castVote('post-1', 1)).rejects.toThrow('Not authenticated')
  })

  it('deletes vote when casting the same value (toggle off)', async () => {
    const { _chain } = makeSupabase()
    _chain.single.mockResolvedValueOnce({ data: { value: 1 }, error: null })

    await castVote('post-1', 1)

    expect(_chain.delete).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })

  it('updates vote when casting a different value', async () => {
    const { _chain } = makeSupabase()
    _chain.single.mockResolvedValueOnce({ data: { value: -1 }, error: null })

    await castVote('post-1', 1)

    expect(_chain.update).toHaveBeenCalledWith({ value: 1 })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })

  it('inserts a new vote when none exists', async () => {
    const { _chain } = makeSupabase()
    _chain.single.mockResolvedValueOnce({ data: null, error: null })

    await castVote('post-1', 1)

    expect(_chain.insert).toHaveBeenCalledWith({ user_id: 'user-1', post_id: 'post-1', value: 1 })
    expect(mockRevalidatePath).toHaveBeenCalledWith('/')
  })
})

describe('getUserVoteForPost', () => {
  it('returns null when user is not authenticated', async () => {
    makeSupabase(null)
    const result = await getUserVoteForPost('post-1')
    expect(result).toBeNull()
  })

  it('returns the stored vote value', async () => {
    const { _chain } = makeSupabase()
    _chain.single.mockResolvedValueOnce({ data: { value: -1 }, error: null })

    const result = await getUserVoteForPost('post-1')
    expect(result).toBe(-1)
  })

  it('returns null when no vote row exists', async () => {
    makeSupabase()
    // single resolves to { data: null } by default
    const result = await getUserVoteForPost('post-1')
    expect(result).toBeNull()
  })
})
