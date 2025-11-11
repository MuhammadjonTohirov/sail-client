import { Favorite, ToggleFavoriteResult } from '../../domain/models/Favorite';
import { FavoriteDTO, ToggleFavoriteResultDTO } from '../models/FavoriteDTO';

export class FavoriteMapper {
  static toDomain(dto: FavoriteDTO): Favorite {
    return {
      id: dto.id,
      listingId: dto.listing,
      listingTitle: dto.listing_title,
      listingPrice: dto.listing_price,
      listingLocation: dto.listing_location,
      listingMediaUrls: dto.listing_media_urls,
      createdAt: dto.created_at,
    };
  }

  static toggleResultToDomain(dto: ToggleFavoriteResultDTO): ToggleFavoriteResult {
    return {
      favorited: dto.favorited,
    };
  }
}
