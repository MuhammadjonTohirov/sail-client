import { IFavoritesRepository } from '../../repositories/IFavoritesRepository';
import { ToggleFavoriteResult } from '../../models/Favorite';

export class ToggleFavoriteUseCase {
  constructor(private readonly repository: IFavoritesRepository) {}

  async execute(listingId: number): Promise<ToggleFavoriteResult> {
    if (!listingId || listingId <= 0) {
      throw new Error('Valid listing ID is required');
    }

    return await this.repository.toggle(listingId);
  }
}
