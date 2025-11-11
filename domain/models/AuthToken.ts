export interface AuthToken {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn?: number;
}

export interface TokenRefreshResult {
  readonly accessToken: string;
  readonly success: boolean;
}
