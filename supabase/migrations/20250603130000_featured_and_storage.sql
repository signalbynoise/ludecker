-- Add featured column and content-images storage bucket

ALTER TABLE public.content
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS content_featured_idx ON public.content (featured)
  WHERE status = 'published';

INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "public_read_content_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-images');

CREATE POLICY IF NOT EXISTS "authenticated_upload_content_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'content-images');

CREATE POLICY IF NOT EXISTS "authenticated_update_content_images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'content-images');

CREATE POLICY IF NOT EXISTS "authenticated_delete_content_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'content-images');
