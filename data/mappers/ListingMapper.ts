import { ListingDTO, ListingPayloadDTO } from '../models/ListingDTO';
import { Listing } from '../../domain/models/Listing';
import { ListingPayload } from '../../domain/models/ListingPayload';
import { SearchListingDTO } from '../models/SearchDTO';

export class ListingMapper {
  static toDomain(dto: ListingDTO): Listing {
    const media = Array.isArray(dto.media)
      ? dto.media.map((item) => ({
          id: item.id,
          type: item.type ?? null,
          image: item.image ?? null,
          imageUrl: item.image_url ?? null,
          width: item.width ?? null,
          height: item.height ?? null,
          order: item.order ?? null,
          uploadedAt: item.uploaded_at ?? null,
        }))
      : undefined;

    const seller = dto.seller
      ? {
          id: dto.seller.id,
          name: dto.seller.name,
          avatarUrl: dto.seller.avatar_url,
          since: dto.seller.since ?? null,
          logo: dto.seller.logo ?? null,
          banner: dto.seller.banner ?? null,
          phone: dto.seller.phone,
          lastActiveAt: dto.seller.last_active_at ?? null,
        }
      : undefined;

    const user = dto.user
      ? {
          id: dto.user.id,
          phone: dto.user.phone,
          name: dto.user.name,
          displayName: dto.user.display_name,
          phoneE164: dto.user.phone_e164,
        }
      : undefined;

    const mediaUrls =
      dto.media_urls ??
      (media
        ? media
            .map((item) => item.imageUrl || item.image || '')
            .filter((url): url is string => Boolean(url))
        : undefined);

    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      priceAmount: dto.price_amount,
      priceCurrency: dto.price_currency,
      isPriceNegotiable: dto.is_price_negotiable,
      condition: dto.condition,
      dealType: dto.deal_type,
      sellerType: dto.seller_type,
      categoryId: dto.category || 0,
      categoryName: dto.category_name,
      categorySlug: dto.category_slug,
      locationId: dto.location || 0,
      locationName: dto.location_name,
      locationSlug: dto.location_slug,
      lat: dto.lat,
      lon: dto.lon,
      media,
      mediaUrls,
      attributes: dto.attributes,
      status: dto.status,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      refreshedAt: dto.refreshed_at,
      expiresAt: dto.expires_at,
      qualityScore: dto.quality_score ?? null,
      contactPhoneMasked: dto.contact_phone_masked ?? null,
      priceNormalized: dto.price_normalized ?? null,
      isPromoted: dto.is_promoted ?? null,
      userId: dto.user_id ?? seller?.id ?? user?.id,
      user,
      seller,
    };
  }
  
  static toDomainList(dtos: ListingDTO[]): Listing[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  static payloadToDTO(payload: ListingPayload): ListingPayloadDTO {
    return {
      title: payload.title,
      description: payload.description,
      price_amount: payload.priceAmount,
      price_currency: payload.priceCurrency,
      is_price_negotiable: payload.isPriceNegotiable,
      condition: payload.condition,
      deal_type: payload.dealType,
      seller_type: payload.sellerType,
      category: payload.categoryId,
      location: payload.locationId,
      lat: payload.lat,
      lon: payload.lon,
      attributes: payload.attributes?.map(attr => ({
        attribute: attr.attributeId,
        value: attr.value,
      })),
    };
  }

  static partialPayloadToDTO(payload: Partial<ListingPayload>): Partial<ListingPayloadDTO> {
    const dto: Partial<ListingPayloadDTO> = {};

    if (payload.title !== undefined) dto.title = payload.title;
    if (payload.description !== undefined) dto.description = payload.description;
    if (payload.priceAmount !== undefined) dto.price_amount = payload.priceAmount;
    if (payload.priceCurrency !== undefined) dto.price_currency = payload.priceCurrency;
    if (payload.isPriceNegotiable !== undefined) dto.is_price_negotiable = payload.isPriceNegotiable;
    if (payload.condition !== undefined) dto.condition = payload.condition;
    if (payload.dealType !== undefined) dto.deal_type = payload.dealType;
    if (payload.sellerType !== undefined) dto.seller_type = payload.sellerType;
    if (payload.categoryId !== undefined) dto.category = payload.categoryId;
    if (payload.locationId !== undefined) dto.location = payload.locationId;
    if (payload.lat !== undefined) dto.lat = payload.lat;
    if (payload.lon !== undefined) dto.lon = payload.lon;
    if (payload.attributes !== undefined) {
      dto.attributes = payload.attributes?.map(attr => ({
        attribute: attr.attributeId,
        value: attr.value,
      }));
    }

    return dto;
  }
}
