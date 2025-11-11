/**
 * Use case for deleting user account
 */

import { IProfileRepository } from '@/domain/repositories/IProfileRepository';

export class DeleteAccountUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(): Promise<void> {
    return await this.profileRepository.deleteAccount();
  }
}
