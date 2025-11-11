import { SavedSearchDTO, SavedSearchPayloadDTO, SavedSearchUpdatePayloadDTO } from '../models/SavedSearchDTO';
import { SavedSearch } from '../../domain/models/SavedSearch';
import { SavedSearchPayload, SavedSearchUpdatePayload } from '../../domain/models/SavedSearchPayload';

export class SavedSearchMapper {
  static toDomain(dto: SavedSearchDTO): SavedSearch {
    return {
      id: dto.id,
      title: dto.title,
      query: dto.query,
      frequency: dto.frequency,
      isActive: dto.is_active,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }

  static toDomainList(dtos: SavedSearchDTO[]): SavedSearch[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  static payloadToDTO(payload: SavedSearchPayload): SavedSearchPayloadDTO {
    return {
      title: payload.title,
      query: payload.query,
      frequency: payload.frequency,
    };
  }

  static updatePayloadToDTO(payload: SavedSearchUpdatePayload): SavedSearchUpdatePayloadDTO {
    const dto: SavedSearchUpdatePayloadDTO = {};

    if (payload.title !== undefined) dto.title = payload.title;
    if (payload.query !== undefined) dto.query = payload.query;
    if (payload.frequency !== undefined) dto.frequency = payload.frequency;
    if (payload.isActive !== undefined) dto.is_active = payload.isActive;

    return dto;
  }
}
