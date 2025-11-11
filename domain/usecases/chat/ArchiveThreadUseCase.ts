import { IChatRepository } from '../../repositories/IChatRepository';
import { ChatThread } from '../../models/chat/ChatThread';

export class ArchiveThreadUseCase {
  constructor(private readonly repository: IChatRepository) {}

  async execute(threadId: string): Promise<ChatThread> {
    if (!threadId || threadId.trim().length === 0) {
      throw new Error('Thread ID is required');
    }

    return await this.repository.archiveThread(threadId);
  }
}
