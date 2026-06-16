CREATE TABLE public.tags (
  id    serial PRIMARY KEY,
  slug  text UNIQUE NOT NULL,
  name  text NOT NULL
);

CREATE TABLE public.post_tags (
  post_id  uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id   integer REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are publicly readable"
  ON public.tags FOR SELECT USING (true);

CREATE POLICY "Post tags are publicly readable"
  ON public.post_tags FOR SELECT USING (true);

CREATE POLICY "Authors can tag their own posts"
  ON public.post_tags FOR INSERT WITH CHECK (
    auth.uid() = (SELECT author_id FROM public.posts WHERE id = post_id)
  );

CREATE POLICY "Authors can remove tags from their own posts"
  ON public.post_tags FOR DELETE USING (
    auth.uid() = (SELECT author_id FROM public.posts WHERE id = post_id)
  );

INSERT INTO public.tags (slug, name) VALUES
  ('tip',             'Tip'),
  ('tutorial',        'Tutorial'),
  ('question',        'Question'),
  ('discussion',      'Discussion'),
  ('resource',        'Resource'),
  ('ai-generated',    'AI Generated'),
  ('review',          'Review'),
  ('open-source',     'Open Source'),
  ('productivity',    'Productivity'),
  ('beginner',        'Beginner'),
  ('advanced',        'Advanced');
