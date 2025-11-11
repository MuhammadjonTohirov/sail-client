import { TokenRefreshResponseDTO } from '../models/AuthDTO';
import { TokenRefreshResult } from '../../domain/models/AuthToken';

export class AuthMapper {
  static refreshResponseToDomain(dto: TokenRefreshResponseDTO): TokenRefreshResult {
    return {
      accessToken: dto.access,
      success: true,
    };
  }
}
