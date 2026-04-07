import express from 'express';
import * as contentController from '../controllers/content.controller.js';
import { validateId, handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// ═══════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════

router.get('/', contentController.getServices);
router.get('/:id', validateId, contentController.getServiceById);

router.post('/', 
  authenticate, 
  authorize(['admin']),
  [
    body('titulo').trim().notEmpty().withMessage('Título é obrigatório'),
    body('descricao').trim(),
    body('imagem').optional().trim(),
    body('preco').optional().isDecimal().withMessage('Preço inválido'),
    body('ordem_exibicao').optional().isInt().withMessage('Ordem deve ser um número'),
    handleValidationErrors,
  ],
  contentController.createService
);

router.put('/:id', 
  authenticate, 
  authorize(['admin']),
  validateId,
  [
    body('titulo').optional().trim().notEmpty(),
    body('descricao').optional().trim(),
    body('imagem').optional().trim(),
    body('preco').optional().isDecimal(),
    body('ordem_exibicao').optional().isInt(),
    body('ativo').optional().isBoolean(),
    handleValidationErrors,
  ],
  contentController.updateService
);

router.delete('/:id', 
  authenticate, 
  authorize(['admin']),
  validateId,
  contentController.deleteService
);

export default router;
