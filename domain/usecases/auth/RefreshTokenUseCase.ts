import { IAuthRepository } from '../../repositories/IAuthRepository';
import { TokenRefreshResult } from '../../models/AuthToken';

export class RefreshTokenUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(): Promise<TokenRefreshResult | null> {
    return await this.repository.refreshAccessToken();
  }
}
