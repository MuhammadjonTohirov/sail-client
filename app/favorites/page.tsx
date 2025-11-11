'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { SavedSearches } from '@/lib/api';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useFavorites } from '@/hooks/useFavorites';
import { appConfig } from '@/config';

interface SavedSearch {
  id: number;
  title: string;
  query: {
    q?: string;
    category?: number;
    category_name?: string;
    location?: number;
    location_name?: string;
    price_min?: number;
    price_max?: number;
    [key: string]: any; // Allow other filter fields
  };
  created_at: string;
}

export default function FavoritesPage() {
  const { t, locale } = useI18n();
  const { features, i18n } = appConfig;
  const enableFavorites = features.enableFavorites;
  const enableSavedSearches = features.enableSavedSearches;
  const initialTab: 'liked' | 'searches' | 'recent' = enableFavorites ? 'liked' : enableSavedSearches ? 'searches' : 'recent';
  const [activeTab, setActiveTab] = useState<'liked' | 'searches' | 'recent'>(initialTab);

  // Liked items (using Clean Architecture)
  const { favorites: likedItems, loading: loadingLiked, removeFavorite } = useFavorites();

  // Saved searches (from API)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loadingSearches, setLoadingSearches] = useState(true);

  // Recently visited (using clean architecture)
  const { recentItems, loading: loadingRecent, load: loadRecentItems, clearAll: clearRecentItems } = useRecentlyViewed();

  // Load saved searches
  useEffect(() => {
    let cancelled = false;
    if (!enableSavedSearches) {
      setSavedSearches([]);
      setLoadingSearches(false);
      return;
    }

    const loadSavedSearches = async () => {
      setLoadingSearches(true);
      try {
        const data = await SavedSearches.list();
        if (!cancelled) {
          setSavedSearches(data.results || data || []);
        }
      } catch (error) {
        console.error('Failed to load saved searches:', error);
        if (!cancelled) {
          setSavedSearches([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingSearches(false);
        }
      }
    };

    loadSavedSearches();

    return () => {
      cancelled = true;
    };
  }, [enableSavedSearches]);

  // Load recently visited
  useEffect(() => {
    if (activeTab === 'recent' && recentItems.length === 0) {
      loadRecentItems();
    }
  }, [activeTab, recentItems.length, loadRecentItems]);

  useEffect(() => {
    if (!enableFavorites && activeTab === 'liked') {
      setActiveTab(enableSavedSearches ? 'searches' : 'recent');
    } else if (!enableSavedSearches && activeTab === 'searches') {
      setActiveTab(enableFavorites ? 'liked' : 'recent');
    }
  }, [activeTab, enableFavorites, enableSavedSearches]);

  const handleUnlike = async (listingId: number) => {
    if (!enableFavorites) return;
    try {
      await removeFavorite(listingId);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const handleDeleteSearch = async (id: number) => {
    if (!enableSavedSearches) return;
    try {
      await SavedSearches.delete(id);
      setSavedSearches(savedSearches.filter((search) => search.id !== id));
    } catch (error) {
      console.error('Failed to delete search:', error);
    }
  };

  const buildSearchUrl = (query: SavedSearch['query']) => {
    const params = new URLSearchParams();

    // Extract the actual search parameters from the nested 'params' object
    const searchParams = query.params || query;

    // Add all query parameters to the URL
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Handle array values (for multiselect attributes)
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });

    return `/search?${params.toString()}`;
  };

  const handleClearAll = async () => {
    if (activeTab === 'liked') {
      if (confirm(t('favorites.confirmClearFavorites'))) {
        try {
          await Promise.all(likedItems.map(item => removeFavorite(item.listingId)));
        } catch (error) {
          console.error('Failed to clear favorites:', error);
        }
      }
    } else if (activeTab === 'recent') {
      if (confirm(t('favorites.confirmClearHistory'))) {
        try {
          await clearRecentItems();
        } catch (error) {
          console.error('Failed to clear recent items:', error);
        }
      }
    }
  };

  const formatPrice = (amount: number) => {
    try {
      return new Intl.NumberFormat(locale === 'uz' ? 'uz-UZ' : 'ru-RU', {
        style: 'currency',
        currency: i18n.currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${amount} ${i18n.currencySymbol}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return t('favorites.hoursAgo', { hours: diffInHours });
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return t('favorites.daysAgo', { days: diffInDays });
    }
    return date.toLocaleDateString(locale === 'uz' ? 'uz-UZ' : 'ru-RU');
  };

  const renderFavoriteCard = (item: typeof likedItems[0]) => (
    <div key={item.id} className="listing-card">
      <Link href={`/l/${item.listingId}`} className="listing-card-link">
        {item.listingMediaUrls && item.listingMediaUrls.length > 0 ? (
          <div className="listing-card-img" style={{ backgroundImage: `url(${item.listingMediaUrls[0]})` }} />
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
        onClick={(e) => {
          e.preventDefault();
          handleUnlike(item.listingId);
        }}
        className="listing-card-remove"
        title={t('favorites.removeTooltip')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );

  const renderRecentCard = (item: typeof recentItems[0]) => (
    <div key={item.id} className="listing-card">
      <Link href={`/l/${item.listingId}`} className="listing-card-link">
        {item.mediaUrls && item.mediaUrls.length > 0 ? (
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
  );

  return (
    <div className="page-section page-section--padded" style={{ paddingTop: 0 }}>
      <h1 style={{ marginBottom: '32px', fontSize: '32px', fontWeight: 700 }}>
        {t('favorites.pageTitle')}
      </h1>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid var(--border)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {enableFavorites && (
            <button
              onClick={() => setActiveTab('liked')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'liked' ? '3px solid var(--brand)' : '3px solid transparent',
                fontWeight: activeTab === 'liked' ? 700 : 400,
                color: activeTab === 'liked' ? 'var(--brand)' : 'var(--muted)',
                cursor: 'pointer',
                marginBottom: '-2px',
              }}
            >
              {t('favorites.tabFavorites')} <span style={{ marginLeft: 4, fontWeight: 400 }}>({likedItems.length})</span>
            </button>
          )}
          {enableSavedSearches && (
            <button
              onClick={() => setActiveTab('searches')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'searches' ? '3px solid var(--brand)' : '3px solid transparent',
                fontWeight: activeTab === 'searches' ? 700 : 400,
                color: activeTab === 'searches' ? 'var(--brand)' : 'var(--muted)',
                cursor: 'pointer',
                marginBottom: '-2px',
              }}
            >
              {t('favorites.tabSavedSearches')} <span style={{ marginLeft: 4, fontWeight: 400 }}>({savedSearches.length})</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('recent')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'recent' ? '3px solid var(--brand)' : '3px solid transparent',
              fontWeight: activeTab === 'recent' ? 700 : 400,
              color: activeTab === 'recent' ? 'var(--brand)' : 'var(--muted)',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            {t('favorites.tabRecentlyViewed')}
          </button>
        </div>
      </div>

      {/* Clear all button */}
      {(activeTab === 'liked' && enableFavorites && likedItems.length > 0) || (activeTab === 'recent' && recentItems.length > 0) ? (
        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <button onClick={handleClearAll} className="btn-outline">
            {activeTab === 'liked'
              ? t('favorites.clearFavorites')
              : t('favorites.clearHistory')
            }
          </button>
        </div>
      ) : null}

      {/* Tab content */}
      {activeTab === 'liked' && enableFavorites && (
        <div>
          {loadingLiked ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
              {t('favorites.loading')}
            </div>
          ) : likedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>💔</div>
              <h3 style={{ color: 'var(--muted)', marginBottom: '8px' }}>
                {t('favorites.noFavorites')}
              </h3>
              <p style={{ color: 'var(--muted)' }}>
                {t('favorites.noFavoritesDescription')}
              </p>
            </div>
          ) : (
            <div className="listings-grid">
              {likedItems.map((item) => renderFavoriteCard(item))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'searches' && enableSavedSearches && (
        <div>
          {loadingSearches ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
              {t('favorites.loading')}
            </div>
          ) : savedSearches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ color: 'var(--muted)', marginBottom: '8px' }}>
                {t('favorites.noSavedSearches')}
              </h3>
              <p style={{ color: 'var(--muted)' }}>
                {t('favorites.noSavedSearchesDescription')}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {savedSearches.map((search) => (
                <div key={search.id} className="saved-search-card">
                  <Link href={buildSearchUrl(search.query)} style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', cursor: 'pointer', color: 'var(--brand)' }}>
                      {search.title}
                    </h3>
                    <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                      {search.query.category_name && <span>{search.query.category_name}</span>}
                      {search.query.location_name && <span> • {search.query.location_name}</span>}
                      {(search.query.price_min || search.query.price_max) && (
                        <span>
                          {' '}
                          • {t('favorites.priceLabel')}{' '}
                          {search.query.price_min ? `${search.query.price_min.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'ru-RU')} ${i18n.currencySymbol}` : '—'}
                          {' - '}
                          {search.query.price_max ? `${search.query.price_max.toLocaleString(locale === 'uz' ? 'uz-UZ' : 'ru-RU')} ${i18n.currencySymbol}` : '∞'}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                      {formatDate(search.created_at)}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleDeleteSearch(search.id)}
                    className="btn-outline"
                    style={{ padding: '8px 16px' }}
                  >
                    {t('favorites.deleteButton')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'recent' && (
        <div>
          {loadingRecent ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
              {t('favorites.loading')}
            </div>
          ) : recentItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>👀</div>
              <h3 style={{ color: 'var(--muted)', marginBottom: '8px' }}>
                {t('favorites.noRecentlyViewed')}
              </h3>
              <p style={{ color: 'var(--muted)' }}>
                {t('favorites.noRecentlyViewedDescription')}
              </p>
            </div>
          ) : (
            <div className="listings-grid">
              {recentItems.map((item) => renderRecentCard(item))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
