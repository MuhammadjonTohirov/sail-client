import { IFavoritesRepository } from '../../repositories/IFavoritesRepository';

export class RemoveFavoriteUseCase {
  constructor(private readonly repository: IFavoritesRepository) {}

  async execute(listingId: number): Promise<void> {
    if (!listingId || listingId <= 0) {
      throw new Error('Valid listing ID is required');
    }

    await this.repository.remove(listingId);
  }
}
