import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Format poștă greșit').isEmail(),
  body('password', 'Lungimea parolei trebuie să fie de minim 5 simboluri').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Format poștă greșit').isEmail(),
  body('password', 'Lungimea parolei trebuie să fie de minim 5 simboluri').isLength({ min: 5 }),
  body('fullName', 'Introduceți numele').isLength({ min: 3 }),
  body('avatarUrl', 'Link avatar greșit').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Introduceți titlul postării').isLength({ min: 3 }).isString(),
  body('text', 'Introduceți conținutul postării').isLength({ min: 10 }).isString(),
  body('tags', 'Format tag-uri incorect').optional().isString(),
  body('imageUrl', 'Link imagine greșit').optional().isString(),
];

export const commentCreateValidation = [
  body('text', 'Introduceți textul comentariului').isLength({ min: 3 }).isString(),
];
