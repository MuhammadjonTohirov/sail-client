import { ISavedSearchesRepository } from '../../repositories/ISavedSearchesRepository';

export class MarkSavedSearchViewedUseCase {
  constructor(private readonly repository: ISavedSearchesRepository) {}

  async execute(id: number): Promise<void> {
    return await this.repository.markSavedSearchViewed(id);
  }
}
