CREATE TABLE public.categories (
  id    serial PRIMARY KEY,
  slug  text UNIQUE NOT NULL,
  name  text NOT NULL,
  icon  text NOT NULL DEFAULT '💬',
  description text
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT USING (true);

INSERT INTO public.categories (slug, name, icon, description) VALUES
  ('general',            'General',            '💬', 'Anything and everything vibe coding'),
  ('prompt-engineering', 'Prompt Engineering', '🧠', 'Craft better prompts for better results'),
  ('cursor-tips',        'Cursor Tips',        '⚡', 'Get the most out of Cursor IDE'),
  ('claude-tips',        'Claude Tips',        '🤖', 'Tips and tricks for working with Claude'),
  ('tools',              'Tools',              '🛠️', 'Tools, extensions, and workflow automation'),
  ('showcase',           'Showcase',           '🚀', 'Show off what you built with AI'),
  ('debug-help',         'Debug Help',         '🐛', 'Get help debugging AI-generated code'),
  ('career',             'Career',             '💼', 'Jobs, freelancing, and vibe coding as a career');
