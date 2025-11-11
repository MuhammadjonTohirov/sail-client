import { IChatRepository } from '../../repositories/IChatRepository';
import { ChatThread, ThreadQueryParams } from '../../models/chat/ChatThread';

export class ListThreadsUseCase {
  constructor(private readonly repository: IChatRepository) {}

  async execute(params?: ThreadQueryParams): Promise<ChatThread[]> {
    return await this.repository.listThreads(params);
  }
}
