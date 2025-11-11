import { IChatRepository } from '../../repositories/IChatRepository';
import { ChatMessage } from '../../models/chat/ChatMessage';
import { SendMessagePayload } from '../../models/chat/ChatPayloads';

export class SendMessageUseCase {
  constructor(private readonly repository: IChatRepository) {}

  async execute(threadId: string, payload: SendMessagePayload): Promise<ChatMessage> {
    if (!threadId || threadId.trim().length === 0) {
      throw new Error('Thread ID is required');
    }
    if (!payload.body && (!payload.attachments || payload.attachments.length === 0)) {
      throw new Error('Message body or attachments are required');
    }

    return await this.repository.sendMessage(threadId, payload);
  }
}
