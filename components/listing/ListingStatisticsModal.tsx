'use client';

import { useEffect, useRef } from 'react';

interface ListingStatistics {
  id: number;
  title: string;
  viewCount: number;
  favoriteCount: number;
  interestCount: number;
  createdAt: string;
}

interface ListingStatisticsModalProps {
  open: boolean;
  listing: ListingStatistics | null;
  onClose: () => void;
  t: (key: string) => string;
  locale: string;
}

export function ListingStatisticsModal({
  open,
  listing,
  onClose,
  t,
  locale,
}: ListingStatisticsModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !listing) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const totalEngagement = listing.viewCount + listing.favoriteCount + listing.interestCount;
  const conversionRate = listing.viewCount > 0
    ? ((listing.interestCount / listing.viewCount) * 100).toFixed(1)
    : '0.0';

  const createdDate = new Date(listing.createdAt);
  const now = new Date();
  const daysActive = Math.max(1, Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));
  const avgViewsPerDay = (listing.viewCount / daysActive).toFixed(1);

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="modal-content statistics-modal">
        <div className="modal-header">
          <h2 className="modal-title">{t('myListings.statisticsModal.title')}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="statistics-listing-info">
            <h3 className="statistics-listing-title">{listing.title}</h3>
            <p className="statistics-listing-meta">
              ID: {listing.id} • {t('myListings.statisticsModal.activeSince')} {createdDate.toLocaleDateString(locale === 'uz' ? 'uz-UZ' : 'ru-RU')}
            </p>
          </div>

          <div className="statistics-grid">
            <div className="stat-card stat-card-views">
              <div className="stat-card-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{listing.viewCount}</div>
                <div className="stat-card-label">{t('myListings.statisticsModal.views')}</div>
              </div>
            </div>

            <div className="stat-card stat-card-favorites">
              <div className="stat-card-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{listing.favoriteCount}</div>
                <div className="stat-card-label">{t('myListings.statisticsModal.favorites')}</div>
              </div>
            </div>

            <div className="stat-card stat-card-interests">
              <div className="stat-card-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{listing.interestCount}</div>
                <div className="stat-card-label">{t('myListings.statisticsModal.interests')}</div>
              </div>
            </div>
          </div>

          <div className="statistics-insights">
            <h4 className="insights-title">{t('myListings.statisticsModal.insights')}</h4>
            <div className="insights-grid">
              <div className="insight-item">
                <span className="insight-label">{t('myListings.statisticsModal.daysActive')}</span>
                <span className="insight-value">{daysActive}</span>
              </div>
              <div className="insight-item">
                <span className="insight-label">{t('myListings.statisticsModal.avgViewsPerDay')}</span>
                <span className="insight-value">{avgViewsPerDay}</span>
              </div>
              <div className="insight-item">
                <span className="insight-label">{t('myListings.statisticsModal.conversionRate')}</span>
                <span className="insight-value">{conversionRate}%</span>
              </div>
              <div className="insight-item">
                <span className="insight-label">{t('myListings.statisticsModal.totalEngagement')}</span>
                <span className="insight-value">{totalEngagement}</span>
              </div>
            </div>
          </div>

          <div className="statistics-tip">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{t('myListings.statisticsModal.tip')}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {t('myListings.statisticsModal.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
