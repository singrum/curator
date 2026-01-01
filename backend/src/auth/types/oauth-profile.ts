// src/auth/types/oauth-profile.ts
export interface OAuthProfile {
  provider: string; // google
  providerId: string; // sub
  email?: string;
  nickname: string;
  avatarUrl?: string;
}
