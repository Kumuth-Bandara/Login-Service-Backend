const express = require('express');
const { body } = require('express-validator');
const { register } = require('../controller/auth.controller');

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

module.exports = router;