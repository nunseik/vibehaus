CREATE TABLE public.comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id  uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  body       text NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 10000),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX comments_post_id_idx ON public.comments (post_id);
CREATE INDEX comments_author_id_idx ON public.comments (author_id);
CREATE INDEX comments_parent_id_idx ON public.comments (parent_id);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are publicly readable"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own comments"
  ON public.comments FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own comments"
  ON public.comments FOR DELETE USING (auth.uid() = author_id);

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Keep posts.comment_count in sync
CREATE OR REPLACE FUNCTION public.update_post_comment_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_post_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_post_id := OLD.post_id;
  ELSE
    v_post_id := NEW.post_id;
  END IF;

  UPDATE public.posts
  SET comment_count = (SELECT COUNT(*) FROM public.comments WHERE post_id = v_post_id)
  WHERE id = v_post_id;

  RETURN NULL;
END;
$$;

CREATE TRIGGER comments_update_post_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE PROCEDURE public.update_post_comment_count();
