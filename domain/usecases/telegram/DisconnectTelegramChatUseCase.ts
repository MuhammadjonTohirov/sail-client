import { ITelegramRepository } from '../../repositories/ITelegramRepository';

export class DisconnectTelegramChatUseCase {
    constructor(private repository: ITelegramRepository) { }

    async execute(chatId: string): Promise<void> {
        return await this.repository.disconnectChat(chatId);
    }
}
