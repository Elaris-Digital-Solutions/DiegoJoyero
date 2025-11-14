const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();
const baseFolder = import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() ?? '';

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
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary no está configurado. Define VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET.');
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
  const folderSegments: string[] = [];
  if (baseFolder) {
    folderSegments.push(baseFolder.replace(/\/+$/g, ''));
  }
  folderSegments.push(material === 'gold' ? 'oro' : 'plata');
  const folder = folderSegments.join('/');
  const publicId = `${stamp}-${randomChunk()}-${slug}`;
  const expectedId = folder ? `${folder}/${publicId}` : publicId;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('public_id', publicId);
  formData.append('context', `alt=${baseName}`);
  formData.append('tags', ['diego-joyero', material].join(','));
  if (folder) {
    formData.append('folder', folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
  } catch (networkError) {
    console.error('Error al conectar con Cloudinary', networkError);
    throw new Error('No se pudo contactar a Cloudinary. Verifica tu conexión.');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Cloudinary respondió con un formato inesperado.');
  }

  type CloudinaryErrorPayload = { error?: { message?: string } };
  type CloudinarySuccessPayload = { secure_url?: string; url?: string; public_id?: string };
  const data = payload as CloudinarySuccessPayload & CloudinaryErrorPayload;

  if (!response.ok) {
    const message = data.error?.message ?? `Cloudinary devolvió ${response.status}.`;
    throw new Error(message);
  }

  const publicUrl = data.secure_url ?? data.url;
  if (!publicUrl) {
    throw new Error('Cloudinary no devolvió la URL de la imagen.');
  }

  return {
    publicUrl,
    publicId: data.public_id ?? expectedId,
    format: extension,
  };
}
