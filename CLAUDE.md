# Vibehaus

A Reddit/Facebook-style community platform for vibe coders — people who build software using AI tools. Users share tips, tricks, and projects; vote posts up/down; browse by category; and maintain profiles that showcase their AI stack, programming languages, and favorite models.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Database | Supabase cloud (PostgreSQL) — project `tczeoaadasbgxjwhnklc` |
| Auth | Supabase Auth (email/password + Google OAuth + GitHub OAuth) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |

## Dev Setup

### Prerequisites
- Node.js 20+

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.local.example .env.local
# Fill in values from Supabase Dashboard → Project Settings → API
```

### 3. Start the dev server
```bash
npm run dev
```

Open http://localhost:3000.

> **Port 3000 is required** — OAuth callbacks (Google, GitHub) are configured to redirect through it. If port 3000 is in use, free it before starting.

## Environment Variables

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Project Settings → API (publishable/anon key) |
| `SUPABASE_SECRET_KEY` | Supabase Dashboard → Project Settings → API (secret key — only needed for `scripts/seed.js`) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home feed
│   ├── auth/page.tsx       # Sign in / sign up (email+password, Google, GitHub)
│   ├── auth/callback/      # OAuth + magic link callback handler
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
└── proxy.ts                # Session refresh middleware (required by @supabase/ssr)
scripts/
└── seed.js                 # Demo data seed (5 users, 8 posts, votes, comments)
```

## Database Schema

All migrations are in `supabase/migrations/`. The cloud DB is already up to date.
To push new migrations: `npx supabase db push`.

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

### Auth
- Email/password — `signInWithPassword` / `signUp` (email confirmation disabled for now)
- OAuth — `signInWithOAuth({ provider: 'google' | 'github' })` redirects to `/auth/callback`
- Session refresh — `src/proxy.ts` runs on every request via Next.js middleware

## Seeding Demo Data

```bash
# Requires SUPABASE_SECRET_KEY in .env.local
node scripts/seed.js
```

Creates 5 users (password: `demo1234`): `cursor_wizard`, `prompt_poet`, `zero_to_saas`, `debug_duchess`, `model_hopper`.

## Deploying to Vercel

1. Push changes to GitHub (`git push`)
2. Import repo at vercel.com → New Project
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy — Vercel auto-detects Next.js
5. After deploy, add production URL to Supabase Auth → URL Configuration:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`
6. Add production URL to Google OAuth app (Homepage URL + callback)
7. Add production URL to GitHub OAuth app (Homepage URL + callback)

## OAuth Setup

Both providers use the same Supabase callback URL:
```
https://tczeoaadasbgxjwhnklc.supabase.co/auth/v1/callback
```

| Provider | Where to configure |
|---|---|
| Google | console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client |
| GitHub | github.com → Settings → Developer settings → OAuth Apps |

Enable each provider in Supabase Dashboard → Authentication → Providers.

## Running Tests / Type Checks

```bash
npm run build       # full type check + build
npx tsc --noEmit    # type check only
```

## Local Dev with Supabase (optional)

If you want to develop against a local Supabase instance instead of the cloud project, you'll need Docker or Colima. See git history for the original local setup instructions, or refer to the [Supabase local dev docs](https://supabase.com/docs/guides/local-development).
