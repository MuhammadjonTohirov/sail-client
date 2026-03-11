import { IAuthRepository } from '../../repositories/IAuthRepository';
import { TelegramAuthData } from '../../models/AuthToken';

export class LinkTelegramUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(data: TelegramAuthData): Promise<void> {
    if (!data.id || !data.hash) throw new Error('Invalid Telegram auth data');
    return this.repository.linkTelegram(data);
  }
}
