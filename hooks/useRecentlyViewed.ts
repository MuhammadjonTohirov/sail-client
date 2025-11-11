import { useState, useCallback, useMemo } from 'react';
import { RecentlyViewedListing } from '@/domain/models/RecentlyViewedListing';
import { GetRecentlyViewedUseCase } from '@/domain/usecases/recentlyViewed/GetRecentlyViewedUseCase';
import { TrackRecentlyViewedUseCase } from '@/domain/usecases/recentlyViewed/TrackRecentlyViewedUseCase';
import { ClearRecentlyViewedUseCase } from '@/domain/usecases/recentlyViewed/ClearRecentlyViewedUseCase';
import { RecentlyViewedRepositoryImpl } from '@/data/repositories/RecentlyViewedRepositoryImpl';

export function useRecentlyViewed() {
  const [recentItems, setRecentItems] = useState<RecentlyViewedListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new RecentlyViewedRepositoryImpl(), []);
  const getUseCase = useMemo(() => new GetRecentlyViewedUseCase(repository), [repository]);
  const trackUseCase = useMemo(() => new TrackRecentlyViewedUseCase(repository), [repository]);
  const clearUseCase = useMemo(() => new ClearRecentlyViewedUseCase(repository), [repository]);

  const loadRecentItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getUseCase.execute();
      setRecentItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recent items');
      setRecentItems([]);
    } finally {
      setLoading(false);
    }
  }, [getUseCase]);

  const trackViewed = useCallback(async (listingId: number) => {
    try {
      await trackUseCase.execute(listingId);
      await loadRecentItems();
    } catch (err) {
      console.warn('Failed to track viewed listing:', err);
    }
  }, [trackUseCase, loadRecentItems]);

  const clearAll = useCallback(async () => {
    try {
      await clearUseCase.execute();
      setRecentItems([]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to clear recent items');
    }
  }, [clearUseCase]);

  return {
    recentItems,
    loading,
    error,
    trackViewed,
    clearAll,
    load: loadRecentItems,
  };
}
