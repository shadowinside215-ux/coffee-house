/**
 * Cloudinary image management and transformation utility
 * Designed for دار القهوة (The Coffee House)
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

const LOCAL_STORAGE_KEY = 'dar_al_qahwa_cloudinary_settings';

export function getCloudinaryConfig(): CloudinaryConfig {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.cloudName) {
        return {
          cloudName: parsed.cloudName,
          uploadPreset: parsed.uploadPreset || '',
        };
      }
    } catch {
      // ignore
    }
  }

  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  };
}

export function saveCloudinaryConfig(cloudName: string, uploadPreset: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ cloudName: cloudName.trim(), uploadPreset: uploadPreset.trim() })
    );
  }
}

export const CLOUDINARY_CONFIG = {
  get cloudName() {
    return getCloudinaryConfig().cloudName;
  },
  get uploadPreset() {
    return getCloudinaryConfig().uploadPreset;
  },
  get isConfigured() {
    const cfg = getCloudinaryConfig();
    return Boolean(cfg.cloudName && cfg.cloudName !== 'demo');
  },
};

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}

/**
 * Transforms an image URL to leverage Cloudinary auto-format and quality optimization
 */
export function getOptimizedImageUrl(
  rawUrl: string,
  options: ImageTransformOptions = {}
): string {
  if (!rawUrl) return '';

  // Data URLs, blobs, or SVG vectors should be served intact
  if (
    rawUrl.startsWith('data:') ||
    rawUrl.startsWith('blob:') ||
    rawUrl.endsWith('.svg') ||
    rawUrl.includes('.svg?')
  ) {
    return rawUrl;
  }

  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;

  // Build transformation string if options are supplied
  const transformParams = [
    format ? `f_${format}` : '',
    quality ? `q_${quality}` : '',
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    crop ? `c_${crop}` : '',
  ]
    .filter(Boolean)
    .join(',');

  // If already a Cloudinary delivery URL
  if (rawUrl.includes('res.cloudinary.com') && rawUrl.includes('/upload/')) {
    // If URL already has transformations, avoid double transforming
    if (rawUrl.includes('/upload/f_') || rawUrl.includes('/upload/c_') || rawUrl.includes('/upload/w_')) {
      return rawUrl;
    }

    if (transformParams) {
      // Safely inject transformations after /upload/ without stripping folder paths or versions
      return rawUrl.replace('/upload/', `/upload/${transformParams}/`);
    }

    return rawUrl;
  }

  // For external images, return directly to prevent 401/404 fetch restrictions on custom clouds
  return rawUrl;
}

/**
 * Upload an image file directly to Cloudinary using an unsigned upload preset
 */
export async function uploadImageToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  if (!cloudName || !uploadPreset || cloudName === 'demo') {
    throw new Error(
      'Veuillez renseigner votre Cloud Name et votre Upload Preset Cloudinary dans l’onglet Configuration Cloud.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'dar_al_qahwa');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Échec du téléversement vers Cloudinary (HTTP ${response.status}). Vérifiez que l'upload preset '${uploadPreset}' est bien configuré en mode 'Unsigned'.`
    );
  }

  const data = await response.json();
  return {
    url: data.secure_url || data.url,
    publicId: data.public_id,
  };
}

/**
 * Curated high-fidelity café imagery served via Cloudinary CDN
 * Used until café owners upload their specific on-site photographs
 */
export const DEFAULT_CAFE_IMAGES = {
  hero: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1600,c_fill/coffee_cup.jpg',
  espressoTerrace: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_fill/coffee_mug.jpg',
  crepeBrownie: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_fill/dessert_table.jpg',
  moroccanBreakfast: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_fill/breakfast_bowl.jpg',
  cafeInterior: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_fill/restaurant_terrace.jpg',
  harchaMsemen: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_fill/pastry_bread.jpg',
  omelette: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_fill/scrambled_eggs.jpg',
  mintTea: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,c_fill/tea_cup.jpg',
};
