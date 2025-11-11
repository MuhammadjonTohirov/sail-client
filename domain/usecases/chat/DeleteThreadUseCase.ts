import { IChatRepository } from '../../repositories/IChatRepository';

export class DeleteThreadUseCase {
  constructor(private readonly repository: IChatRepository) {}

  async execute(threadId: string): Promise<void> {
    if (!threadId || threadId.trim().length === 0) {
      throw new Error('Thread ID is required');
    }

    await this.repository.deleteThread(threadId);
  }
}
