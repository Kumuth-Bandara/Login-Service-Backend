const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controller/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post(
    '/register',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ max: 100 })
            .withMessage('Name must be 100 characters or less'),

        body('email')
            .trim()
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
    ],
    register
);

router.post(
    '/login',
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    login
);

router.get('/me', authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Authenticated user',
        data: req.user
    });
});

module.exports = router;
