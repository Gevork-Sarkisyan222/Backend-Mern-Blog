import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'не валидное почта').isEmail(),
  body('password', 'не валидный пароль').isLength({ min: 6 }),
];

export const registerValidation = [
  body('email', 'не валидное почта').isEmail(),
  body('name', 'не валидное имя').isLength({ min: 6 }),
  body('surname', 'не валидное фамилия').isLength({ min: 6 }),
  body('password', 'не валидный пароль').isLength({ min: 6 }),
  body('avatarUrl', 'выберите валидную аватарку').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
  body('tages', 'Неверный формат тегов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изоброжение').optional().isString(),
];
