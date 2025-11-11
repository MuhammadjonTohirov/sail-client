import { ListingSeller } from "./Listing";

export interface SearchListing {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly price?: number | null;
  readonly condition?: string | null;
  readonly currency?: string | null;
  readonly mediaUrls?: string[] | null;
  readonly qualityScore?: number | null;
  readonly score?: number | null;
  readonly locationNameRu?: string | null;
  readonly locationNameUz?: string | null;
  readonly refreshedAt?: string | null;
  readonly isPromoted?: boolean | null;
  readonly seller?: ListingSeller | null;
}
