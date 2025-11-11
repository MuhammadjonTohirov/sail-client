export interface Category {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly icon?: string;
  readonly isLeaf: boolean;
  readonly parentId?: number;
  readonly children?: Category[];
}
