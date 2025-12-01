'use client';

import type { CSSProperties } from 'react';
import type { SavedSearch } from '@/domain/models/SavedSearch';
import { EmptyState } from './EmptyState';

interface SavedSearchesSectionProps {
  loading: boolean;
  searches: SavedSearch[];
  locale: string;
  currencySymbol: string;
  messages: {
    loading: string;
    emptyTitle: string;
    emptyDescription: string;
    priceLabel: string;
    deleteButton: string;
  };
  formatDate: (date: string) => string;
  onSelect: (search: SavedSearch) => void;
  onDelete: (id: number) => void;
}

const buttonStyle: CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  padding: 0,
  textAlign: 'left',
  cursor: 'pointer',
  color: 'inherit',
};

function formatPriceRange(search: SavedSearch, locale: string, currencySymbol: string) {
  const { price_min, price_max } = search.query;
  const hasMin = price_min !== undefined && price_min !== null && price_min !== '';
  const hasMax = price_max !== undefined && price_max !== null && price_max !== '';
  if (!hasMin && !hasMax) return null;

  const localized = (value: number) => value.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'ru-RU');
  const parseValue = (value: any) => {
    if (typeof value === 'number') return value;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const minNumber = hasMin ? parseValue(price_min) : null;
  const maxNumber = hasMax ? parseValue(price_max) : null;

  const min = minNumber !== null ? `${localized(minNumber)} ${currencySymbol}` : '—';
  const max = maxNumber !== null ? `${localized(maxNumber)} ${currencySymbol}` : '∞';
  return `${min} - ${max}`;
}

export function SavedSearchesSection({
  loading,
  searches,
  locale,
  currencySymbol,
  messages,
  formatDate,
  onSelect,
  onDelete,
}: SavedSearchesSectionProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
        {messages.loading}
      </div>
    );
  }

  if (!searches.length) {
    return (
      <EmptyState
        icon="🔍"
        title={messages.emptyTitle}
        description={messages.emptyDescription}
      />
    );
  }

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {searches.map((search) => {
        const priceRange = formatPriceRange(search, locale, currencySymbol);
        return (
          <div key={search.id} className="saved-search-card">
            <button
              type="button"
              onClick={() => onSelect(search)}
              style={buttonStyle}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--brand)' }}>
                {search.title}
              </h3>
              <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                {search.query.category_name && <span>{search.query.category_name}</span>}
                {search.query.location_name && <span> • {search.query.location_name}</span>}
                {priceRange && (
                  <span>
                    {' '}
                    • {messages.priceLabel} {priceRange}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                {formatDate(search.createdAt ?? '')}
              </div>
            </button>
            <button
              type="button"
              onClick={() => onDelete(search.id)}
              className="btn-outline"
              style={{ padding: '8px 16px' }}
            >
              {messages.deleteButton}
            </button>
          </div>
        );
      })}
    </div>
  );
}
