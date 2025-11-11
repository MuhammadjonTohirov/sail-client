/**
 * Repository interface for Profile/User management
 */

import { UserProfile, UpdateProfilePayload } from '../models/UserProfile';

export interface IProfileRepository {
  /**
   * Get current user profile
   */
  getProfile(): Promise<UserProfile>;

  /**
   * Update user profile
   */
  updateProfile(payload: UpdateProfilePayload): Promise<UserProfile>;

  /**
   * Delete user account
   */
  deleteAccount(): Promise<void>;

  /**
   * Update the user's last active timestamp to now.
   */
  markActive(): Promise<Date | null>;
}
