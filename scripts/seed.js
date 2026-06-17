// Demo seed script — creates users, profiles, posts, votes, and comments
// Requires SUPABASE_SECRET_KEY in .env.local
//
// Usage:
//   node scripts/seed.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local manually (no dotenv dependency)
const envPath = path.join(__dirname, '../.env.local')
const envVars = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .filter(line => line && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, ...rest] = line.split('=')
    if (key) acc[key.trim()] = rest.join('=').trim()
    return acc
  }, {})

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_ROLE_KEY = envVars['SUPABASE_SECRET_KEY']

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// --- Seed data ---------------------------------------------------------

const USERS = [
  {
    email: 'cursor_wizard@vibehaus.dev',
    password: 'demo1234',
    username: 'cursor_wizard',
    bio: 'I build full-stack apps in a weekend using Cursor + Claude. Indie hacker by day, prompt engineer by night.',
    favorite_models: ['claude-opus-4', 'gpt-4o'],
    tech_stack: ['Next.js', 'Supabase', 'Tailwind', 'Vercel'],
    languages: ['TypeScript', 'Python'],
    website: 'https://cursor.so',
  },
  {
    email: 'prompt_poet@vibehaus.dev',
    password: 'demo1234',
    username: 'prompt_poet',
    bio: 'Crafting prompts is an art form. I write prompts for a living and share what works.',
    favorite_models: ['claude-opus-4', 'claude-sonnet-4'],
    tech_stack: ['Python', 'LangChain', 'FastAPI'],
    languages: ['Python', 'JavaScript'],
    website: null,
  },
  {
    email: 'zero_to_saas@vibehaus.dev',
    password: 'demo1234',
    username: 'zero_to_saas',
    bio: 'Went from zero coding experience to shipping my first SaaS in 3 months with AI. Ask me anything.',
    favorite_models: ['gpt-4o', 'claude-sonnet-4'],
    tech_stack: ['Next.js', 'Stripe', 'Supabase'],
    languages: ['TypeScript'],
    website: null,
  },
  {
    email: 'debug_duchess@vibehaus.dev',
    password: 'demo1234',
    username: 'debug_duchess',
    bio: 'Senior dev learning to trust AI-generated code. Spoiler: it still needs review.',
    favorite_models: ['claude-opus-4'],
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    languages: ['TypeScript', 'Go', 'Rust'],
    website: null,
  },
  {
    email: 'model_hopper@vibehaus.dev',
    password: 'demo1234',
    username: 'model_hopper',
    bio: 'I test every new model the day it drops. Always chasing the best context window.',
    favorite_models: ['claude-opus-4', 'gemini-2.5-pro', 'gpt-4o', 'deepseek-r1'],
    tech_stack: ['Python', 'Ollama', 'LiteLLM'],
    languages: ['Python', 'TypeScript', 'Bash'],
    website: null,
  },
]

