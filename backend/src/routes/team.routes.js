import express from 'express';
import * as contentController from '../controllers/content.controller.js';
import { validateId, handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Public routes
router.get('/', contentController.getTeam);
router.get('/:id', validateId, contentController.getTeamMember);

// Admin routes
router.post('/', 
  authenticate, 
  authorize(['admin']),
  [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('cargo').trim().notEmpty().withMessage('Cargo é obrigatório'),
    body('bio').optional().trim(),
    body('foto').optional().trim(),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('redes_sociais').optional().isObject().withMessage('Redes sociais deve ser um objeto'),
    handleValidationErrors,
  ],
  contentController.createTeamMember
);

router.put('/:id', 
  authenticate, 
  authorize(['admin']),
  validateId,
  [
    body('nome').optional().trim().notEmpty(),
    body('cargo').optional().trim().notEmpty(),
    body('bio').optional().trim(),
    body('foto').optional().trim(),
    body('email').optional().isEmail(),
    body('redes_sociais').optional().isObject(),
    handleValidationErrors,
  ],
  contentController.updateTeamMember
);

router.delete('/:id', 
  authenticate, 
  authorize(['admin']),
  validateId,
  contentController.deleteTeamMember
);

export default router;
