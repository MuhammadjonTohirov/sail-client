export interface GeoLocation {
  readonly lat: number;
  readonly lon: number;
  readonly displayName?: string;
  readonly placeId?: number;
  readonly category?: string;
  readonly type?: string;
  readonly addressType?: string;
}

export interface GeocodeResult {
  readonly place_id: number;
  readonly lat: string;
  readonly lon: string;
  readonly display_name: string;
  readonly category?: string;
  readonly type?: string;
  readonly addresstype?: string;
  readonly name?: string;
}
