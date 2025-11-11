import { useState, useCallback, useMemo } from 'react';
import { SavedSearch } from '@/domain/models/SavedSearch';
import { SavedSearchPayload, SavedSearchUpdatePayload } from '@/domain/models/SavedSearchPayload';
import { GetSavedSearchesUseCase } from '@/domain/usecases/savedSearches/GetSavedSearchesUseCase';
import { CreateSavedSearchUseCase } from '@/domain/usecases/savedSearches/CreateSavedSearchUseCase';
import { UpdateSavedSearchUseCase } from '@/domain/usecases/savedSearches/UpdateSavedSearchUseCase';
import { DeleteSavedSearchUseCase } from '@/domain/usecases/savedSearches/DeleteSavedSearchUseCase';
import { SavedSearchesRepositoryImpl } from '@/data/repositories/SavedSearchesRepositoryImpl';

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new SavedSearchesRepositoryImpl(), []);
  const getUseCase = useMemo(() => new GetSavedSearchesUseCase(repository), [repository]);
  const createUseCase = useMemo(() => new CreateSavedSearchUseCase(repository), [repository]);
  const updateUseCase = useMemo(() => new UpdateSavedSearchUseCase(repository), [repository]);
  const deleteUseCase = useMemo(() => new DeleteSavedSearchUseCase(repository), [repository]);

  const loadSavedSearches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUseCase.execute();
      setSavedSearches(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load saved searches';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getUseCase]);

  const createSavedSearch = useCallback(async (payload: SavedSearchPayload): Promise<SavedSearch | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await createUseCase.execute(payload);
      setSavedSearches(prev => [...prev, result]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create saved search';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createUseCase]);

  const updateSavedSearch = useCallback(async (id: number, payload: SavedSearchUpdatePayload): Promise<SavedSearch | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateUseCase.execute(id, payload);
      setSavedSearches(prev => prev.map(item => item.id === id ? result : item));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update saved search';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUseCase]);

  const deleteSavedSearch = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteUseCase.execute(id);
      setSavedSearches(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete saved search';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteUseCase]);

  return {
    savedSearches,
    loading,
    error,
    loadSavedSearches,
    createSavedSearch,
    updateSavedSearch,
    deleteSavedSearch,
  };
}
