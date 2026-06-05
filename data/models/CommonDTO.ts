/**
 * Standard paginated list payload returned inside the API envelope's `data` field.
 * Shared by all list endpoints (listings, search, telegram-chats, ...).
 */
export interface PaginatedDTO<T> {
  results: T[];
  count: number;
  page: number;
  per_page: number;
  next: string | null;
  previous: string | null;
}
