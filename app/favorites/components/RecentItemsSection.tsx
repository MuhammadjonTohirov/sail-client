'use client';

import Link from 'next/link';
import type { RecentlyViewedListing } from '@/domain/models/RecentlyViewedListing';
import { EmptyState } from './EmptyState';

interface RecentItemsSectionProps {
  loading: boolean;
  items: RecentlyViewedListing[];
  formatPrice: (amount: number) => string;
  formatDate: (date: string) => string;
  messages: {
    loading: string;
    emptyTitle: string;
    emptyDescription: string;
  };
}

export function RecentItemsSection({
  loading,
  items,
  formatPrice,
  formatDate,
  messages,
}: RecentItemsSectionProps) {
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
        icon="👀"
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
            {item.mediaUrls?.length ? (
              <div className="listing-card-img" style={{ backgroundImage: `url(${item.mediaUrls[0]})` }} />
            ) : (
              <div className="listing-card-img listing-card-img-placeholder">
                <span style={{ fontSize: '48px', opacity: 0.3 }}>📷</span>
              </div>
            )}
            <div className="listing-card-body">
              <h3 className="listing-card-title">{item.title}</h3>
              <div className="listing-card-price">{formatPrice(item.price)}</div>
              <div className="listing-card-meta">
                {item.location && <span>{item.location}</span>}
                <span>{formatDate(item.viewedAt.toISOString())}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
