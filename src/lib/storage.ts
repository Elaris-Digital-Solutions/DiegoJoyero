import { supabase } from './supabase';

const bucketName = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? 'product-images';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const randomChunk = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);

export const productImageConstraints = {
  maxSizeBytes: MAX_FILE_SIZE_BYTES,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
};

export async function uploadProductImage(file: File, material: 'gold' | 'silver') {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Formato no permitido. Usa JPG, PNG, WebP o AVIF.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('La imagen supera los 5 MB permitidos.');
  }

  const extension = (file.name.split('.').pop() ?? 'jpg').toLowerCase();
  const baseName = file.name.replace(/\.[^/.]+$/, '') || 'producto';
  const slug = toSlug(baseName) || 'pieza';
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const folder = material === 'gold' ? 'oro' : 'plata';
  const path = `${folder}/${stamp}-${randomChunk()}-${slug}.${extension}`;

  const { error } = await supabase.storage.from(bucketName).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/jpeg',
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  const publicUrl = data?.publicUrl;

  if (!publicUrl) {
    throw new Error('No se pudo obtener la URL pública de la imagen.');
  }

  return {
    publicUrl,
    path,
  };
}
