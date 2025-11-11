export interface SavedSearchDTO {
  id: number;
  title: string;
  query: Record<string, any>;
  frequency?: 'instant' | 'daily';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
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
