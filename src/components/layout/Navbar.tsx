import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/queries/categories'
import { Button, buttonVariants } from '@/components/ui/button'
import { signOut } from '@/lib/actions/profile'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const categories = await getCategories()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg mr-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Vibehaus</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 overflow-hidden">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/c/${cat.slug}`}
              className="px-2.5 py-1 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <>
              <Link href="/submit" className={cn(buttonVariants({ size: 'sm' }))}>+ Post</Link>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit">Sign out</Button>
              </form>
            </>
          ) : (
            <Link href="/auth" className={cn(buttonVariants({ size: 'sm' }))}>Sign in</Link>
          )}
        </div>
      </div>
    </header>
  )
}
