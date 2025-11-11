import { IProfileRepository } from '@/domain/repositories/IProfileRepository';

export class UpdateLastActiveUseCase {
  constructor(private readonly repository: IProfileRepository) {}

  async execute(): Promise<Date | null> {
    return await this.repository.markActive();
  }
}
