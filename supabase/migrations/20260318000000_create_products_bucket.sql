-- Create products storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Public read policy — anyone can view product images
CREATE POLICY "Public product images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');
