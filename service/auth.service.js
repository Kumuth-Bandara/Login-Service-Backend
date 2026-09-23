const bcrypt = require('bcryptjs');
const db = require('../config/database');

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

module.exports = {
    registerUser
};