const POSTS = [
  {
    authorIndex: 0, // cursor_wizard
    category: 'cursor-tips',
    title: 'The .cursorrules file changed everything for me',
    body: `I spent weeks frustrated that Cursor kept forgetting my project conventions. Then I found .cursorrules.

Here's the template I now copy into every new project:

\`\`\`
You are an expert TypeScript/Next.js developer.
- Always use Server Components unless interactivity is needed
- Prefer Tailwind CSS over inline styles
- Use Supabase for auth and database
- Never use any; use proper types
- Functions should do one thing
\`\`\`

The difference is night and day. Claude now writes code that actually fits my codebase on the first try.`,
    tags: ['tip', 'productivity'],
  },
  {
    authorIndex: 1, // prompt_poet
    category: 'prompt-engineering',
    title: 'Stop asking AI to "write code" — ask it to "think through" first',
    body: `The single biggest improvement to my prompts came from separating thinking from doing.

❌ Bad: "Write a function that parses CSV files and validates the data"

✅ Good: "Think through the edge cases in CSV parsing — what can go wrong? Now write a function that handles all of them."

The second prompt gets you error handling for:
- Empty files
- Inconsistent delimiters
- Unicode in headers
- Rows with wrong column counts

AI is a better coder when you make it reason before it acts.`,
    tags: ['tip', 'discussion'],
  },
  {
    authorIndex: 2, // zero_to_saas
    category: 'showcase',
    title: 'I shipped a SaaS with zero CS degree — here\'s my stack',
    body: `18 months ago I couldn't read a stack trace. Last week I hit $400 MRR on my first product.

**What I built:** A niche invoicing tool for freelance video editors.

**My stack (chosen because Claude knows it well):**
- Next.js App Router
- Supabase (auth + db)
- Stripe
- Vercel

**The honest truth about vibe coding:**
- 60% of the code was AI-written
- 30% was me editing AI code
- 10% was me actually understanding what I typed

The 10% matters more than the 90%. You still need to debug, deploy, and handle angry users.`,
    tags: ['discussion', 'resource'],
  },
  {
    authorIndex: 3, // debug_duchess
    category: 'debug-help',
    title: 'AI generated a race condition in my auth flow — how I found it',
    body: `Spent 3 days on a bug that only happened in production. Classic.

Claude wrote me a Next.js auth middleware that looked perfect. It was refreshing the session in middleware AND in the server component. Race condition on the cookie.

**How I debugged it:**
1. Added logs everywhere (Claude helped)
2. Realized two places were writing the same cookie simultaneously
3. Asked Claude "can this code have race conditions?" — it immediately spotted it

**Lesson:** Ask Claude to audit its own code for race conditions, especially anything touching auth or state. It'll find what it wrote.`,
    tags: ['discussion', 'advanced'],
  },
  {
    authorIndex: 4, // model_hopper
    category: 'claude-tips',
    title: 'Claude Opus 4 vs Sonnet 4 for coding: when to use which',
    body: `After burning through my API budget so you don't have to:

**Use Opus 4 for:**
- Complex refactors across multiple files
- Architecting from scratch
- When it gets something wrong repeatedly (it self-corrects better)
- Anything touching auth, payments, or security

**Use Sonnet 4 for:**
- Single-file changes
- Writing tests
- Documentation
- Anything where you have a clear spec

**The math:** Opus is ~5x the cost of Sonnet. For most daily tasks Sonnet is good enough. But don't cheap out when the problem is actually hard.`,
    tags: ['tip', 'review'],
  },
  {
    authorIndex: 0, // cursor_wizard
    category: 'tools',
    title: 'My complete vibe coding toolkit in 2026',
    body: `People keep asking what tools I use. Here's the full list:

**Editor:** Cursor (Composer for big refactors, chat for quick questions)
**AI Models:** Claude Opus 4 for hard stuff, Sonnet 4 for everything else
**Database:** Supabase (the auth + RLS combo is unbeatable for solo devs)
**Deploy:** Vercel — zero config, just push
**Payments:** Stripe — Claude knows it inside out
**Monitoring:** Sentry free tier

**What I don't use:**
- Prisma (Supabase JS client is enough)
- Redux (server state + Zustand for client)
- CSS-in-JS (Tailwind all day)

Total monthly cost before revenue: ~$40`,
    tags: ['resource', 'productivity'],
  },
  {
    authorIndex: 1, // prompt_poet
    category: 'prompt-engineering',
    title: 'The "rubber duck" prompt technique',
    body: `Explain your problem to Claude like it's a rubber duck — except this duck talks back.

Instead of: "Fix this bug"

Try: "I'm going to explain a bug to you. Don't write any code yet. Just ask me clarifying questions until you fully understand the problem."

This forces YOU to articulate the problem properly. Half the time you figure out the bug yourself mid-explanation. The other half, Claude's clarifying questions reveal an assumption you didn't know you were making.

Stolen from pair programming. Works even better with AI because it never gets bored.`,
    tags: ['tip', 'beginner'],
  },
  {
    authorIndex: 2, // zero_to_saas
    category: 'career',
    title: 'Vibe coding is a real career path now — here\'s the evidence',
    body: `Controversial take: you don't need to be a traditional software engineer to build software products in 2026.

**What the market is paying for:**
- Product sense (knowing what to build)
- Prompt engineering (knowing how to build it with AI)
- Distribution (knowing how to sell it)

I'm making more from my AI-built tools than most junior devs at FAANG. Not because my code is better — it's probably worse. But because I ship every week and they're stuck in sprint planning.

The ceiling is real: you hit walls that require deep CS knowledge. But for 80% of SaaS use cases, vibe coding gets you there faster.`,
    tags: ['discussion'],
  },
]

const COMMENTS = [
  {
    postIndex: 0, // cursorrules post
    authorIndex: 3, // debug_duchess
    body: 'Huge +1 on this. I also add "always handle loading and error states" to my rules. Saved me so many incomplete UI components.',
  },
  {
    postIndex: 0,
    authorIndex: 2, // zero_to_saas
    body: 'Does this work in VS Code with Copilot or is it Cursor-specific?',
  },
  {
    postIndex: 1, // prompt_poet post
    authorIndex: 0, // cursor_wizard
    body: 'This is the best prompt advice I\'ve read all year. The "think before doing" pattern also works great for database schema design.',
  },
  {
    postIndex: 4, // opus vs sonnet post
    authorIndex: 3, // debug_duchess
    body: 'The security callout is important. I always use Opus for anything touching auth or payments. The cost difference is nothing compared to a prod incident.',
  },
  {
    postIndex: 2, // zero to saas showcase
    authorIndex: 4, // model_hopper
    body: 'Congrats on $400 MRR! What\'s your CAC looking like?',
  },
]

