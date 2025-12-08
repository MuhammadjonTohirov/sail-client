export interface TelegramChat {
  id: number;
  chatId: number;
  chatTitle: string;
  chatUsername: string;
  chatPhoto: string | null;
  chatType: string;
  isActive: boolean;
}
