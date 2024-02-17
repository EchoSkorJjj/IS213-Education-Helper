import { JwtPayload } from 'jsonwebtoken';

import { AccessClaims, IdentityClaims, RefreshClaims } from './index';

export interface TokenPayload extends JwtPayload {
  userId: string;
  uniqueId: string;
  accessClaims?: AccessClaims;
  identityClaims?: IdentityClaims;
  refreshClaims?: RefreshClaims;
}
