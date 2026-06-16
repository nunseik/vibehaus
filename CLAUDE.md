# Vibehaus

A Reddit/Facebook-style community platform for vibe coders — people who build software using AI tools. Users share tips, tricks, and projects; vote posts up/down; browse by category; and maintain profiles that showcase their AI stack, programming languages, and favorite models.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (magic link + GitHub OAuth) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |

## Local Dev Setup

### Prerequisites
- Node.js 20+
- A Docker-compatible runtime. **Colima** works (no Docker Desktop required).

### Using Colima (instead of Docker Desktop)
```bash
colima start --cpu 2 --memory 4
```
Colima exposes its socket at `~/.colima/default/docker.sock`. The Supabase
CLI defaults to `/var/run/docker.sock`, so prefix every `supabase` command
with `DOCKER_HOST`:
```bash
export DOCKER_HOST="unix://$HOME/.colima/default/docker.sock"
```
Add that line to your `~/.zshrc` to avoid repeating it. (Alternatively,
`sudo ln -s ~/.colima/default/docker.sock /var/run/docker.sock`.)

> Note: `[analytics]` is disabled in `supabase/config.toml`. Its `vector`
> container tries to bind-mount the Docker socket, which fails on Colima's
> forwarded socket. Analytics/logging is optional for local dev.

### 1. Install dependencies
```bash
npm install
```

### 2. Start local Supabase
```bash
npx supabase start
```
This prints your local credentials. Copy the `API URL` and `anon key`
(run `npx supabase status` to see them again). Note: recent CLI versions
also show new-style `PUBLISHABLE_KEY`/`SECRET_KEY` — but the legacy
`ANON_KEY` JWT is what `.env.local` uses.

### 3. Set up environment
```bash
cp .env.local.example .env.local
# Edit .env.local with values from `supabase start` output
```

### 4. Run migrations
```bash
npx supabase db reset
# or for incremental:
npx supabase migration up
```

### 5. Start the dev server
```bash
npm run dev
```

Open http://localhost:3000.

### Useful Supabase commands
```bash
npx supabase status          # show running services + credentials
npx supabase db studio       # open database UI at localhost:54323
npx supabase db reset        # wipe and re-run all migrations
npx supabase stop            # stop local containers
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home feed
│   ├── auth/page.tsx       # Sign in / sign up
│   ├── c/[category]/       # Category feed
│   ├── post/[id]/          # Single post + comments
│   ├── submit/             # Create post
│   ├── u/[username]/       # User profile
│   └── settings/           # Profile settings
├── components/
│   ├── feed/               # PostCard, PostFeed, VoteButtons
│   ├── layout/             # Navbar, Sidebar
│   ├── post/               # PostForm, CommentThread, CommentForm
│   └── profile/            # ProfileHeader
├── lib/
│   ├── supabase/           # client.ts, server.ts, types.ts
│   ├── actions/            # Server actions: posts, votes, comments, profile
│   └── queries/            # Read-only DB queries: posts, users, categories
└── middleware.ts            # Session refresh (required by @supabase/ssr)
```

## Database Schema

All migrations are in `supabase/migrations/`. Run `npx supabase db reset` to apply all of them.

| Migration | What it creates |
|---|---|
| 001_profiles.sql | `profiles` table + auto-create trigger on auth signup |
| 002_categories.sql | `categories` table + seed data (8 categories) |
| 003_posts.sql | `posts` table with RLS |
| 004_tags.sql | `tags` + `post_tags` junction + seed tags |
| 005_votes.sql | `votes` table + trigger to update post score/counts |
| 006_comments.sql | `comments` table + trigger to update comment_count |
| 007_featured_view.sql | `featured_users` view (top 10 by score, last 30 days) |
| 008_grants.sql | Table-level `GRANT`s for `anon`/`authenticated` roles |

> **Why 008_grants.sql matters:** RLS policies decide *which rows* a role can
> see, but PostgREST also needs table-level `GRANT`s or every query fails with
> `permission denied for table`. Both layers are required. Any new table needs
> a matching GRANT here.

### Key design decisions
- **Denormalized counts**: `posts.score`, `upvote_count`, `downvote_count`, `comment_count` are kept in sync by DB triggers. Feed queries never need aggregation joins.
- **Postgres arrays**: `profiles.favorite_models`, `tech_stack`, `languages` are `text[]` — simple to query, no junction tables needed.
- **RLS on all tables**: all public tables require Row Level Security. Anon users get read access; mutations require auth.

## Architecture Patterns

### Adding a new page
1. Create `src/app/your-route/page.tsx` as an `async` Server Component
2. Fetch data using functions from `src/lib/queries/`
3. Pass data as props to Client Components that need interactivity

### Adding a server action
1. Create/update a file in `src/lib/actions/` with `'use server'` at the top
2. Call `createClient()` from `src/lib/supabase/server.ts`
3. Always call `revalidatePath()` after mutations
4. Call from a `<form action={yourAction}>` or `startTransition(async () => await yourAction(...))`

### Adding a query
1. Add a function to `src/lib/queries/` that calls `createClient()` from `src/lib/supabase/server.ts`
2. Use it directly in Server Components (no `useEffect` needed)

### Voting
Voting uses React 19's `useOptimistic` in `VoteButtons.tsx` for instant UI feedback. The DB trigger in `005_votes.sql` handles score recalculation atomically. Voting the same value twice toggles the vote off (handled in `src/lib/actions/votes.ts`).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (local: `http://127.0.0.1:54321`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

## Deploying to Production

1. Create a project at supabase.com
2. Run `npx supabase db push` to apply migrations to the cloud project
3. Enable GitHub OAuth in Supabase Dashboard → Auth → Providers
4. Add the production URL as a redirect URL in Supabase Auth settings
5. Deploy to Vercel: `npx vercel` and set the two env vars

## Running Tests / Type Checks

```bash
npm run build       # full type check + build
npx tsc --noEmit    # type check only
```
