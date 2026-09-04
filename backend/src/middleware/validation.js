// ============================================================
// BACKEND src/middleware/validation.js
// ============================================================

import { body, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  };
};

export const postValidations = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional().isLength({ max: 500 }),
  body('category').notEmpty().withMessage('Category is required').isMongoId(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'scheduled']),
  body('featured').optional().isBoolean(),
];

export const commentValidations = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required'),
  body('content').notEmpty().withMessage('Comment is required').isLength({ max: 5000 }),
];

export const subscriberValidations = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const projectValidations = [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').notEmpty().withMessage('Description is required').isLength({ max: 300 }),
  body('technologies').optional().isArray(),
];

export const categoryValidations = [
  body('name').notEmpty().withMessage('Category name is required'),
];

export const tagValidations = [
  body('name').notEmpty().withMessage('Tag name is required'),
];

export const loginValidations = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];