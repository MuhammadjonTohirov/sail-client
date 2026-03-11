import { IAuthRepository } from '../../repositories/IAuthRepository';
import { AuthResult, TelegramAuthData } from '../../models/AuthToken';

export class TelegramAuthUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(data: TelegramAuthData): Promise<AuthResult> {
    if (!data.id || !data.hash) throw new Error('Invalid Telegram auth data');
    return this.repository.telegramAuth(data);
  }
}
