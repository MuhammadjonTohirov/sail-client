import { ISearchRepository } from '../../repositories/ISearchRepository';
import { SearchParams } from '../../models/SearchParams';
import { SearchResult } from '../../models/SearchResult';

export class SearchListingsUseCase {
  constructor(private readonly repository: ISearchRepository) {}

  async execute(params: SearchParams): Promise<SearchResult> {
    return await this.repository.searchListings(params);
  }
}
