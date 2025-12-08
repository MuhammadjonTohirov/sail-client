import { TelegramChat } from '../models/TelegramChat';

export interface ITelegramRepository {
  getTelegramChats(): Promise<TelegramChat[]>;
}
