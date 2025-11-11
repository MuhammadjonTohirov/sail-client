import { IChatRepository } from '../../repositories/IChatRepository';
import { ChatThread } from '../../models/chat/ChatThread';
import { CreateThreadPayload } from '../../models/chat/ChatPayloads';

export class CreateThreadUseCase {
  constructor(private readonly repository: IChatRepository) {}

  async execute(payload: CreateThreadPayload): Promise<ChatThread> {
    if (!payload.listingId || payload.listingId <= 0) {
      throw new Error('Valid listing ID is required');
    }
    if (!payload.message && (!payload.attachments || payload.attachments.length === 0)) {
      throw new Error('Message or attachments are required');
    }

    return await this.repository.createThread(payload);
  }
}
