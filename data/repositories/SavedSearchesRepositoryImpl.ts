import { ISavedSearchesRepository } from '../../domain/repositories/ISavedSearchesRepository';
import { SavedSearch } from '../../domain/models/SavedSearch';
import { SavedSearchPayload, SavedSearchUpdatePayload } from '../../domain/models/SavedSearchPayload';
import { SavedSearchMapper } from '../mappers/SavedSearchMapper';
import { SavedSearches } from '../../lib/savedSearchesApi';

export class SavedSearchesRepositoryImpl implements ISavedSearchesRepository {
  async getSavedSearches(): Promise<SavedSearch[]> {
    const response = await SavedSearches.list();
    const dtos = response.results || [];
    return SavedSearchMapper.toDomainList(dtos);
  }

  async createSavedSearch(payload: SavedSearchPayload): Promise<SavedSearch> {
    const dto = SavedSearchMapper.payloadToDTO(payload);
    const result = await SavedSearches.create(dto);
    return SavedSearchMapper.toDomain(result);
  }

  async updateSavedSearch(id: number, payload: SavedSearchUpdatePayload): Promise<SavedSearch> {
    const dto = SavedSearchMapper.updatePayloadToDTO(payload);
    const result = await SavedSearches.update(id, dto);
    return SavedSearchMapper.toDomain(result);
  }

  async deleteSavedSearch(id: number): Promise<void> {
    await SavedSearches.delete(id);
  }

  async markSavedSearchViewed(id: number): Promise<void> {
    await SavedSearches.markViewed(id);
  }
}
