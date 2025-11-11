"use client";
import { appConfig, trustedImageUrl } from '@/config';
import { useState } from 'react';

interface AvatarProps {
  imageUrl?: string | null;
  placeholder: string;
  alt?: string;
  className?: string;
}

/**
 * Renders a circular avatar. If `imageUrl` is provided and loads successfully,
 * the image is displayed. Otherwise the first character placeholder is shown.
 */
export default function Avatar({ imageUrl, placeholder, alt, className = '' }: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const trimmed = placeholder?.trim();
  var fallbackChar = trimmed ? trimmed.charAt(0).toUpperCase() : '?';
  if (!fallbackChar.match(/[A-Z0-9]/i)) {
    fallbackChar = 'U';
  }
  const shouldShowImage = Boolean(imageUrl && !hasError);
  const _trustedImageUrl = trustedImageUrl(imageUrl || '');
  return (
    <div className={className} aria-label={alt || fallbackChar}>
      {shouldShowImage ? (
        <img
          src={_trustedImageUrl as string}
          alt={alt || fallbackChar}
          onError={() => setHasError(true)}
          className="avatar-image"
        />
      ) : (
        <span>{fallbackChar}</span>
      )}
    </div>
  );
}
