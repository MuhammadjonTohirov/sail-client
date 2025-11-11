/**
 * Use case for getting current user profile
 */

import { IProfileRepository } from '@/domain/repositories/IProfileRepository';
import { UserProfile } from '@/domain/models/UserProfile';

export class GetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(): Promise<UserProfile> {
    return await this.profileRepository.getProfile();
  }
}
