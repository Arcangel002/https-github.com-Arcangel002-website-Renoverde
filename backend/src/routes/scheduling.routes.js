import express from 'express';
import * as schedulingController from '../controllers/scheduling.controller.js';
import { validateScheduling, validateId } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', validateScheduling, schedulingController.createScheduling);

// Admin routes - view and manage scheduling requests
router.get('/', authenticate, authorize(['admin']), schedulingController.getAllScheduling);
router.get('/:id', authenticate, authorize(['admin']), validateId, schedulingController.getSchedulingById);
router.patch('/:id/status', authenticate, authorize(['admin']), validateId, schedulingController.updateSchedulingStatus);
router.delete('/:id', authenticate, authorize(['admin']), validateId, schedulingController.deleteScheduling);

export default router;
