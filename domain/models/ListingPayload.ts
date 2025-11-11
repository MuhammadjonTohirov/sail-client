export interface ListingPayload {
  readonly title: string;
  readonly description?: string;
  readonly priceAmount: string | number;
  readonly priceCurrency: string;
  readonly isPriceNegotiable?: boolean;
  readonly condition: string;
  readonly dealType?: 'sell' | 'exchange' | 'free';
  readonly sellerType?: 'person' | 'business';
  readonly categoryId: number;
  readonly locationId: number;
  readonly lat?: number;
  readonly lon?: number;
  readonly attributes?: Array<{ attributeId: number; value: unknown }>;
}
