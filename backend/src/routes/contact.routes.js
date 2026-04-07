import express from 'express';
import * as contactController from '../controllers/contact.controller.js';
import { validateContact, validateId } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', validateContact, contactController.createContact);

// Admin routes
router.get('/', authenticate, authorize(['admin']), contactController.getContacts);
router.get('/:id', authenticate, authorize(['admin']), validateId, contactController.getContactById);
router.patch('/:id', authenticate, authorize(['admin']), validateId, contactController.updateContactStatus);
router.delete('/:id', authenticate, authorize(['admin']), validateId, contactController.deleteContact);

export default router;
