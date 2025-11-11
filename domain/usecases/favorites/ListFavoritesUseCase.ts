import { IFavoritesRepository } from '../../repositories/IFavoritesRepository';
import { Favorite } from '../../models/Favorite';

export class ListFavoritesUseCase {
  constructor(private readonly repository: IFavoritesRepository) {}

  async execute(): Promise<Favorite[]> {
    return await this.repository.list();
  }
}
