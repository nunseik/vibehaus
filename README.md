# Vibehaus

A community platform for vibe coders — people who build software with AI tools. Share tips, tricks, and projects; vote posts up or down; browse by category; and maintain a profile showcasing your AI stack, favorite models, and programming languages.

## Features

- **Feed** — hot / new / top sorting with denormalized scores
- **Categories** — general, prompt-engineering, cursor-tips, claude-tips, tools, showcase, debug-help, career
- **Voting** — optimistic UI with React 19 `useOptimistic`, DB trigger handles score updates atomically
- **Comments** — threaded up to 3 levels deep
- **Profiles** — bio, AI stack, favorite models, languages, post history
- **Featured users** — top 10 contributors by score in the last 30 days
- **Auth** — magic link + GitHub OAuth via Supabase Auth (PKCE flow)

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase account (or local Supabase via Docker/Colima)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.local.example .env.local
# Fill in your Supabase project URL and anon key
```

### 3. Apply database migrations

```bash
npx supabase db push
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Local Development (with Colima)

See [CLAUDE.md](CLAUDE.md) for full local dev setup instructions including Colima configuration.

## Deployment

1. Create a project at [supabase.com](https://supabase.com)
2. Run `npx supabase db push` to apply migrations
3. Enable GitHub OAuth in Supabase Dashboard → Auth → Providers
4. Deploy to Vercel and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
