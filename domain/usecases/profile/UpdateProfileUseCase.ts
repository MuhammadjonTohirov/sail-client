/**
 * Use case for updating user profile
 */

import { IProfileRepository } from '@/domain/repositories/IProfileRepository';
import { UserProfile, UpdateProfilePayload } from '@/domain/models/UserProfile';

export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(payload: UpdateProfilePayload): Promise<UserProfile> {
    return await this.profileRepository.updateProfile(payload);
  }
}
