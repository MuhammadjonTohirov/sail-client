import { IListingsRepository } from '../../repositories/IListingsRepository';

export class ReorderListingMediaUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(listingId: number, mediaIds: number[]): Promise<void> {
    return this.repository.reorderMedia(listingId, mediaIds);
  }
}
