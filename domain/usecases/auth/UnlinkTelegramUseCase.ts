import { IAuthRepository } from '../../repositories/IAuthRepository';

export class UnlinkTelegramUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(): Promise<void> {
    return this.repository.unlinkTelegram();
  }
}
