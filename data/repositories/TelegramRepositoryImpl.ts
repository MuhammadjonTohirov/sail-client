import { ITelegramRepository } from '@/domain/repositories/ITelegramRepository';
import { TelegramChat } from '@/domain/models/TelegramChat';
import { Auth } from '@/lib/authApi';

export class TelegramRepositoryImpl implements ITelegramRepository {
  async getTelegramChats(): Promise<TelegramChat[]> {
    const data = await Auth.getTelegramChats();
    return data.map((item: any) => ({
      id: item.id,
      chatId: item.chat_id,
      chatTitle: item.chat_title,
      chatUsername: item.chat_username,
      chatPhoto: item.chat_photo,
      chatType: item.chat_type,
      isActive: item.is_active,
    }));
  }
}
