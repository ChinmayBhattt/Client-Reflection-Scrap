-- =====================================================================
-- Migration: 20240102000000_blog_gallery.sql
-- Project: Reflection Scrap Solutions LLP (LLPIN ACY-4261)
-- Description: Market-trends blog posts (with likes & ratings) and work gallery
-- =====================================================================

-- 1. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Market Trends',
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author_name TEXT NOT NULL DEFAULT 'Reflection Scrap Editorial',
  read_time_minutes INTEGER NOT NULL DEFAULT 4,
  tags TEXT[] NOT NULL DEFAULT '{}',
  likes_count INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Safe public RPC for liking/unliking a published blog post
CREATE OR REPLACE FUNCTION public.increment_blog_like(post_id UUID, delta INTEGER)
RETURNS TABLE(likes_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  safe_delta INTEGER := CASE WHEN delta >= 0 THEN 1 ELSE -1 END;
BEGIN
  RETURN QUERY
  UPDATE public.blog_posts
  SET likes_count = GREATEST(0, public.blog_posts.likes_count + safe_delta)
  WHERE id = post_id AND is_published = true
  RETURNING public.blog_posts.likes_count;
END;
$$;

-- Safe public RPC for submitting or updating a 1-5 star rating on a published blog post
CREATE OR REPLACE FUNCTION public.submit_blog_rating(
  post_id UUID,
  new_rating INTEGER,
  previous_rating INTEGER DEFAULT 0
)
RETURNS TABLE(rating_sum INTEGER, rating_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clamped_new INTEGER := LEAST(5, GREATEST(1, new_rating));
  clamped_prev INTEGER := CASE WHEN previous_rating BETWEEN 1 AND 5 THEN previous_rating ELSE 0 END;
BEGIN
  RETURN QUERY
  UPDATE public.blog_posts
  SET
    rating_sum = GREATEST(0, public.blog_posts.rating_sum - clamped_prev + clamped_new),
    rating_count = CASE
      WHEN clamped_prev = 0 THEN public.blog_posts.rating_count + 1
      ELSE GREATEST(1, public.blog_posts.rating_count)
    END
  WHERE id = post_id AND is_published = true
  RETURNING public.blog_posts.rating_sum, public.blog_posts.rating_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_blog_like(UUID, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_blog_rating(UUID, INTEGER, INTEGER) TO anon, authenticated;

-- 2. GALLERY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Industrial Clearances',
  description TEXT,
  location TEXT,
  activity_date DATE,
  image_url TEXT,
  highlight_stat TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_published ON public.gallery_items(is_published, sort_order ASC, created_at DESC);

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published gallery items"
  ON public.gallery_items FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin can manage gallery items"
  ON public.gallery_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. PUBLIC STORAGE BUCKET FOR GALLERY & BLOG IMAGES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-photos',
  'gallery-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

CREATE POLICY "Public can view gallery photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-photos');

CREATE POLICY "Admin can upload gallery photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery-photos' AND public.is_admin());

CREATE POLICY "Admin can delete gallery photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery-photos' AND public.is_admin());

