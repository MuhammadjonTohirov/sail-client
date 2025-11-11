import { IFavoritesRepository } from '../../domain/repositories/IFavoritesRepository';
import { Favorite, ToggleFavoriteResult } from '../../domain/models/Favorite';
import { Favorites } from '../../lib/favoritesApi';
import { FavoriteMapper } from '../mappers/FavoriteMapper';
import { FavoriteDTO, ToggleFavoriteResultDTO } from '../models/FavoriteDTO';

export class FavoritesRepositoryImpl implements IFavoritesRepository {
  async list(): Promise<Favorite[]> {
    const data = await Favorites.list();
    const dtos = (data || []) as FavoriteDTO[];
    return dtos.map(dto => FavoriteMapper.toDomain(dto));
  }

  async toggle(listingId: number): Promise<ToggleFavoriteResult> {
    const data = await Favorites.toggle(listingId);
    const dto = data as ToggleFavoriteResultDTO;
    return FavoriteMapper.toggleResultToDomain(dto);
  }

  async remove(listingId: number): Promise<void> {
    await Favorites.delete(listingId);
  }
}
