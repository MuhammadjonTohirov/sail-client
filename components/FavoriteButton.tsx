'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  listingId: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  className?: string;
}

export function FavoriteButton({
  listingId,
  size = 'md',
  variant = 'icon',
  className = ''
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLiked(isFavorite(listingId));
  }, [listingId, isFavorite]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsLoading(true);
      const newState = await toggleFavorite(listingId);
      setIsLiked(newState);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeMap = {
    sm: { icon: 18, button: 36 },
    md: { icon: 20, button: 40 },
    lg: { icon: 24, button: 46 },
  } as const;

  const { icon: iconSize, button: buttonSize } = sizeMap[size] || sizeMap.md;

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`favorite-button ${isLiked ? 'favorite-button-active' : ''} ${className}`}
        aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill={isLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`favorite-icon ${isLiked ? 'favorite-icon-active' : ''} ${className}`}
      aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        border: 'none',
        borderRadius: '50%',
        width: buttonSize,
        height: buttonSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={isLiked ? '#ff385c' : 'none'}
        stroke={isLiked ? '#ff385c' : '#222'}
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
