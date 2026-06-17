'use client'

import { useState } from 'react'
import { AVATAR_SEEDS, dicebearUrl } from '@/lib/avatar'
import Image from 'next/image'

export function AvatarPicker({ currentAvatarUrl }: { currentAvatarUrl?: string | null }) {
  const [selected, setSelected] = useState(currentAvatarUrl ?? dicebearUrl(AVATAR_SEEDS[0]))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2">
        {AVATAR_SEEDS.map((seed) => {
          const url = dicebearUrl(seed)
          const isSelected = selected === url
          return (
            <button
              key={seed}
              type="button"
              onClick={() => setSelected(url)}
              className={`rounded-lg border-2 p-0.5 transition-colors ${
                isSelected ? 'border-emerald-500' : 'border-border hover:border-muted-foreground'
              }`}
              title={seed}
            >
              <img src={url} alt={seed} width={48} height={48} className="rounded w-full" />
            </button>
          )
        })}
      </div>
      <input type="hidden" name="avatar_url" value={selected} />
    </div>
  )
}
