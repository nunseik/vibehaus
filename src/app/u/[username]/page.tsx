import { notFound } from 'next/navigation'
import { getProfile } from '@/lib/queries/users'
import { getUserPosts, getUserVotedPosts } from '@/lib/queries/posts'
import { createClient } from '@/lib/supabase/server'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { PostCard } from '@/components/feed/PostCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ username: string }>
  searchParams: Promise<{ tab?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return { title: `@${username} — Vibehaus` }
}

export default async function UserPage({ params, searchParams }: Props) {
  const { username } = await params
  const { tab = 'posts' } = await searchParams

  const profile = await getProfile(username)
  if (!profile) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwnProfile = user?.id === profile.id

  const [posts, liked, disliked] = await Promise.all([
    getUserPosts(username),
    getUserVotedPosts(username, 1),
    getUserVotedPosts(username, -1),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="liked">Liked ({liked.length})</TabsTrigger>
          <TabsTrigger value="disliked">Disliked ({disliked.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-2 mt-4">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No posts yet.</p>
          ) : posts.map((post) => <PostCard key={post.id} post={post} />)}
        </TabsContent>

        <TabsContent value="liked" className="space-y-2 mt-4">
          {liked.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No liked posts.</p>
          ) : liked.map((post) => <PostCard key={post.id} post={post} />)}
        </TabsContent>

        <TabsContent value="disliked" className="space-y-2 mt-4">
          {disliked.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No disliked posts.</p>
          ) : disliked.map((post) => <PostCard key={post.id} post={post} />)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
