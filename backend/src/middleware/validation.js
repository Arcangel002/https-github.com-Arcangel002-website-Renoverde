import { body, validationResult, param } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
      statusCode: 422,
    });
  }
  next();
};

// Contact validation
export const validateContact = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido'),
  
  body('telefone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Telefone inválido'),
  
  body('assunto')
    .trim()
    .notEmpty().withMessage('Assunto é obrigatório')
    .isLength({ min: 5 }).withMessage('Assunto deve ter pelo menos 5 caracteres'),
  
  body('mensagem')
    .trim()
    .notEmpty().withMessage('Mensagem é obrigatória')
    .isLength({ min: 10 }).withMessage('Mensagem deve ter pelo menos 10 caracteres'),
  
  handleValidationErrors,
];

// Email validation
export const validateEmail = [
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido'),
  handleValidationErrors,
];

// Blog post validation
export const validateBlogPost = [
  body('titulo')
    .trim()
    .notEmpty().withMessage('Título é obrigatório')
    .isLength({ min: 5, max: 255 }).withMessage('Título deve ter entre 5 e 255 caracteres'),
  
  body('conteudo')
    .trim()
    .notEmpty().withMessage('Conteúdo é obrigatório')
    .isLength({ min: 50 }).withMessage('Conteúdo deve ter pelo menos 50 caracteres'),
  
  body('categoria_id')
    .isInt().withMessage('Categoria inválida'),
  
  body('publicado')
    .optional()
    .isBoolean().withMessage('Publicado deve ser booleano'),
  
  handleValidationErrors,
];

// FAQ validation
export const validateFAQ = [
  body('pergunta')
    .trim()
    .notEmpty().withMessage('Pergunta é obrigatória')
    .isLength({ min: 5 }).withMessage('Pergunta deve ter pelo menos 5 caracteres'),
  
  body('resposta')
    .trim()
    .notEmpty().withMessage('Resposta é obrigatória')
    .isLength({ min: 10 }).withMessage('Resposta deve ter pelo menos 10 caracteres'),
  
  body('categoria')
    .optional()
    .trim(),
  
  handleValidationErrors,
];

// Register validation
export const validateRegister = [
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido'),
  
  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  
  handleValidationErrors,
];

// Login validation
export const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido'),
  
  body('password')
    .notEmpty().withMessage('Senha é obrigatória'),
  
  handleValidationErrors,
];

// ID validation
export const validateId = [
  param('id')
    .isInt().withMessage('ID deve ser um número válido'),
  handleValidationErrors,
];
