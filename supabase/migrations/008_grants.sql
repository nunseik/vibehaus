-- Grant table-level privileges to the API roles.
-- RLS policies control WHICH rows are accessible; these GRANTs control
-- whether the role may touch the table at all. Both are required.

-- Read access for everyone (RLS still applies)
GRANT SELECT ON
  public.profiles,
  public.categories,
  public.posts,
  public.tags,
  public.post_tags,
  public.votes,
  public.comments
TO anon, authenticated;

GRANT SELECT ON public.featured_users TO anon, authenticated;

-- Write access for signed-in users (RLS restricts to their own rows)
GRANT INSERT, UPDATE, DELETE ON
  public.profiles,
  public.posts,
  public.post_tags,
  public.votes,
  public.comments
TO authenticated;

-- Sequences backing serial PKs (categories.id, tags.id) — needed if
-- authenticated users ever insert into those tables in future
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
