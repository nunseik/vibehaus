import Link from 'next/link'
import { getCategories } from '@/lib/queries/categories'
import { getCurrentUser } from '@/lib/queries/users'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut } from '@/lib/actions/profile'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CategoryIcon } from '@/lib/categoryIcons'
import { getAvatarUrl } from '@/lib/avatar'
import { ThemeToggle } from './ThemeToggle'

export async function Navbar() {
  const [categories, currentUser] = await Promise.all([getCategories(), getCurrentUser()])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg mr-2">
          <Zap className="w-5 h-5 text-emerald-500" />
          <span>Vibehaus</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 overflow-hidden">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/c/${cat.slug}`}
              className="px-2.5 py-1 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          {currentUser ? (
            <>
              <Link href="/submit" className={cn(buttonVariants({ size: 'sm' }))}>+ Post</Link>
              <Link href={`/u/${currentUser.username}`}>
                <Avatar className="w-7 h-7">
                  <AvatarImage src={getAvatarUrl(currentUser.username, currentUser.avatar_url)} />
                  <AvatarFallback className="text-xs">{currentUser.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
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
