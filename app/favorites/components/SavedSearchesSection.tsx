'use client';

import type { CSSProperties } from 'react';
import type { SavedSearch } from '@/domain/models/SavedSearch';
import { EmptyState } from './EmptyState';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Search1Outlined as Search,
} from "@lineiconshq/free-icons";

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
    priceNotSpecified: string;
    deleteButton: string;
    newItemsFound: string;
    noNewItems: string;
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
        icon={<Lineicons icon={Search} width={64} height={64} />}
        title={messages.emptyTitle}
        description={messages.emptyDescription}
      />
    );
  }

  const formatNewItemsCount = (count: number) => {
    return count.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'ru-RU').replace(/,/g, ' ');
  };

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {searches.map((search) => {
        const priceRange = formatPriceRange(search, locale, currencySymbol);
        const hasNewItems = search.newItemsCount && search.newItemsCount > 0;
        const hasBeenViewed = !!search.lastViewedAt;

        return (
          <div key={search.id} className="saved-search-card">
            <button
              type="button"
              onClick={() => onSelect(search)}
              style={buttonStyle}
            >
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                  {search.title}
                </h3>
                <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  {search.query.category_name && <span>{search.query.category_name}</span>}
                  {search.query.location_name && <span> / {search.query.location_name}</span>}
                </div>
              </div>

              <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '8px' }}>
                <span>{messages.priceLabel} {priceRange || messages.priceNotSpecified}</span>
              </div>

              {hasBeenViewed && (
                <div style={{ marginBottom: '4px' }}>
                  {hasNewItems ? (
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        backgroundColor: '#40E0D0',
                        color: 'white',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {formatNewItemsCount(search.newItemsCount)} {messages.newItemsFound}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        backgroundColor: '#2C2C2C',
                        color: 'white',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {messages.noNewItems}
                    </div>
                  )}
                </div>
              )}
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
