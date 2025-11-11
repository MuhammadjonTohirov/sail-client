import { useState, useCallback, useMemo } from 'react';
import { SearchListing } from '@/domain/models/SearchListing';
import { SearchParams } from '@/domain/models/SearchParams';
import { SearchListingsUseCase } from '@/domain/usecases/search/SearchListingsUseCase';
import { SearchRepositoryImpl } from '@/data/repositories/SearchRepositoryImpl';

export function useSearch() {
  const [results, setResults] = useState<SearchListing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new SearchRepositoryImpl(), []);
  const searchUseCase = useMemo(() => new SearchListingsUseCase(repository), [repository]);

  const search = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const result = await searchUseCase.execute(params);
      setResults(result.results ?? []);
      setTotal(result.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [searchUseCase]);

  return {
    results,
    total,
    loading,
    error,
    search,
  };
}
