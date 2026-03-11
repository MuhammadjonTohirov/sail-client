import { IFavoritesRepository } from '../../domain/repositories/IFavoritesRepository';
import { Favorite, ToggleFavoriteResult } from '../../domain/models/Favorite';
import { Favorites } from '../../lib/favoritesApi';
import { FavoriteMapper } from '../mappers/FavoriteMapper';
import { getToken } from '@/lib/apiUtils';

export class FavoritesRepositoryImpl implements IFavoritesRepository {
  async list(): Promise<Favorite[]> {
    const token = getToken();
    if (token == null) return [];

    const dtos = await Favorites.list();
    return (dtos || []).map(dto => FavoriteMapper.toDomain(dto));
  }

  async toggle(listingId: number): Promise<ToggleFavoriteResult> {
    const dto = await Favorites.toggle(listingId);
    return FavoriteMapper.toggleResultToDomain(dto);
  }

  async remove(listingId: number): Promise<void> {
    await Favorites.delete(listingId);
  }
}
