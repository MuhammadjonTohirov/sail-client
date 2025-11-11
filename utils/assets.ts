/**
 * Asset management utility for fetching assets from the assets folder
 */

/**
 * Get the path to an asset file in the assets folder
 * @param name - The name of the asset file (e.g., 'icon-left.svg', 'logo.png')
 * @param options - Optional configuration
 * @returns The full path to the asset
 *
 * @example
 * ```ts
 * const iconPath = getAsset('icon-left.svg');
 * // Returns: '/assets/icon-left.svg'
 *
 * const imagePath = getAsset('hero.png', { subfolder: 'images' });
 * // Returns: '/assets/images/hero.png'
 * ```
 */
export function getAsset(name: string, options?: { subfolder?: string }): string {
  const { subfolder } = options || {};

  if (subfolder) {
    return `/assets/${subfolder}/${name}`;
  }

  return `/assets/${name}`;
}

/**
 * Fetch an asset file content as text
 * @param name - The name of the asset file
 * @param options - Optional configuration
 * @returns Promise resolving to the asset content as text
 *
 * @example
 * ```ts
 * const svgContent = await fetchAssetText('icon-left.svg');
 * console.log(svgContent); // SVG markup as string
 * ```
 */
export async function fetchAssetText(
  name: string,
  options?: { subfolder?: string }
): Promise<string> {
  const assetPath = getAsset(name, options);
  const response = await fetch(assetPath);

  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${assetPath} (${response.status} ${response.statusText})`);
  }

  return await response.text();
}

/**
 * Fetch an asset file as a Blob
 * @param name - The name of the asset file
 * @param options - Optional configuration
 * @returns Promise resolving to the asset as Blob
 *
 * @example
 * ```ts
 * const imageBlob = await fetchAssetBlob('logo.png', { subfolder: 'images' });
 * const imageUrl = URL.createObjectURL(imageBlob);
 * ```
 */
export async function fetchAssetBlob(
  name: string,
  options?: { subfolder?: string }
): Promise<Blob> {
  const assetPath = getAsset(name, options);
  const response = await fetch(assetPath);

  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${assetPath} (${response.status} ${response.statusText})`);
  }

  return await response.blob();
}

/**
 * Fetch an asset file as a data URL
 * @param name - The name of the asset file
 * @param options - Optional configuration
 * @returns Promise resolving to the asset as data URL
 *
 * @example
 * ```ts
 * const dataUrl = await fetchAssetDataUrl('icon.svg');
 * // Use in img src or inline CSS
 * ```
 */
export async function fetchAssetDataUrl(
  name: string,
  options?: { subfolder?: string }
): Promise<string> {
  const blob = await fetchAssetBlob(name, options);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Preload an asset (useful for images, fonts, etc.)
 * @param name - The name of the asset file
 * @param options - Configuration including subfolder and resource type
 *
 * @example
 * ```ts
 * // Preload an image
 * preloadAsset('hero.png', { subfolder: 'images', as: 'image' });
 *
 * // Preload a font
 * preloadAsset('custom-font.woff2', { subfolder: 'fonts', as: 'font' });
 * ```
 */
export function preloadAsset(
  name: string,
  options?: {
    subfolder?: string;
    as?: 'image' | 'font' | 'script' | 'style' | 'fetch';
  }
): void {
  if (typeof window === 'undefined') return;

  const { as = 'fetch' } = options || {};
  const assetPath = getAsset(name, options);

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = assetPath;
  link.as = as;

  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * Check if an asset exists
 * @param name - The name of the asset file
 * @param options - Optional configuration
 * @returns Promise resolving to true if asset exists, false otherwise
 *
 * @example
 * ```ts
 * const exists = await assetExists('icon-left.svg');
 * if (exists) {
 *   // Use the asset
 * }
 * ```
 */
export async function assetExists(
  name: string,
  options?: { subfolder?: string }
): Promise<boolean> {
  const assetPath = getAsset(name, options);

  try {
    const response = await fetch(assetPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Asset registry for commonly used assets
 * Add your frequently used assets here for easier access
 */
export const Assets = {
  icons: {
    left: () => getAsset('icon-left.svg'),
    right: () => getAsset('icon-right.svg'),
    logo: () => getAsset('app-logo.svg'),
  },

  // Add more asset categories as needed
  images: {
    logo: () => getAsset('app-logo.png'),
  }
  //   hero: () => getAsset('hero.jpg', { subfolder: 'images' }),
  // },
} as const;
