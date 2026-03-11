import { ITelegramRepository, VerifyChatsResult } from '@/domain/repositories/ITelegramRepository';
import { TelegramChat } from '@/domain/models/TelegramChat';
import { Auth } from '@/lib/authApi';
import { AuthMapper } from '../mappers/AuthMapper';

export class TelegramRepositoryImpl implements ITelegramRepository {
  async getTelegramChats(): Promise<TelegramChat[]> {
    const dtos = await Auth.getTelegramChats();
    return AuthMapper.telegramChatsToDomain(dtos);
  }

  async disconnectChat(chatId: string): Promise<void> {
    await Auth.disconnectTelegramChat(chatId);
  }

  async verifyChats(): Promise<VerifyChatsResult> {
    const dto = await Auth.verifyTelegramChats();
    return AuthMapper.verifyChatsResponseToDomain(dto);
  }
}
