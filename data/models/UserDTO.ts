export interface UserDTO {
  id: number;
  user_id: number;
  display_name?: string;
  avatar_url?: string;
  logo?: string;
  banner?: string;
  phone_e164?: string;
  location_id?: number;
  location_name?: string;
  since?: string;
  last_active_at?: string;
}
