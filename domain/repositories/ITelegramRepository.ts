import { TelegramChat } from '../models/TelegramChat';

export interface VerifyChatsResult {
  verified: number;
  deactivated: number;
  errors: number;
}

export interface ITelegramRepository {
  getTelegramChats(): Promise<TelegramChat[]>;
  disconnectChat(chatId: string): Promise<void>;
  verifyChats(): Promise<VerifyChatsResult>;
}
