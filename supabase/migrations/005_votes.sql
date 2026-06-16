CREATE TABLE public.votes (
  user_id    uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id    uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  value      smallint NOT NULL CHECK (value IN (1, -1)),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX votes_post_id_idx ON public.votes (post_id);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all votes"
  ON public.votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change their own vote"
  ON public.votes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their own vote"
  ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- Trigger to keep posts.score, upvote_count, downvote_count in sync
CREATE OR REPLACE FUNCTION public.update_post_vote_counts()
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
  SET
    upvote_count   = (SELECT COUNT(*) FROM public.votes WHERE post_id = v_post_id AND value = 1),
    downvote_count = (SELECT COUNT(*) FROM public.votes WHERE post_id = v_post_id AND value = -1),
    score          = (SELECT COALESCE(SUM(value), 0) FROM public.votes WHERE post_id = v_post_id)
  WHERE id = v_post_id;

  RETURN NULL;
END;
$$;

CREATE TRIGGER votes_update_post_counts
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW EXECUTE PROCEDURE public.update_post_vote_counts();
