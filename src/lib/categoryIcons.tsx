import { Hash, Wand2, MousePointer2, Bot, Wrench, Rocket, Bug, Briefcase } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<LucideProps>> = {
  'general':            Hash,
  'prompt-engineering': Wand2,
  'cursor-tips':        MousePointer2,
  'claude-tips':        Bot,
  'tools':              Wrench,
  'showcase':           Rocket,
  'debug-help':         Bug,
  'career':             Briefcase,
}

export function CategoryIcon({ slug, className = 'w-3.5 h-3.5' }: { slug: string; className?: string }) {
  const Icon = iconMap[slug] ?? Hash
  return <Icon className={className} />
}
