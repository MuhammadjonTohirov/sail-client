export interface SearchParams {
  readonly q?: string;
  readonly categorySlug?: string;
  readonly minPrice?: string | number;
  readonly maxPrice?: string | number;
  readonly sort?: string;
  readonly perPage?: number;
  readonly page?: number;
  readonly attributes?: Record<string, any>;
}
