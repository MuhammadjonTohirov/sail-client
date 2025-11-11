'use client';

import { useState } from 'react';
import { SavedSearches } from '@/lib/api';

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
  locale?: 'ru' | 'uz';
  className?: string;
  variant?: 'icon' | 'button';
}

export function SaveSearchButton({
  searchParams,
  title,
  locale = 'ru',
  className = '',
  variant = 'button'
}: SaveSearchButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const label = (ru: string, uz: string) => locale === 'uz' ? uz : ru;

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaved) {
      alert(label('Этот поиск уже сохранен', 'Bu qidiruv allaqachon saqlangan'));
      return;
    }

    try {
      setIsSaving(true);

      // Generate a meaningful title from search params
      const searchTitle = title || generateTitle(searchParams, locale);

      const payload = {
        title: searchTitle,
        query: searchParams,
        frequency: 'daily' as const
      };

      await SavedSearches.create(payload);
      setIsSaved(true);

      // Show success message
      alert(label(
        'Поиск сохранен! Вы будете получать уведомления о новых объявлениях.',
        'Qidiruv saqlandi! Yangi e\'lonlar haqida xabarnoma olasiz.'
      ));
    } catch (error) {
      console.error('Failed to save search:', error);
      alert(label(
        'Не удалось сохранить поиск. Пожалуйста, войдите в систему.',
        'Qidiruvni saqlab bo\'lmadi. Iltimos, tizimga kiring.'
      ));
    } finally {
      setIsSaving(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleSave}
        disabled={isSaving || isSaved}
        className={`save-search-icon ${isSaved ? 'saved' : ''} ${className}`}
        title={label('Сохранить поиск', 'Qidiruvni saqlash')}
        style={{
          background: isSaved ? '#23E5DB' : 'white',
          border: `1px solid ${isSaved ? '#23E5DB' : '#ddd'}`,
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
        background: isSaved ? '#23E5DB' : 'white',
        border: `1px solid ${isSaved ? '#23E5DB' : '#ddd'}`,
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
        ? label('Сохранение...', 'Saqlanmoqda...')
        : isSaved
        ? label('Поиск сохранен', 'Qidiruv saqlandi')
        : label('Сохранить поиск', 'Qidiruvni saqlash')
      }
    </button>
  );
}

function generateTitle(params: Record<string, any>, locale: 'ru' | 'uz'): string {
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
    const priceLabel = locale === 'uz' ? 'Narxi:' : 'Цена:';
    const priceRange = `${params.min_price || '0'} - ${params.max_price || '∞'}`;
    parts.push(`${priceLabel} ${priceRange}`);
  }

  if (parts.length === 0) {
    return locale === 'uz' ? 'Mening qidiruvim' : 'Мой поиск';
  }

  return parts.join(' • ');
}
