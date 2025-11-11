import { IChatRepository } from '../../repositories/IChatRepository';
import { ChatThread } from '../../models/chat/ChatThread';

export class MarkReadUseCase {
  constructor(private readonly repository: IChatRepository) {}

  async execute(threadId: string, messageId?: string): Promise<ChatThread> {
    if (!threadId || threadId.trim().length === 0) {
      throw new Error('Thread ID is required');
    }

    return await this.repository.markRead(threadId, messageId);
  }
}
