-- Featured users: top 10 by total post score in last 30 days
CREATE OR REPLACE VIEW public.featured_users AS
SELECT
  p.author_id,
  pr.username,
  pr.avatar_url,
  pr.bio,
  pr.favorite_models,
  pr.tech_stack,
  pr.languages,
  SUM(p.score) AS total_score,
  COUNT(p.id)  AS post_count
FROM public.posts p
JOIN public.profiles pr ON pr.id = p.author_id
WHERE p.created_at > now() - interval '30 days'
GROUP BY p.author_id, pr.username, pr.avatar_url, pr.bio, pr.favorite_models, pr.tech_stack, pr.languages
ORDER BY total_score DESC
LIMIT 10;
