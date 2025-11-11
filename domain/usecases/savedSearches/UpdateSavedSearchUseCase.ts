import { ISavedSearchesRepository } from '../../repositories/ISavedSearchesRepository';
import { SavedSearchUpdatePayload } from '../../models/SavedSearchPayload';
import { SavedSearch } from '../../models/SavedSearch';

export class UpdateSavedSearchUseCase {
  constructor(private readonly repository: ISavedSearchesRepository) {}

  async execute(id: number, payload: SavedSearchUpdatePayload): Promise<SavedSearch> {
    if (!id || id <= 0) {
      throw new Error('Valid saved search ID is required');
    }

    return await this.repository.updateSavedSearch(id, payload);
  }
}
