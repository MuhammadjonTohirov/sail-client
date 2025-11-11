import { useState, useEffect, useCallback } from 'react';
import { FavoritesRepositoryImpl } from '../data/repositories/FavoritesRepositoryImpl';
import { ListFavoritesUseCase } from '../domain/usecases/favorites/ListFavoritesUseCase';
import { ToggleFavoriteUseCase } from '../domain/usecases/favorites/ToggleFavoriteUseCase';
import { RemoveFavoriteUseCase } from '../domain/usecases/favorites/RemoveFavoriteUseCase';
import type { Favorite } from '../domain/models/Favorite';

const repository = new FavoritesRepositoryImpl();
const listFavoritesUseCase = new ListFavoritesUseCase(repository);
const toggleFavoriteUseCase = new ToggleFavoriteUseCase(repository);
const removeFavoriteUseCase = new RemoveFavoriteUseCase(repository);

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listFavoritesUseCase.execute();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(async (listingId: number) => {
    try {
      const result = await toggleFavoriteUseCase.execute(listingId);

      if (result.favorited) {
        // Reload to get full listing data
        await loadFavorites();
      } else {
        // Remove from local state
        setFavorites(prev => prev.filter(item => item.listingId !== listingId));
      }

      return result.favorited;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to toggle favorite');
    }
  }, [loadFavorites]);

  const removeFavorite = useCallback(async (listingId: number) => {
    try {
      await removeFavoriteUseCase.execute(listingId);
      setFavorites(prev => prev.filter(item => item.listingId !== listingId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove favorite');
    }
  }, []);

  const isFavorite = useCallback((listingId: number) => {
    return favorites.some(item => item.listingId === listingId);
  }, [favorites]);

  return {
    favorites,
    loading,
    error,
    toggleFavorite,
    removeFavorite,
    isFavorite,
    reload: loadFavorites,
  };
}
