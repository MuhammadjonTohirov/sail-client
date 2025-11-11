import { User } from '@/domain/models/User';
import { UserDTO } from '../models/UserDTO';

export class UserMapper {
  static toDomain(dto: UserDTO): User {
    return {
      id: dto.id,
      userId: dto.user_id,
      displayName: dto.display_name,
      avatarUrl: dto.avatar_url,
      logo: dto.logo,
      banner: dto.banner,
      phoneE164: dto.phone_e164,
      locationId: dto.location_id,
      locationName: dto.location_name,
      since: dto.since,
      lastActiveAt: dto.last_active_at,
    };
  }

  static toDomainList(dtos: UserDTO[]): User[] {
    return dtos.map(dto => UserMapper.toDomain(dto));
  }
}
