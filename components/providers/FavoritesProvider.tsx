"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FavoritesRepositoryImpl } from "@/data/repositories/FavoritesRepositoryImpl";
import { ListFavoritesUseCase } from "@/domain/usecases/favorites/ListFavoritesUseCase";
import { ToggleFavoriteUseCase } from "@/domain/usecases/favorites/ToggleFavoriteUseCase";
import { RemoveFavoriteUseCase } from "@/domain/usecases/favorites/RemoveFavoriteUseCase";
import type { Favorite } from "@/domain/models/Favorite";

type FavoritesContextValue = {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  isFavorite: (listingId: number) => boolean;
  reload: () => Promise<void>;
  toggleFavorite: (listingId: number) => Promise<boolean>;
  removeFavorite: (listingId: number) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new FavoritesRepositoryImpl(), []);
  const listFavoritesUseCase = useMemo(
    () => new ListFavoritesUseCase(repository),
    [repository]
  );
  const toggleFavoriteUseCase = useMemo(
    () => new ToggleFavoriteUseCase(repository),
    [repository]
  );
  const removeFavoriteUseCase = useMemo(
    () => new RemoveFavoriteUseCase(repository),
    [repository]
  );

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listFavoritesUseCase.execute();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load favorites");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [listFavoritesUseCase]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(
    async (listingId: number) => {
      const result = await toggleFavoriteUseCase.execute(listingId);

      if (result.favorited) {
        await loadFavorites();
      } else {
        setFavorites((prev) =>
          prev.filter((item) => item.listingId !== listingId)
        );
      }

      return result.favorited;
    },
    [toggleFavoriteUseCase, loadFavorites]
  );

  const removeFavorite = useCallback(
    async (listingId: number) => {
      await removeFavoriteUseCase.execute(listingId);
      setFavorites((prev) =>
        prev.filter((item) => item.listingId !== listingId)
      );
    },
    [removeFavoriteUseCase]
  );

  const isFavorite = useCallback(
    (listingId: number) => favorites.some((item) => item.listingId === listingId),
    [favorites]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      loading,
      error,
      isFavorite,
      reload: loadFavorites,
      toggleFavorite,
      removeFavorite,
    }),
    [favorites, loading, error, isFavorite, loadFavorites, toggleFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavorites must be used within a FavoritesProvider"
    );
  }
  return context;
}