// --- Helpers -----------------------------------------------------------

function log(msg) {
  console.log(`  ${msg}`)
}

// --- Main --------------------------------------------------------------

async function main() {
  console.log('\n🌱 Seeding Vibehaus demo data...\n')

  // 1. Fetch categories and tags
  log('Fetching categories and tags...')
  const { data: categories } = await supabase.from('categories').select('id, slug')
  const { data: tags } = await supabase.from('tags').select('id, slug')
  const categoryMap = Object.fromEntries(categories.map(c => [c.slug, c.id]))
  const tagMap = Object.fromEntries(tags.map(t => [t.slug, t.id]))

  // 2. Create users
  log('Creating users...')
  const userIds = []
  for (const u of USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    })
    if (error) {
      console.error(`  Failed to create ${u.email}:`, error.message)
      process.exit(1)
    }
    userIds.push(data.user.id)
    log(`Created user: ${u.username} (${data.user.id})`)
  }

  // 3. Update profiles (trigger creates them; we patch with real data)
  log('\nUpdating profiles...')
  for (let i = 0; i < USERS.length; i++) {
    const u = USERS[i]
    const { error } = await supabase
      .from('profiles')
      .update({
        username: u.username,
        bio: u.bio,
        website: u.website ?? null,
        favorite_models: u.favorite_models,
        tech_stack: u.tech_stack,
        languages: u.languages,
      })
      .eq('id', userIds[i])
    if (error) {
      console.error(`  Failed to update profile for ${u.username}:`, error.message)
      process.exit(1)
    }
    log(`Updated profile: ${u.username}`)
  }

  // 4. Create posts
  log('\nCreating posts...')
  const postIds = []
  for (const p of POSTS) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: userIds[p.authorIndex],
        category_id: categoryMap[p.category],
        title: p.title,
        body: p.body,
      })
      .select('id')
      .single()
    if (error) {
      console.error(`  Failed to create post "${p.title}":`, error.message)
      process.exit(1)
    }
    postIds.push(data.id)

    // Attach tags
    if (p.tags?.length) {
      await supabase.from('post_tags').insert(
        p.tags.map(slug => ({ post_id: data.id, tag_id: tagMap[slug] }))
      )
    }
    log(`Created post: "${p.title}"`)
  }

  // 5. Create votes
  log('\nCreating votes...')
  const votes = [
    // post 0 (cursorrules) — popular
    { user: 1, post: 0, value: 1 },
    { user: 2, post: 0, value: 1 },
    { user: 3, post: 0, value: 1 },
    { user: 4, post: 0, value: 1 },
    // post 1 (think through) — popular
    { user: 0, post: 1, value: 1 },
    { user: 2, post: 1, value: 1 },
    { user: 3, post: 1, value: 1 },
    { user: 4, post: 1, value: 1 },
    // post 2 (zero to saas showcase)
    { user: 0, post: 2, value: 1 },
    { user: 1, post: 2, value: 1 },
    { user: 4, post: 2, value: 1 },
    // post 3 (race condition)
    { user: 0, post: 3, value: 1 },
    { user: 1, post: 3, value: 1 },
    { user: 4, post: 3, value: 1 },
    // post 4 (opus vs sonnet)
    { user: 0, post: 4, value: 1 },
    { user: 2, post: 4, value: 1 },
    { user: 3, post: 4, value: 1 },
    // post 5 (toolkit)
    { user: 1, post: 5, value: 1 },
    { user: 2, post: 5, value: 1 },
    { user: 3, post: 5, value: 1 },
    { user: 4, post: 5, value: 1 },
    // post 6 (rubber duck)
    { user: 0, post: 6, value: 1 },
    { user: 3, post: 6, value: 1 },
    // post 7 (career) — divisive
    { user: 0, post: 7, value: 1 },
    { user: 1, post: 7, value: 1 },
    { user: 3, post: 7, value: -1 },
    { user: 4, post: 7, value: 1 },
  ]
  for (const v of votes) {
    await supabase.from('votes').insert({
      user_id: userIds[v.user],
      post_id: postIds[v.post],
      value: v.value,
    })
  }
  log(`Created ${votes.length} votes`)

  // 6. Create comments
  log('\nCreating comments...')
  for (const c of COMMENTS) {
    const { error } = await supabase.from('comments').insert({
      post_id: postIds[c.postIndex],
      author_id: userIds[c.authorIndex],
      body: c.body,
    })
    if (error) {
      console.error(`  Failed to create comment:`, error.message)
    }
  }
  log(`Created ${COMMENTS.length} comments`)

  console.log('\n✅ Done! Demo data seeded.\n')
  console.log('Users (password: demo1234):')
  USERS.forEach(u => console.log(`  ${u.username} — ${u.email}`))
  console.log()
}

main().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
