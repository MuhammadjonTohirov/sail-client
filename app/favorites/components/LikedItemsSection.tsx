'use client';

import Link from 'next/link';
import type { Favorite } from '@/domain/models/Favorite';
import { EmptyState } from './EmptyState';
import { trustedImageUrl } from '@/config';

interface LikedItemsSectionProps {
  loading: boolean;
  items: Favorite[];
  formatPrice: (amount: number) => string;
  formatDate: (date: string) => string;
  onUnlike: (listingId: number) => void;
  messages: {
    loading: string;
    emptyTitle: string;
    emptyDescription: string;
    removeTooltip: string;
  };
}

export function LikedItemsSection({
  loading,
  items,
  formatPrice,
  formatDate,
  onUnlike,
  messages,
}: LikedItemsSectionProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
        {messages.loading}
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon="💔"
        title={messages.emptyTitle}
        description={messages.emptyDescription}
      />
    );
  }

  return (
    <div className="listings-grid">
      {items.map((item) => (
        <div key={item.id} className="listing-card">
          <Link href={`/l/${item.listingId}`} className="listing-card-link">
            {item.listingMediaUrls?.length ? (
              <div className="listing-card-img" style={{ backgroundImage: `url(${trustedImageUrl(item.listingMediaUrls[0])})` }} />
            ) : (
              <div className="listing-card-img listing-card-img-placeholder">
                <span style={{ fontSize: '48px', opacity: 0.3 }}>📷</span>
              </div>
            )}
            <div className="listing-card-body">
              <h3 className="listing-card-title">{item.listingTitle}</h3>
              <div className="listing-card-price">{formatPrice(item.listingPrice)}</div>
              <div className="listing-card-meta">
                {item.listingLocation && <span>{item.listingLocation}</span>}
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onUnlike(item.listingId);
            }}
            className="listing-card-remove"
            title={messages.removeTooltip}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
