"use client";

import { GetCategoriesUseCase } from '@/domain/usecases/taxonomy/GetCategoriesUseCase';
import { GetCategoryAttributesUseCase } from '@/domain/usecases/taxonomy/GetCategoryAttributesUseCase';
import { SearchListingsUseCase } from '@/domain/usecases/search/SearchListingsUseCase';
import { CreateSavedSearchUseCase } from '@/domain/usecases/savedSearches/CreateSavedSearchUseCase';
import { TaxonomyRepositoryImpl } from '@/data/repositories/TaxonomyRepositoryImpl';
import { SearchRepositoryImpl } from '@/data/repositories/SearchRepositoryImpl';
import { SavedSearchesRepositoryImpl } from '@/data/repositories/SavedSearchesRepositoryImpl';
import { CategoryNode, Attr, Hit } from './types';
import { SearchListing } from '@/domain/models/SearchListing';

export class SearchInteractor {
  private getCategoriesUseCase: GetCategoriesUseCase;
  private getCategoryAttributesUseCase: GetCategoryAttributesUseCase;
  private searchListingsUseCase: SearchListingsUseCase;
  private createSavedSearchUseCase: CreateSavedSearchUseCase;

  constructor() {
    const taxonomyRepository = new TaxonomyRepositoryImpl();
    const searchRepository = new SearchRepositoryImpl();
    const savedSearchesRepository = new SavedSearchesRepositoryImpl();

    this.getCategoriesUseCase = new GetCategoriesUseCase(taxonomyRepository);
    this.getCategoryAttributesUseCase = new GetCategoryAttributesUseCase(taxonomyRepository);
    this.searchListingsUseCase = new SearchListingsUseCase(searchRepository);
    this.createSavedSearchUseCase = new CreateSavedSearchUseCase(savedSearchesRepository);
  }

  async fetchCategoryTree(): Promise<CategoryNode[]> {
    const categories = await this.getCategoriesUseCase.execute();
    // Map domain Category to CategoryNode
    return categories as any;
  }

  async fetchCategoryAttributes(categoryId: number): Promise<Attr[]> {
    const attributes = await this.getCategoryAttributesUseCase.execute(categoryId);
    // Map domain Attribute to Attr
    return attributes as any;
  }

  async fetchListings(params: Record<string, any>): Promise<{ results?: SearchListing[]; total?: number }> {
    // Extract attributes from params (attrs.*)
    const attributes: Record<string, any> = {};
    const cleanParams: any = { ...params };

    Object.keys(params).forEach(key => {
      if (key.startsWith('attrs.')) {
        attributes[key] = params[key];
        delete cleanParams[key];
      }
    });

    // Convert to domain SearchParams
    const searchParams = {
      q: cleanParams.q,
      categorySlug: cleanParams.category_slug,
      minPrice: cleanParams.min_price,
      maxPrice: cleanParams.max_price,
      sort: cleanParams.sort,
      perPage: cleanParams.per_page,
      page: cleanParams.page,
      attributes,
    };

    const result = await this.searchListingsUseCase.execute(searchParams);

    // Map domain SearchResult to expected format
    return {
      results: result.results ?? [],
      total: result.total ?? undefined,
    };
  }

  async saveSearch(payload: { title: string; query: Record<string, any> }) {
    const savedSearch = await this.createSavedSearchUseCase.execute(payload);
    return savedSearch;
  }
}
