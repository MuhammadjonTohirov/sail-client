/**
 * Data Transfer Objects for Profile API responses
 */

export interface ProfileDTO {
  user_id: number;
  username: string;
  phone_e164: string;
  display_name: string;
  avatar_url?: string;
  about?: string;
  location_id?: number | null;
  location_name?: string | null;
  logo?: string | null;
  banner?: string | null;
  last_active_at?: string | null;
  created_at: string;
}

export interface UpdateProfileRequestDTO {
  display_name?: string;
  location?: number | null;
  logo?: File;
  banner?: File;
}

export interface DeleteAccountResponseDTO {
  status: string;
  user_id: number;
  message: string;
}
