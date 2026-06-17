'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface UnsplashPhoto {
  id: string
  urls: { small: string; regular: string }
  alt_description: string | null
  user: { name: string }
}

export function BackgroundPicker({ currentUrl }: { currentUrl?: string | null }) {
  const [query, setQuery] = useState('')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [selected, setSelected] = useState<string | null>(currentUrl ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function search() {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/unsplash/search?q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setPhotos(data.results ?? [])
    } catch {
      setError('Could not load images. Check your Unsplash API key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), search())}
          placeholder="Search backgrounds… e.g. mountains, space, abstract"
        />
        <Button type="button" variant="outline" onClick={search} disabled={loading}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {selected && (
        <div className="relative rounded-lg overflow-hidden h-28 group">
          <img src={selected} alt="Current background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-medium">Current background</span>
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove background"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading && <p className="text-sm text-muted-foreground text-center py-4">Searching…</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelected(photo.urls.regular)}
              className={`relative rounded-lg overflow-hidden aspect-video border-2 transition-all ${
                selected === photo.urls.regular
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
              title={photo.alt_description ?? photo.user.name}
            >
              <img
                src={photo.urls.small}
                alt={photo.alt_description ?? photo.user.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <input type="hidden" name="background_image_url" value={selected ?? ''} />
    </div>
  )
}
