const { validationResult } = require('express-validator');
const { registerUser } = require('../service/auth.service');

const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { name, email, password } = req.body;

        const user = await registerUser(name, email, password);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });
    } catch (error) {
        if (error.message === 'Email already registered') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        console.error('Registration error:', error);

        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};

module.exports = {
    register
};