export type AccessToken = string;

export type RefreshToken = string;

export interface Tokens {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
}
