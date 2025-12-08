import { ITelegramRepository } from '../../repositories/ITelegramRepository';
import { TelegramChat } from '../../models/TelegramChat';

export class GetTelegramChatsUseCase {
  constructor(private repository: ITelegramRepository) {}

  async execute(): Promise<TelegramChat[]> {
    return await this.repository.getTelegramChats();
  }
}
