import express from 'express';
import * as contentController from '../controllers/content.controller.js';
import { validateId, validateFAQ, handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', contentController.getFAQs);

// Admin routes
router.post('/', 
  authenticate, 
  authorize(['admin']),
  validateFAQ,
  contentController.createFAQ
);

router.put('/:id', 
  authenticate, 
  authorize(['admin']),
  validateId,
  validateFAQ,
  contentController.updateFAQ
);

router.delete('/:id', 
  authenticate, 
  authorize(['admin']),
  validateId,
  contentController.deleteFAQ
);

export default router;
