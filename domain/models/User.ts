export interface User {
  readonly id: number;
  readonly userId: number;
  readonly displayName?: string;
  readonly avatarUrl?: string;
  readonly logo?: string;
  readonly banner?: string;
  readonly phoneE164?: string;
  readonly locationId?: number;
  readonly locationName?: string;
  readonly since?: string;
  readonly lastActiveAt?: string;
}
