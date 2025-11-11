import { ISavedSearchesRepository } from '../../repositories/ISavedSearchesRepository';
import { SavedSearchPayload } from '../../models/SavedSearchPayload';
import { SavedSearch } from '../../models/SavedSearch';

export class CreateSavedSearchUseCase {
  constructor(private readonly repository: ISavedSearchesRepository) {}

  async execute(payload: SavedSearchPayload): Promise<SavedSearch> {
    if (!payload.title || payload.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!payload.query || Object.keys(payload.query).length === 0) {
      throw new Error('Search query is required');
    }

    return await this.repository.createSavedSearch(payload);
  }
}