import express from 'express';
import * as blogController from '../controllers/blog.controller.js';
import { validateBlogPost, validateId, handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// ─── POSTS ───
router.get('/posts', blogController.getPosts);
router.get('/posts/:slug', blogController.getPostBySlug);

router.post('/posts', 
  authenticate, 
  authorize(['admin']), 
  validateBlogPost, 
  blogController.createPost
);

router.put('/posts/:id', 
  authenticate, 
  authorize(['admin']), 
  validateId,
  validateBlogPost, 
  blogController.updatePost
);

router.delete('/posts/:id', 
  authenticate, 
  authorize(['admin']), 
  validateId,
  blogController.deletePost
);

// ─── CATEGORIES ───
router.get('/categorias', blogController.getCategories);

router.post('/categorias', 
  authenticate, 
  authorize(['admin']), 
  [
    body('nome').trim().notEmpty().withMessage('Nome da categoria é obrigatório'),
    handleValidationErrors,
  ],
  blogController.createCategory
);

// ─── COMMENTS ───
router.get('/posts/:postId/comentarios', blogController.getPostComments);

router.post('/posts/:postId/comentarios', 
  [
    body('autor').trim().notEmpty().withMessage('Autor é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('conteudo')
      .trim()
      .notEmpty().withMessage('Comentário é obrigatório')
      .isLength({ min: 5 }).withMessage('Comentário deve ter pelo menos 5 caracteres'),
    handleValidationErrors,
  ],
  blogController.createComment
);

router.patch('/comentarios/:commentId/aprovar', 
  authenticate, 
  authorize(['admin']), 
  blogController.approveComment
);

router.delete('/comentarios/:commentId', 
  authenticate, 
  authorize(['admin']), 
  blogController.deleteComment
);

export default router;
