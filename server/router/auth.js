import express, { json } from 'express';
import {} from 'express-async-errors';
import { body } from 'express-validator';
import { validate } from '../middleware/validator';

const router = express.Router();

// 사용자의 이름과 패스워드에 대한 유효성 검사
const validateCredential = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('username should be at least 5 characters'),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('password should be at least 5 characters'),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body('name').notEmpty().withMessage('name is missing'),
  body('email').isEmail().normalizeEmail().withMessage('invalid email'),
  body('url')
    .isURL()
    .withMessage('invalid URL')
    .optional({ nullable: true, checkFalsy: true }), // null 이거나 비어있어도 괜찮
  validate,
];

// 컨트롤러에 있는 signup을 연결
router.post('/signup', validateSignup, authController.signup);

router.post('/login', validateCredential, authController.signup);
