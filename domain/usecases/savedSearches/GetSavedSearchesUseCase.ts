import { ISavedSearchesRepository } from '../../repositories/ISavedSearchesRepository';
import { SavedSearch } from '../../models/SavedSearch';

export class GetSavedSearchesUseCase {
  constructor(private readonly repository: ISavedSearchesRepository) {}

  async execute(): Promise<SavedSearch[]> {
    return await this.repository.getSavedSearches();
  }
}
