import * as express from 'express';

import { authController } from '../controllers/auth.controller';

const router = express.Router();

router.post('/google/callback', authController.handleGoogleCallback);

router.post('/refresh', authController.handleRefreshToken);

router.post('/logout', authController.handleLogout);

export default router;
