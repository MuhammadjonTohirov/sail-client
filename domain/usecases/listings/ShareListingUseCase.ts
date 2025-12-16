import { IListingsRepository } from '../../repositories/IListingsRepository';

export class ShareListingUseCase {
  constructor(private listingsRepository: IListingsRepository) {}

  async execute(listingId: number, chatIds: number[]): Promise<void> {
    return await this.listingsRepository.shareListing(listingId, chatIds);
  }
}
