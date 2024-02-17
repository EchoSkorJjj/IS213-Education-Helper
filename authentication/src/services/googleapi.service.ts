import axios from 'axios';

import logger from '../logging/logger';
import { GoogleUserInfo } from '../types';

export class GoogleAPIService {
  async getUserData(accessToken: string) {
    try {
      const response = await axios.get<GoogleUserInfo>(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const userData: GoogleUserInfo = response.data;

      return userData;
    } catch (error) {
      logger.error('Error: Response data does not match UserInfo type', error);
      throw error;
    }
  }
}
