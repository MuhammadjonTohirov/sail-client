import { SearchParams } from '../models/SearchParams';
import { SearchResult } from '../models/SearchResult';

export interface ISearchRepository {
  searchListings(params: SearchParams): Promise<SearchResult>;
}
