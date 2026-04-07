import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateLogin, validateRegister } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
