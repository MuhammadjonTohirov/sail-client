export interface UserProfile {
  readonly userId: number;
  readonly username: string;
  readonly phoneE164: string;
  readonly email: string;
  readonly displayName: string;
  readonly avatarUrl?: string;
  readonly about?: string;
  readonly locationId?: number | null;
  readonly locationName?: string | null;
  readonly logoUrl?: string | null;
  readonly bannerUrl?: string | null;
  readonly telegramId?: number | null;
  readonly telegramUsername?: string | null;
  readonly telegramPhotoUrl?: string | null;
  readonly lastActiveAt?: Date | null;
  readonly createdAt: Date;
}

export interface UpdateProfilePayload {
  readonly displayName?: string;
  readonly location?: number | null;
  readonly logo?: File;
  readonly banner?: File;
}
