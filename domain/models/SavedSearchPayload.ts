import { SearchFrequency } from './SavedSearch';

export interface SavedSearchPayload {
  readonly title: string;
  readonly query: Record<string, any>;
  readonly frequency?: SearchFrequency;
}

export interface SavedSearchUpdatePayload {
  readonly title?: string;
  readonly query?: Record<string, any>;
  readonly frequency?: SearchFrequency;
  readonly isActive?: boolean;
}
