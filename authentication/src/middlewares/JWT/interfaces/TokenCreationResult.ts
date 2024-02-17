import { CookieOptions } from 'express';

export type TokenCreationResult = {
  token: string;
  cookieOptions: CookieOptions;
  uniqueId: string;
};
