const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Login Backend is running'
    });
});

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 AS result');

        res.json({
            success: true,
            message: 'MySQL connection successful',
            data: rows
        });
    } catch (error) {
        console.error('Database connection error:', error);

        res.status(500).json({
            success: false,
            message: 'MySQL connection failed'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});