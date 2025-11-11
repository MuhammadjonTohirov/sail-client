import { Favorite, ToggleFavoriteResult } from '../models/Favorite';

export interface IFavoritesRepository {
  list(): Promise<Favorite[]>;
  toggle(listingId: number): Promise<ToggleFavoriteResult>;
  remove(listingId: number): Promise<void>;
}
