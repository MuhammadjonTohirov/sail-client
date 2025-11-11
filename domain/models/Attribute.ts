export type AttributeType = 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'range';

export interface Attribute {
  readonly id: number;
  readonly key: string;
  readonly label: string;
  readonly type: AttributeType;
  readonly options?: string[];
  readonly required?: boolean;
  readonly order?: number;
}
