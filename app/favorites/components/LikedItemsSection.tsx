'use client';

import Link from 'next/link';
import type { Favorite } from '@/domain/models/Favorite';
import { EmptyState } from './EmptyState';
import { trustedImageUrl } from '@/config';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Trash3Outlined as Trash,
  Camera1Outlined as Camera,
  HeartOutlined as Heart,
} from "@lineiconshq/free-icons";

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
        icon={<Lineicons icon={Heart} width={64} height={64} />}
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
              <div className="listing-card-img listing-card-img-placeholder flex items-center justify-center">
                <Lineicons icon={Camera} width={48} height={48} style={{ opacity: 0.3 }} />
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
            className="listing-card-remove flex items-center justify-center"
            title={messages.removeTooltip}
          >
            <Lineicons icon={Trash} width={20} height={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
