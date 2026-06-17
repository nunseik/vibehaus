import { describe, it, expect } from 'vitest'
import { getOrderColumns, normalizePostTags } from '../posts'

describe('getOrderColumns', () => {
  it("'new' sorts by created_at descending", () => {
    expect(getOrderColumns('new')).toEqual([{ column: 'created_at', ascending: false }])
  })

  it("'top' sorts by score then created_at, both descending", () => {
    expect(getOrderColumns('top')).toEqual([
      { column: 'score', ascending: false },
      { column: 'created_at', ascending: false },
    ])
  })

  it("'hot' sorts by created_at then score, both descending", () => {
    expect(getOrderColumns('hot')).toEqual([
      { column: 'created_at', ascending: false },
      { column: 'score', ascending: false },
    ])
  })
})

describe('normalizePostTags', () => {
  it('flattens the nested Supabase join structure', () => {
    const raw = [
      {
        id: 'post-1',
        title: 'Hello',
        tags: [
          { tags: { id: 1, slug: 'ai', name: 'AI' } },
          { tags: { id: 2, slug: 'llm', name: 'LLM' } },
        ],
      },
    ]

    const result = normalizePostTags(raw)

    expect(result[0].tags).toEqual([
      { id: 1, slug: 'ai', name: 'AI' },
      { id: 2, slug: 'llm', name: 'LLM' },
    ])
  })

  it('returns an empty tags array when post has no tags', () => {
    const raw = [{ id: 'post-1', title: 'Hello', tags: [] }]
    const result = normalizePostTags(raw)
    expect(result[0].tags).toEqual([])
  })

  it('handles missing tags field (undefined) gracefully', () => {
    const raw = [{ id: 'post-1', title: 'Hello' }]
    const result = normalizePostTags(raw)
    expect(result[0].tags).toEqual([])
  })

  it('preserves other post fields unchanged', () => {
    const raw = [{ id: 'post-1', title: 'Hello', score: 42, tags: [] }]
    const result = normalizePostTags(raw)
    expect((result[0] as any).score).toBe(42)
    expect(result[0].id).toBe('post-1')
  })
})
