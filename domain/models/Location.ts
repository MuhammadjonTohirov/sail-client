export interface Location {
  readonly id: number;
  readonly name: string;
  readonly nameRu?: string;
  readonly nameUz?: string;
  readonly slug: string;
  readonly kind?: string;
  readonly lat?: number;
  readonly lon?: number;
  readonly hasChildren?: boolean;
  readonly parentId?: number;
  readonly children?: Location[];
}

export interface ReverseGeocodeLocation {
  readonly id: number;
  readonly name: string;
  readonly nameRu?: string;
  readonly nameUz?: string;
  readonly kind: string;
  readonly path: string;
  readonly distance: number;
}
