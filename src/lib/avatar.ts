const STYLE = 'pixel-art'
const BASE = `https://api.dicebear.com/9.x/${STYLE}/svg`

export const AVATAR_SEEDS = [
  'wizard', 'ninja', 'hacker', 'coder', 'pixel', 'debug',
  'deploy', 'syntax', 'runtime', 'kernel', 'cursor', 'claude',
]

export function dicebearUrl(seed: string): string {
  return `${BASE}?seed=${encodeURIComponent(seed)}`
}

export function getAvatarUrl(seed: string | null | undefined, avatarUrl?: string | null): string {
  if (avatarUrl) return avatarUrl
  return dicebearUrl(seed ?? 'default')
}
