import { IChatRepository } from '../../repositories/IChatRepository';
import { ChatAttachment } from '../../models/chat/ChatMessage';

export class UploadAttachmentUseCase {
  constructor(private readonly repository: IChatRepository) {}

  async execute(threadId: string, file: File): Promise<ChatAttachment> {
    if (!threadId || threadId.trim().length === 0) {
      throw new Error('Thread ID is required');
    }
    if (!file) {
      throw new Error('File is required');
    }

    return await this.repository.uploadAttachment(threadId, file);
  }
}
