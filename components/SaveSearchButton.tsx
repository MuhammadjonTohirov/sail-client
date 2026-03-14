'use client';

import { useState } from 'react';
import { SavedSearches } from '@/lib/api';
import { appConfig } from '@/config';
import { useI18n } from '@/lib/i18n';

interface SaveSearchButtonProps {
  searchParams: {
    q?: string;
    category_slug?: string;
    location_slug?: string;
    min_price?: string;
    max_price?: string;
    [key: string]: any;
  };
  title?: string;
  className?: string;
  variant?: 'icon' | 'button';
}

export function SaveSearchButton({
  searchParams,
  title,
  className = '',
  variant = 'button'
}: SaveSearchButtonProps) {
  const { t } = useI18n();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaved) {
      alert(t('common.searchAlreadySaved'));
      return;
    }

    try {
      setIsSaving(true);

      const searchTitle = title || generateTitle(searchParams, t);

      const payload = {
        title: searchTitle,
        query: searchParams,
        frequency: 'daily' as const
      };

      await SavedSearches.create(payload);
      setIsSaved(true);

      alert(t('common.searchSavedSuccess'));
    } catch (error) {
      console.error('Failed to save search:', error);
      alert(t('common.searchSaveLoginRequired'));
    } finally {
      setIsSaving(false);
    }
  };

  const accentColor = appConfig.theme.colors.secondary[500];

  if (variant === 'icon') {
    return (
      <button
        onClick={handleSave}
        disabled={isSaving || isSaved}
        className={`save-search-icon ${isSaved ? 'saved' : ''} ${className}`}
        title={t('common.saveSearch')}
        style={{
          background: isSaved ? accentColor : 'white',
          border: `1px solid ${isSaved ? accentColor : '#ddd'}`,
          borderRadius: '8px',
          padding: '8px 12px',
          cursor: isSaving ? 'wait' : isSaved ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s',
          opacity: isSaving ? 0.6 : 1
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isSaved ? 'white' : 'none'}
          stroke={isSaved ? 'white' : 'currentColor'}
          strokeWidth="2"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={isSaving || isSaved}
      className={`save-search-button ${isSaved ? 'saved' : ''} ${className}`}
      style={{
        background: isSaved ? accentColor : 'white',
        border: `1px solid ${isSaved ? accentColor : '#ddd'}`,
        borderRadius: '8px',
        padding: '10px 20px',
        cursor: isSaving ? 'wait' : isSaved ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 500,
        color: isSaved ? 'white' : '#333',
        transition: 'all 0.2s',
        opacity: isSaving ? 0.6 : 1
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isSaved ? 'white' : 'none'}
        stroke={isSaved ? 'white' : 'currentColor'}
        strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {isSaving
        ? t('common.saving')
        : isSaved
        ? t('common.saved')
        : t('common.saveSearch')
      }
    </button>
  );
}

function generateTitle(params: Record<string, any>, t: (key: string) => string): string {
  const parts: string[] = [];

  if (params.q) {
    parts.push(params.q);
  }

  if (params.category_name) {
    parts.push(params.category_name);
  }

  if (params.location_name) {
    parts.push(params.location_name);
  }

  if (params.min_price || params.max_price) {
    const priceRange = `${params.min_price || '0'} - ${params.max_price || '∞'}`;
    parts.push(`${t('common.priceLabel')} ${priceRange}`);
  }

  if (parts.length === 0) {
    return t('common.mySearch');
  }

  return parts.join(' • ');
}
