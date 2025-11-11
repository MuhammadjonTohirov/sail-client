import { IListingsRepository } from '../../repositories/IListingsRepository';
import { Listing } from '../../models/Listing';

export class GetListingDetailUseCase {
  constructor(private readonly repository: IListingsRepository) {}

  async execute(id: number): Promise<Listing> {
    if (!id || id <= 0) {
      throw new Error('Invalid listing ID');
    }

    return await this.repository.getListingDetail(id);
  }
}
