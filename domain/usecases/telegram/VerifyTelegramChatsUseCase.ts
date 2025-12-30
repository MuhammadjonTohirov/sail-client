import { ITelegramRepository, VerifyChatsResult } from '../../repositories/ITelegramRepository';

export class VerifyTelegramChatsUseCase {
  constructor(private repository: ITelegramRepository) {}

  async execute(): Promise<VerifyChatsResult> {
    return await this.repository.verifyChats();
  }
}
