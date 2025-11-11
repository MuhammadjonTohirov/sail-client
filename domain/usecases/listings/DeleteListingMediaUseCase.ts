import { IListingsRepository } from '../../repositories/IListingsRepository';

export class DeleteListingMediaUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(listingId: number, mediaId: number): Promise<void> {
    if (!listingId || listingId <= 0) {
      throw new Error('Invalid listing ID');
    }
    if (!mediaId || mediaId <= 0) {
      throw new Error('Invalid media ID');
    }

    await this.repository.deleteMedia(listingId, mediaId);
  }
}
