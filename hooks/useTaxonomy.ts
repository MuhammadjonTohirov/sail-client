import { useState, useCallback, useMemo } from 'react';
import { Category } from '@/domain/models/Category';
import { Attribute } from '@/domain/models/Attribute';
import { Location } from '@/domain/models/Location';
import { GetCategoriesUseCase } from '@/domain/usecases/taxonomy/GetCategoriesUseCase';
import { GetCategoryAttributesUseCase } from '@/domain/usecases/taxonomy/GetCategoryAttributesUseCase';
import { GetLocationsUseCase } from '@/domain/usecases/taxonomy/GetLocationsUseCase';
import { TaxonomyRepositoryImpl } from '@/data/repositories/TaxonomyRepositoryImpl';

export function useTaxonomy() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new TaxonomyRepositoryImpl(), []);
  const getCategoriesUseCase = useMemo(() => new GetCategoriesUseCase(repository), [repository]);
  const getAttributesUseCase = useMemo(() => new GetCategoryAttributesUseCase(repository), [repository]);
  const getLocationsUseCase = useMemo(() => new GetLocationsUseCase(repository), [repository]);

  const loadCategories = useCallback(async (language?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getCategoriesUseCase.execute(language);
      setCategories(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getCategoriesUseCase]);

  const loadCategoryAttributes = useCallback(async (categoryId: number, language?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAttributesUseCase.execute(categoryId, language);
      setAttributes(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load category attributes';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getAttributesUseCase]);

  const loadLocations = useCallback(async (parentId?: number, language?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getLocationsUseCase.execute(parentId, language);
      setLocations(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load locations';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getLocationsUseCase]);

  return {
    categories,
    attributes,
    locations,
    loading,
    error,
    loadCategories,
    loadCategoryAttributes,
    loadLocations,
  };
}
