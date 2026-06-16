CREATE TABLE public.posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           text NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 300),
  body            text,
  url             text,
  category_id     integer REFERENCES public.categories(id),
  score           integer NOT NULL DEFAULT 0,
  upvote_count    integer NOT NULL DEFAULT 0,
  downvote_count  integer NOT NULL DEFAULT 0,
  comment_count   integer NOT NULL DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX posts_author_id_idx ON public.posts (author_id);
CREATE INDEX posts_category_id_idx ON public.posts (category_id);
CREATE INDEX posts_created_at_idx ON public.posts (created_at DESC);
CREATE INDEX posts_score_idx ON public.posts (score DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are publicly readable"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts"
  ON public.posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts"
  ON public.posts FOR DELETE USING (auth.uid() = author_id);

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
