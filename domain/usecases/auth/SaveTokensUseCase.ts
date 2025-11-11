import { IAuthRepository } from '../../repositories/IAuthRepository';
import { AuthToken } from '../../models/AuthToken';

export class SaveTokensUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  execute(tokens: AuthToken): void {
    if (!tokens.accessToken || tokens.accessToken.trim().length === 0) {
      throw new Error('Access token is required');
    }
    if (!tokens.refreshToken || tokens.refreshToken.trim().length === 0) {
      throw new Error('Refresh token is required');
    }

    this.repository.saveTokens(tokens);
  }
}
