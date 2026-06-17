import { describe, it, expect } from 'vitest'
import { cn, formatDistanceToNow } from '../utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('drops falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, 'baz')).toBe('foo baz')
  })

  it('resolves tailwind conflicts — last wins', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})

describe('formatDistanceToNow', () => {
  const ago = (ms: number) => new Date(Date.now() - ms).toISOString()

  it('returns "just now" for under 60 seconds', () => {
    expect(formatDistanceToNow(ago(30_000))).toBe('just now')
    expect(formatDistanceToNow(ago(0))).toBe('just now')
  })

  it('returns minutes for 1–59 minutes', () => {
    expect(formatDistanceToNow(ago(5 * 60_000))).toBe('5m ago')
    expect(formatDistanceToNow(ago(59 * 60_000))).toBe('59m ago')
  })

  it('returns hours for 1–23 hours', () => {
    expect(formatDistanceToNow(ago(3 * 3_600_000))).toBe('3h ago')
    expect(formatDistanceToNow(ago(23 * 3_600_000))).toBe('23h ago')
  })

  it('returns days for 1–29 days', () => {
    expect(formatDistanceToNow(ago(10 * 86_400_000))).toBe('10d ago')
  })

  it('returns months for 1–11 months', () => {
    expect(formatDistanceToNow(ago(60 * 86_400_000))).toBe('2mo ago')
  })

  it('returns years for 12+ months', () => {
    expect(formatDistanceToNow(ago(400 * 86_400_000))).toBe('1y ago')
    expect(formatDistanceToNow(ago(800 * 86_400_000))).toBe('2y ago')
  })
})
