import { SavedSearch } from '../models/SavedSearch';
import { SavedSearchPayload, SavedSearchUpdatePayload } from '../models/SavedSearchPayload';

export interface ISavedSearchesRepository {
  getSavedSearches(): Promise<SavedSearch[]>;
  createSavedSearch(payload: SavedSearchPayload): Promise<SavedSearch>;
  updateSavedSearch(id: number, payload: SavedSearchUpdatePayload): Promise<SavedSearch>;
  deleteSavedSearch(id: number): Promise<void>;
}
