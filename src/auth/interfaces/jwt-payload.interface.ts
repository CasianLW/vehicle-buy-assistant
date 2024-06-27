export interface JwtPayload {
  username: string;
  userId: string;
  roles: string[];
  email: string;
  isBanned: boolean;
  isPremium: boolean;
}
