import { ISearchRepository } from '../../domain/repositories/ISearchRepository';
import { SearchParams } from '../../domain/models/SearchParams';
import { SearchResult } from '../../domain/models/SearchResult';
import { SearchResultDTO } from '../models/SearchDTO';
import { SearchMapper } from '../mappers/SearchMapper';
import { Search } from '../../lib/searchApi';

export class SearchRepositoryImpl implements ISearchRepository {
  async searchListings(params: SearchParams): Promise<SearchResult> {
    // Convert domain params to API params
    const apiParams: Record<string, any> = {};

    if (params.q) apiParams.q = params.q;
    if (params.categorySlug) apiParams.category_slug = params.categorySlug;
    if (params.minPrice) apiParams.min_price = params.minPrice;
    if (params.maxPrice) apiParams.max_price = params.maxPrice;
    if (params.sort) apiParams.sort = params.sort;
    if (params.perPage) apiParams.per_page = params.perPage;
    if (params.page) apiParams.page = params.page;

    // Add attributes to params
    if (params.attributes) {
      Object.entries(params.attributes).forEach(([key, value]) => {
        apiParams[key] = value;
      });
    }

    const data: SearchResultDTO = await Search.listings(apiParams);
    return SearchMapper.resultToDomain(data);
  }
}
