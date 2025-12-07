'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useFavorites } from '@/hooks/useFavorites';
import { appConfig } from '@/config';
import { GetSavedSearchesUseCase } from '@/domain/usecases/savedSearches/GetSavedSearchesUseCase';
import { SavedSearchesRepositoryImpl } from '@/data/repositories/SavedSearchesRepositoryImpl';
import { SavedSearch } from '@/domain/models/SavedSearch';
import { DeleteSavedSearchUseCase } from '@/domain/usecases/savedSearches/DeleteSavedSearchUseCase';
import { MarkSavedSearchViewedUseCase } from '@/domain/usecases/savedSearches/MarkSavedSearchViewedUseCase';
import { FavoritesTabs, FavoritesTab } from './components/FavoritesTabs';
import { LikedItemsSection } from './components/LikedItemsSection';
import { SavedSearchesSection } from './components/SavedSearchesSection';
import { RecentItemsSection } from './components/RecentItemsSection';

export default function FavoritesPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const { features, i18n } = appConfig;
  const enableFavorites = features.enableFavorites;
  const enableSavedSearches = features.enableSavedSearches;
  const initialTab: FavoritesTab = enableFavorites ? 'liked' : enableSavedSearches ? 'searches' : 'recent';
  const [activeTab, setActiveTab] = useState<FavoritesTab>(initialTab);

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
        const usecase = new GetSavedSearchesUseCase(new SavedSearchesRepositoryImpl());
        const savedSearchList = await usecase.execute();

        if (!cancelled) {
          setSavedSearches(savedSearchList);
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

    // Add confirmation dialog
    if (!confirm(t('favorites.confirmDeleteSearch'))) {
      return;
    }

    try {
      const deleteUseCase = new DeleteSavedSearchUseCase(new SavedSearchesRepositoryImpl());
      await deleteUseCase.execute(id);
      // Update UI immediately after successful deletion
      setSavedSearches((prev) => prev.filter((search) => search.id !== id));
    } catch (error) {
      console.error('Failed to delete search:', error);
      alert(t('favorites.deleteSearchError'));
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
    const url = `/search?${params.toString()}`;
    console.log('Built search URL:', url);
    return url;
  };

  const handleSavedSearchNavigation = async (search: SavedSearch) => {
    try {
      // Mark the search as viewed to update last_viewed_at
      const markViewedUseCase = new MarkSavedSearchViewedUseCase(new SavedSearchesRepositoryImpl());
      await markViewedUseCase.execute(search.id);

      // Update local state to reflect the change
      setSavedSearches((prev) =>
        prev.map((s) =>
          s.id === search.id
            ? { ...s, lastViewedAt: new Date().toISOString(), newItemsCount: 0 }
            : s
        )
      );
    } catch (error) {
      console.error('Failed to mark search as viewed:', error);
    }
    return router.push(buildSearchUrl(search.query));
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

  return (
    <div className="page-section page-section--padded" style={{ paddingTop: 0, paddingLeft: 20, paddingRight: 20 }}>
      <h1 style={{ marginBottom: '32px', fontSize: '32px', fontWeight: 700 }}>
        {t('favorites.pageTitle')}
      </h1>

      <FavoritesTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        enableFavorites={enableFavorites}
        enableSavedSearches={enableSavedSearches}
        favoritesLabel={t('favorites.tabFavorites')}
        savedSearchesLabel={t('favorites.tabSavedSearches')}
        recentLabel={t('favorites.tabRecentlyViewed')}
        favoritesCount={likedItems.length}
        savedSearchesCount={savedSearches.length}
      />

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
        <LikedItemsSection
          loading={loadingLiked}
          items={likedItems}
          formatPrice={formatPrice}
          formatDate={formatDate}
          onUnlike={handleUnlike}
          messages={{
            loading: t('favorites.loading'),
            emptyTitle: t('favorites.noFavorites'),
            emptyDescription: t('favorites.noFavoritesDescription'),
            removeTooltip: t('favorites.removeTooltip'),
          }}
        />
      )}

      {activeTab === 'searches' && enableSavedSearches && (
        <SavedSearchesSection
          loading={loadingSearches}
          searches={savedSearches}
          locale={locale}
          currencySymbol={i18n.currencySymbol}
          formatDate={formatDate}
          onSelect={handleSavedSearchNavigation}
          onDelete={handleDeleteSearch}
          messages={{
            loading: t('favorites.loading'),
            emptyTitle: t('favorites.noSavedSearches'),
            emptyDescription: t('favorites.noSavedSearchesDescription'),
            priceLabel: t('favorites.priceLabel'),
            priceNotSpecified: t('favorites.priceNotSpecified'),
            deleteButton: t('favorites.deleteButton'),
            newItemsFound: t('favorites.newItemsFound'),
            noNewItems: t('favorites.noNewItems'),
          }}
        />
      )}

      {activeTab === 'recent' && (
        <RecentItemsSection
          loading={loadingRecent}
          items={recentItems}
          formatPrice={formatPrice}
          formatDate={formatDate}
          messages={{
            loading: t('favorites.loading'),
            emptyTitle: t('favorites.noRecentlyViewed'),
            emptyDescription: t('favorites.noRecentlyViewedDescription'),
          }}
        />
      )}
    </div>
  );
}
