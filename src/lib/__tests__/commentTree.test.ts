import { describe, it, expect } from 'vitest'
import { buildTree } from '../commentTree'
import type { CommentWithAuthor } from '../supabase/types'

function makeComment(overrides: Partial<CommentWithAuthor> & { id: string }): CommentWithAuthor {
  return {
    id: overrides.id,
    post_id: 'post-1',
    author_id: 'user-1',
    parent_id: null,
    body: 'test body',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    profiles: { username: 'testuser', avatar_url: null },
    replies: [],
    ...overrides,
  }
}

describe('buildTree', () => {
  it('returns empty array for empty input', () => {
    expect(buildTree([])).toEqual([])
  })

  it('treats all top-level comments as roots', () => {
    const comments = [makeComment({ id: 'a' }), makeComment({ id: 'b' })]
    const tree = buildTree(comments)
    expect(tree).toHaveLength(2)
    expect(tree.map((c) => c.id)).toEqual(['a', 'b'])
  })

  it('nests a reply under its parent', () => {
    const comments = [
      makeComment({ id: 'parent' }),
      makeComment({ id: 'child', parent_id: 'parent' }),
    ]
    const tree = buildTree(comments)
    expect(tree).toHaveLength(1)
    expect(tree[0].replies).toHaveLength(1)
    expect(tree[0].replies![0].id).toBe('child')
  })

  it('supports multiple levels of nesting', () => {
    const comments = [
      makeComment({ id: 'root' }),
      makeComment({ id: 'child', parent_id: 'root' }),
      makeComment({ id: 'grandchild', parent_id: 'child' }),
    ]
    const tree = buildTree(comments)
    expect(tree).toHaveLength(1)
    const child = tree[0].replies![0]
    expect(child.id).toBe('child')
    expect(child.replies![0].id).toBe('grandchild')
  })

  it('promotes comment to root when its parent is not in the list', () => {
    const comments = [makeComment({ id: 'orphan', parent_id: 'missing-parent' })]
    const tree = buildTree(comments)
    expect(tree).toHaveLength(1)
    expect(tree[0].id).toBe('orphan')
  })

  it('initialises each node with an empty replies array', () => {
    const comments = [makeComment({ id: 'a', replies: undefined })]
    const tree = buildTree(comments)
    expect(tree[0].replies).toEqual([])
  })
})
