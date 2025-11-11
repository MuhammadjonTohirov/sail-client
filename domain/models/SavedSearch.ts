export type SearchFrequency = 'instant' | 'daily';

export interface SavedSearch {
  readonly id: number;
  readonly title: string;
  readonly query: Record<string, any>;
  readonly frequency?: SearchFrequency;
  readonly isActive?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
