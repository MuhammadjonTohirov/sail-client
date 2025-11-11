import {
  SearchFacetOptionDTO,
  SearchFacetsDTO,
  SearchListingDTO,
  SearchPriceRangeFacetDTO,
  SearchResultDTO,
} from '../models/SearchDTO';
import { SearchListing } from '../../domain/models/SearchListing';
import {
  SearchFacetOption,
  SearchFacets,
  SearchPriceRangeFacet,
  SearchResult,
} from '../../domain/models/SearchResult';

export class SearchMapper {
  static listingToDomain(dto: SearchListingDTO): SearchListing {
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

    return {
      id: dto.id,
      title: dto.title,
      price: dto.price ?? null,
      description: dto.description ?? null,
      condition: dto.condition ?? null,
      score: dto.score ?? null,
      qualityScore: dto.quality_score ?? null,
      currency: dto.currency ?? null,
      mediaUrls: dto.media_urls ?? null,
      locationNameRu: dto.location_name_ru ?? null,
      locationNameUz: dto.location_name_uz ?? null,
      refreshedAt: dto.refreshed_at ?? null,
      isPromoted: dto.is_promoted ?? null,
      seller: seller
    };
  }

  static searchListingToDomainList(dtos: SearchListingDTO[]): SearchListing[] {
    return dtos.map(dto => this.listingToDomain(dto));
  }

  static resultToDomain(dto: SearchResultDTO): SearchResult {
    const results = Array.isArray(dto.results)
      ? dto.results.map((listing) => this.listingToDomain(listing))
      : dto.results ?? null;

    const facets = this.mapFacets(dto.facets);

    return {
      results,
      total: dto.total ?? null,
      page: dto.page ?? null,
      perPage: dto.per_page ?? null,
      facets,
    };
  }

  private static mapFacets(facets?: SearchFacetsDTO | null): SearchFacets | null | undefined {
    if (facets === undefined) return undefined;
    if (facets === null) return null;

    const mapped: SearchFacets = {};

    const categories = this.mapFacetOptions(facets.categories);
    if (categories !== undefined) {
      mapped.categories = categories;
    }

    const locations = this.mapFacetOptions(facets.locations);
    if (locations !== undefined) {
      mapped.locations = locations;
    }

    const conditions = this.mapFacetOptions(facets.conditions);
    if (conditions !== undefined) {
      mapped.conditions = conditions;
    }

    const priceRange = this.mapPriceRange(facets.price_range);
    if (priceRange !== undefined) {
      mapped.price_range = priceRange;
    }

    const attributes = this.mapFacetAttributes(facets.attributes);
    if (attributes !== undefined) {
      mapped.attributes = attributes;
    }

    return mapped;
  }

  private static mapFacetOptions(
    options?: SearchFacetOptionDTO[] | null,
  ): SearchFacetOption[] | null | undefined {
    if (options === undefined) return undefined;
    if (options === null) return null;

    return options.map((option) => ({
      key: option?.key ?? null,
      count: option?.count ?? null,
    }));
  }

  private static mapPriceRange(
    priceRange?: SearchPriceRangeFacetDTO | null,
  ): SearchPriceRangeFacet | null | undefined {
    if (priceRange === undefined) return undefined;
    if (priceRange === null) return null;

    return {
      min: priceRange.min ?? null,
      max: priceRange.max ?? null,
      currency: priceRange.currency ?? null,
    };
  }

  private static mapFacetAttributes(
    attributes?: Record<string, SearchFacetOptionDTO[] | null> | null,
  ): Record<string, SearchFacetOption[] | null> | null | undefined {
    if (attributes === undefined) return undefined;
    if (attributes === null) return null;

    const mapped: Record<string, SearchFacetOption[] | null> = {};

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      const options = value === null ? null : this.mapFacetOptions(value) ?? null;
      mapped[key] = options;
    });

    return mapped;
  }
}
