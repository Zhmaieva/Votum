const express = require("express");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('./middleware/authMiddleware');
const {SECRET_KEY} = require("./constants");

const app = express();
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: "poll_app",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT || 5432,
});

// Function to generate JWT
function generateToken(username) {
    const expirationTime = '15m'; // Token expires in 1 hour
    return jwt.sign({ username }, SECRET_KEY, { expiresIn: expirationTime });
}

// Function to generate JWT
function generateRefreshToken(username) {
    return jwt.sign({ username }, SECRET_KEY);
}

app.post("/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Перевіряємо, чи вже існує користувач з таким ім'ям або email
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1 OR email = $2",
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Username or email already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        const query = "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)";
        await pool.query(query, [userId, username, email, passwordHash]);

        res.status(201).json({ message: "User registered successfully", user_id: userId });
    }
    catch (e) {
        next(e);
    }
});

// Login endpoint
app.post('/login', async (req, res, next) => {
    try {
        const { login, password } = req.body;

        // Check if username and password are provided
        if (!login || !password) {
            console.log(req.body);
            return res.status(400).json({ message: 'Login and password are required' });
        }

        // Перевіряємо, чи вже існує користувач з таким ім'ям або email
        const existingUsers = await pool.query(
            "SELECT password_hash as password FROM users WHERE username = $1 OR email = $1",
            [login]
        );

        if (existingUsers.rows.length == 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!await bcrypt.compare(password, existingUsers.rows[0].password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If credentials are correct, generate JWT token
        const token = generateToken(login);
        const refreshToken = generateRefreshToken(login);
        return res.json({ message: 'Login successful', token, refreshToken });
    }
    catch (e) {
        next(e);
    }
});

app.get('/profile', authMiddleware, async (req, res) => {
    try {
        const existingUsers = await pool.query(
            "SELECT username, email FROM users WHERE username = $1 OR email = $1",
            [req.user.username]
        );

        const user = existingUsers.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Catch-all handler for undefined routes
app.use(async (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler (Catches all unhandled exceptions)
app.use(async (err, req, res, next) => {
    console.error(err.stack);  // Log the error stack for debugging (optional)
    res.status(500).json({ message: 'Something went wrong, please try again later.' });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});