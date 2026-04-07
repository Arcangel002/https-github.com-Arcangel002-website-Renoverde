import express from 'express';
import * as contentController from '../controllers/content.controller.js';
import { validateEmail, handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/subscribe', validateEmail, contentController.subscribeNewsletter);
router.post('/unsubscribe', validateEmail, contentController.unsubscribeNewsletter);

// Admin routes
router.get('/subscribers', 
  authenticate, 
  authorize(['admin']),
  contentController.getNewsletterSubscribers
);

export default router;
