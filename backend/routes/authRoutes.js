const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, me } = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Validators
const registerValidator = [
  body('name').isString().isLength({ min: 2 }).withMessage('Name min length 2'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min length 8')
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isString().withMessage('Password required')
];

// Routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', auth, logout);
router.get('/me', auth, me);

module.exports = router;
