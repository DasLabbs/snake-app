export type User = {
  id: string;
  userEmail: string;
};

export type UserLoginPayload = {
  userEmail: string;
};

export type UserLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type UserProfilePayload = {
  id: string;
  userEmail: string;
  socialLinks: Social[];
  adsWatch: number;
  lifePoints: number;
  lastRegen: number;
};

export enum Social {
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
}

export type SocialLifePointPayload = {
  social: Social;
};

export type IncreaseLifePoint = {
  userId: string;
  currentLifePoint: number;
};
