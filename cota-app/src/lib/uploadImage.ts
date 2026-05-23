import { supabase } from './supabase';

export type ImageBucket = 'avatars' | 'pot-covers';

export interface UploadResult {
  path: string;
  publicUrl: string;
}

// Read a local image URI (file://, content://, ph://) into an ArrayBuffer and
// upload it to a public Supabase Storage bucket under the user's folder.
// Returns the public URL so callers can persist it on a row (profiles.avatar_url,
// pots.cover_url, …).
export async function uploadImage(opts: {
  bucket: ImageBucket;
  userId: string;
  uri: string;
  fileNamePrefix?: string;
}): Promise<UploadResult> {
  const { bucket, userId, uri, fileNamePrefix = 'image' } = opts;

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const lower = uri.toLowerCase().split('?')[0];
  const ext =
    lower.endsWith('.png')  ? 'png'  :
    lower.endsWith('.webp') ? 'webp' :
    lower.endsWith('.heic') ? 'heic' :
    'jpg';
  const contentType =
    ext === 'png'  ? 'image/png'  :
    ext === 'webp' ? 'image/webp' :
    ext === 'heic' ? 'image/heic' :
    'image/jpeg';

  const path = `${userId}/${fileNamePrefix}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
    contentType,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}
