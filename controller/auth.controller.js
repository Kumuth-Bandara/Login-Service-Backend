const { validationResult } = require('express-validator');
const { registerUser, loginUser, getUserById } = require('../service/auth.service');

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

const login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: user
        });
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        console.error('Login error:', error);

        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await getUserById(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Authenticated user',
            data: user
        });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error('Get user error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get user'
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};