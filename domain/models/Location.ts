export interface Location {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly parentId?: number;
  readonly level?: number;
  readonly children?: Location[];
}
