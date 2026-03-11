export interface TokenRefreshResponseDTO {
  access: string;
  refresh?: string;
}

export interface AuthResponseDTO {
  access: string;
  refresh: string;
  profile: ProfileSnapshotDTO;
}

export interface ProfileSnapshotDTO {
  user_id: number;
  display_name?: string;
  avatar_url?: string;
  phone_e164?: string;
  email?: string;
  telegram_id?: number | null;
  telegram_username?: string | null;
}

export interface OtpRequestResponseDTO {
  status: string;
  message?: string;
  debug_code?: string;
}

export interface ForgotPasswordResponseDTO {
  status: string;
  message?: string;
}

export interface ResetPasswordResponseDTO {
  status: string;
}

export interface TelegramAuthDataDTO {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface SecurityInfoDTO {
  has_password: boolean;
  has_telegram: boolean;
  telegram_id?: number | null;
  telegram_username?: string | null;
  email?: string;
  phone_e164?: string;
}

export interface LinkTelegramResponseDTO {
  status: string;
  profile: ProfileSnapshotDTO;
}

export interface UnlinkTelegramResponseDTO {
  status: string;
  profile: ProfileSnapshotDTO;
}

export interface TelegramChatDTO {
  id: number;
  chat_id: number;
  chat_title: string;
  chat_username: string;
  chat_photo: string | null;
  chat_type: string;
  is_active: boolean;
}

export interface VerifyChatsResponseDTO {
  verified: number;
  deactivated: number;
  errors: number;
}

export interface ChangePasswordResponseDTO {
  status: string;
}

export interface SetPasswordResponseDTO {
  status: string;
}
