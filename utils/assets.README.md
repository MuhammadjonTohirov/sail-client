# Asset Management Utility

A comprehensive utility for managing and fetching assets in your Next.js application.

## Location

Assets should be placed in `/public/assets/` directory. Next.js automatically serves files from the `public` folder at the root URL.

## Current Assets

```
/public/assets/
  ├── icon-left.svg
  └── icon-right.svg
```

## Basic Usage

### 1. Simple Asset Path

```tsx
import { getAsset } from '@/utils/assets';

function MyComponent() {
  return <img src={getAsset('icon-left.svg')} alt="Left" />;
}
```

### 2. Using Asset Registry (Recommended)

```tsx
import { Assets } from '@/utils/assets';

function MyComponent() {
  return (
    <>
      <img src={Assets.icons.left()} alt="Left" />
      <img src={Assets.icons.right()} alt="Right" />
    </>
  );
}
```

### 3. Assets in Subfolders

```tsx
import { getAsset } from '@/utils/assets';

// For assets organized in subfolders:
// /public/assets/images/logo.png
function MyComponent() {
  return <img src={getAsset('logo.png', { subfolder: 'images' })} alt="Logo" />;
}
```

## Advanced Usage

### Fetching Asset Content as Text

Useful for inline SVGs or reading file contents:

```tsx
import { fetchAssetText } from '@/utils/assets';
import { useEffect, useState } from 'react';

function InlineSvg() {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    fetchAssetText('icon-left.svg').then(setSvg);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

### Fetching Asset as Blob

Useful for programmatic manipulation:

```tsx
import { fetchAssetBlob } from '@/utils/assets';

async function processImage() {
  const blob = await fetchAssetBlob('image.png', { subfolder: 'images' });
  const objectUrl = URL.createObjectURL(blob);
  // Use objectUrl...
}
```

### Fetching Asset as Data URL

```tsx
import { fetchAssetDataUrl } from '@/utils/assets';

async function getDataUrl() {
  const dataUrl = await fetchAssetDataUrl('icon.svg');
  // Use in CSS or img src
}
```

### Preloading Assets

Improve performance by preloading critical assets:

```tsx
import { preloadAsset } from '@/utils/assets';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Preload images
    preloadAsset('hero.jpg', { subfolder: 'images', as: 'image' });

    // Preload fonts
    preloadAsset('custom.woff2', { subfolder: 'fonts', as: 'font' });
  }, []);

  return <div>...</div>;
}
```

### Check if Asset Exists

```tsx
import { assetExists } from '@/utils/assets';

async function checkAsset() {
  const exists = await assetExists('icon-left.svg');
  if (exists) {
    // Use the asset
  }
}
```

## API Reference

### `getAsset(name, options?)`

Get the path to an asset file.

**Parameters:**
- `name: string` - Asset filename
- `options?: { subfolder?: string }` - Optional subfolder path

**Returns:** `string` - Full path to asset

---

### `fetchAssetText(name, options?)`

Fetch asset content as text.

**Parameters:**
- `name: string` - Asset filename
- `options?: { subfolder?: string }` - Optional subfolder path

**Returns:** `Promise<string>` - Asset content as text

---

### `fetchAssetBlob(name, options?)`

Fetch asset as Blob.

**Parameters:**
- `name: string` - Asset filename
- `options?: { subfolder?: string }` - Optional subfolder path

**Returns:** `Promise<Blob>` - Asset as Blob

---

### `fetchAssetDataUrl(name, options?)`

Fetch asset as data URL.

**Parameters:**
- `name: string` - Asset filename
- `options?: { subfolder?: string }` - Optional subfolder path

**Returns:** `Promise<string>` - Asset as data URL

---

### `preloadAsset(name, options?)`

Preload an asset for better performance.

**Parameters:**
- `name: string` - Asset filename
- `options?: { subfolder?: string; as?: 'image' | 'font' | 'script' | 'style' | 'fetch' }`

**Returns:** `void`

---

### `assetExists(name, options?)`

Check if an asset exists.

**Parameters:**
- `name: string` - Asset filename
- `options?: { subfolder?: string }` - Optional subfolder path

**Returns:** `Promise<boolean>` - True if asset exists

---

### `Assets` Registry

Predefined registry for commonly used assets:

```typescript
Assets.icons.left()   // Returns: '/assets/icon-left.svg'
Assets.icons.right()  // Returns: '/assets/icon-right.svg'
```

## Organizing Assets

Recommended folder structure:

```
/public/assets/
  ├── icons/
  │   ├── icon-left.svg
  │   └── icon-right.svg
  ├── images/
  │   ├── logo.png
  │   └── hero.jpg
  ├── fonts/
  │   └── custom.woff2
  └── videos/
      └── intro.mp4
```

Update the `Assets` registry in `utils/assets.ts` to match your structure:

```typescript
export const Assets = {
  icons: {
    left: () => getAsset('icon-left.svg', { subfolder: 'icons' }),
    right: () => getAsset('icon-right.svg', { subfolder: 'icons' }),
  },
  images: {
    logo: () => getAsset('logo.png', { subfolder: 'images' }),
    hero: () => getAsset('hero.jpg', { subfolder: 'images' }),
  },
} as const;
```

## Best Practices

1. **Use the Assets Registry** for frequently used assets
2. **Organize by type** in subfolders (icons, images, fonts, etc.)
3. **Preload critical assets** to improve perceived performance
4. **Use appropriate formats**: SVG for icons, WebP for images, WOFF2 for fonts
5. **Optimize assets** before adding them to the project
6. **Add TypeScript types** to the Assets registry for autocomplete

## Integration Example

Using in GalleryView component:

```tsx
import { Assets } from '@/utils/assets';

export function GalleryView({ onPrevious, onNext }) {
  return (
    <div className="gallery-nav">
      <button onClick={onPrevious} aria-label="Previous">
        <img src={Assets.icons.left()} alt="" width={24} height={24} />
      </button>
      <button onClick={onNext} aria-label="Next">
        <img src={Assets.icons.right()} alt="" width={24} height={24} />
      </button>
    </div>
  );
}
```

## Error Handling

All async functions will throw errors if the asset cannot be fetched:

```tsx
try {
  const content = await fetchAssetText('missing.svg');
} catch (error) {
  console.error('Failed to fetch asset:', error);
  // Handle error appropriately
}
```

## TypeScript Support

All utilities are fully typed. The `Assets` registry uses `as const` for literal types and autocomplete support.
