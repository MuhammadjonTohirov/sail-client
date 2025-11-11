import { IChatRepository } from '../../repositories/IChatRepository';
import { ChatMessagePage, MessageQueryParams } from '../../models/chat/ChatMessage';

export class ListMessagesUseCase {
  constructor(private readonly repository: IChatRepository) {}

  async execute(threadId: string, params?: MessageQueryParams): Promise<ChatMessagePage> {
    if (!threadId || threadId.trim().length === 0) {
      throw new Error('Thread ID is required');
    }

    return await this.repository.listMessages(threadId, params);
  }
}
