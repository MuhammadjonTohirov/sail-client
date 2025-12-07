export interface SavedSearchDTO {
  id: number;
  title: string;
  query: Record<string, any>;
  frequency?: 'instant' | 'daily';
  is_active?: boolean;
  last_viewed_at?: string;
  created_at?: string;
  updated_at?: string;
  new_items_count?: number;
}

export interface SavedSearchPayloadDTO {
  title: string;
  query: Record<string, any>;
  frequency?: 'instant' | 'daily';
}

export interface SavedSearchUpdatePayloadDTO {
  title?: string;
  query?: Record<string, any>;
  frequency?: 'instant' | 'daily';
  is_active?: boolean;
}
