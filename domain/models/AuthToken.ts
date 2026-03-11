export interface AuthToken {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn?: number;
}

export interface TokenRefreshResult {
  readonly accessToken: string;
  readonly success: boolean;
}

export interface ProfileSnapshot {
  readonly userId: number;
  readonly displayName?: string;
  readonly avatarUrl?: string;
  readonly phoneE164?: string;
  readonly email?: string;
  readonly telegramId?: number | null;
  readonly telegramUsername?: string | null;
}

export interface AuthResult {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly profile: ProfileSnapshot;
}

export interface SecurityInfo {
  readonly hasPassword: boolean;
  readonly hasTelegram: boolean;
  readonly telegramId?: number | null;
  readonly telegramUsername?: string | null;
  readonly email?: string;
  readonly phoneE164?: string;
}

export interface OtpRequestResult {
  readonly status: string;
  readonly debugCode?: string;
}

export interface TelegramAuthData {
  readonly id: number;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly username?: string;
  readonly photoUrl?: string;
  readonly authDate: number;
  readonly hash: string;
}
