import { CookieOptions } from 'express';

import { User } from '../entity';

export type TokenData = {
  accessToken: string;
  accessCookieOptions: CookieOptions;
  refreshToken: string;
  refreshCookieOptions: CookieOptions;
  identityToken: string;
  identityCookieOptions: CookieOptions;
  user: User;
  userRoleParam: {
    name: string;
    roles: string[];
  };
};
