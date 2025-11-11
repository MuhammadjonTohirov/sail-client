import { ISavedSearchesRepository } from '../../domain/repositories/ISavedSearchesRepository';
import { SavedSearch } from '../../domain/models/SavedSearch';
import { SavedSearchPayload, SavedSearchUpdatePayload } from '../../domain/models/SavedSearchPayload';
import { SavedSearchDTO } from '../models/SavedSearchDTO';
import { SavedSearchMapper } from '../mappers/SavedSearchMapper';
import { SavedSearches } from '../../lib/savedSearchesApi';

export class SavedSearchesRepositoryImpl implements ISavedSearchesRepository {
  async getSavedSearches(): Promise<SavedSearch[]> {
    const response: any = await SavedSearches.list();
    const dtos: SavedSearchDTO[] = response.results || response || [];
    return SavedSearchMapper.toDomainList(dtos);
  }

  async createSavedSearch(payload: SavedSearchPayload): Promise<SavedSearch> {
    const dto = SavedSearchMapper.payloadToDTO(payload);
    const result: SavedSearchDTO = await SavedSearches.create(dto);
    return SavedSearchMapper.toDomain(result);
  }

  async updateSavedSearch(id: number, payload: SavedSearchUpdatePayload): Promise<SavedSearch> {
    const dto = SavedSearchMapper.updatePayloadToDTO(payload);
    const result: SavedSearchDTO = await SavedSearches.update(id, dto);
    return SavedSearchMapper.toDomain(result);
  }

  async deleteSavedSearch(id: number): Promise<void> {
    await SavedSearches.delete(id);
  }
}
