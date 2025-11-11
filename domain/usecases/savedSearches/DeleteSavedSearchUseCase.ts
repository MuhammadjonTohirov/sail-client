import { ISavedSearchesRepository } from '../../repositories/ISavedSearchesRepository';

export class DeleteSavedSearchUseCase {
  constructor(private readonly repository: ISavedSearchesRepository) {}

  async execute(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Valid saved search ID is required');
    }

    await this.repository.deleteSavedSearch(id);
  }
}
