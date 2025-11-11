import { RecentlyViewedDTO } from '../models/RecentlyViewedDTO';
import { RecentlyViewedListing } from '../../domain/models/RecentlyViewedListing';

export class RecentlyViewedMapper {
  static toDomain(dto: RecentlyViewedDTO): RecentlyViewedListing {
    return {
      id: dto.id,
      listingId: dto.listing,
      title: dto.listing_title,
      price: dto.listing_price,
      location: dto.listing_location,
      mediaUrls: dto.listing_media_urls || [],
      viewedAt: new Date(dto.viewed_at),
    };
  }

  static toDomainList(dtos: RecentlyViewedDTO[]): RecentlyViewedListing[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
