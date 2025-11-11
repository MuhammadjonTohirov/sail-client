/**
 * Mapper to convert between ProfileDTO and UserProfile domain model
 */

import { UserProfile, UpdateProfilePayload } from '@/domain/models/UserProfile';
import { ProfileDTO, UpdateProfileRequestDTO } from '../models/ProfileDTO';

export class ProfileMapper {
  static toDomain(dto: ProfileDTO): UserProfile {
    return {
      userId: dto.user_id,
      username: dto.username,
      phoneE164: dto.phone_e164,
      displayName: dto.display_name || '',
      avatarUrl: dto.avatar_url,
      about: dto.about,
      locationId: dto.location_id,
      locationName: dto.location_name,
      logoUrl: dto.logo,
      bannerUrl: dto.banner,
      lastActiveAt: dto.last_active_at ? new Date(dto.last_active_at) : null,
      createdAt: new Date(dto.created_at),
    };
  }

  static toUpdateRequest(payload: UpdateProfilePayload): UpdateProfileRequestDTO {
    return {
      display_name: payload.displayName,
      location: payload.location,
      logo: payload.logo,
      banner: payload.banner,
    };
  }
}
