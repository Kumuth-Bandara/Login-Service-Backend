const bcrypt = require('bcryptjs');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

const registerUser = async (name, email, password) => {
    const [existingUsers] = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
    );

    if (existingUsers.length > 0) {
        throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );

    return {
        id: result.insertId,
        name,
        email
    };
};

const loginUser = async (email, password) => {
    const [users] = await db.query(
        'SELECT id, name, email, password FROM users WHERE email = ?',
        [email]
    );

    if (users.length === 0) {
        throw new Error('Invalid email or password');
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        token
    };
};

module.exports = {
    registerUser,
    loginUser
};