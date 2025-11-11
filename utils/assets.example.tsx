/**
 * Example usage of the assets utility
 * This file demonstrates how to use the asset management utilities
 */

import { getAsset, fetchAssetText, Assets, preloadAsset } from './assets';
import { useEffect, useState } from 'react';

// ============================================================================
// Example 1: Simple image reference
// ============================================================================
export function ExampleImageComponent() {
  return (
    <div>
      <img src={getAsset('icon-left.svg')} alt="Left icon" />
      <img src={getAsset('icon-right.svg')} alt="Right icon" />
    </div>
  );
}

// ============================================================================
// Example 2: Using the Assets registry (recommended for common assets)
// ============================================================================
export function ExampleWithRegistry() {
  return (
    <div>
      <img src={Assets.icons.left()} alt="Left" />
      <img src={Assets.icons.right()} alt="Right" />
    </div>
  );
}

// ============================================================================
// Example 3: Fetching SVG content to use inline
// ============================================================================
export function InlineSvgExample() {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    fetchAssetText('icon-left.svg')
      .then(setSvgContent)
      .catch(console.error);
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: svgContent }} />
  );
}

// ============================================================================
// Example 4: Preloading assets for better performance
// ============================================================================
export function PreloadExample() {
  useEffect(() => {
    // Preload important images
    preloadAsset('icon-left.svg', { as: 'image' });
    preloadAsset('icon-right.svg', { as: 'image' });
  }, []);

  return (
    <div>
      <p>Assets are preloaded for better performance</p>
    </div>
  );
}

// ============================================================================
// Example 5: Using with subfolder structure
// ============================================================================
export function SubfolderExample() {
  // If you organize assets in subfolders:
  // /public/assets/icons/arrow.svg
  // /public/assets/images/logo.png
  // /public/assets/fonts/custom.woff2

  return (
    <div>
      <img src={getAsset('arrow.svg', { subfolder: 'icons' })} alt="Arrow" />
      <img src={getAsset('logo.png', { subfolder: 'images' })} alt="Logo" />
    </div>
  );
}

// ============================================================================
// Example 6: Using in GalleryView (replacing your current implementation)
// ============================================================================
export function GalleryNavigationButtons() {
  return (
    <div className="gallery-nav">
      <button aria-label="Previous">
        <img src={Assets.icons.left()} alt="" width={24} height={24} />
      </button>
      <button aria-label="Next">
        <img src={Assets.icons.right()} alt="" width={24} height={24} />
      </button>
    </div>
  );
}

// ============================================================================
// Example 7: Dynamic asset loading with error handling
// ============================================================================
export function DynamicAssetExample({ iconName }: { iconName: string }) {
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        const url = getAsset(`${iconName}.svg`);
        // Verify asset exists
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          setAssetUrl(url);
        } else {
          setError('Asset not found');
        }
      } catch (err) {
        setError('Failed to load asset');
      }
    };

    loadAsset();
  }, [iconName]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!assetUrl) {
    return <div>Loading...</div>;
  }

  return <img src={assetUrl} alt={iconName} />;
}
