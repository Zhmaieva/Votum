const express = require("express");
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('./middleware/authMiddleware');
const {SECRET_KEY} = require("./constants");
const {pool} = require("./dal/pool");
const fetchPolls = require("./dal/pollQueries");

const app = express();
app.use(express.json());

// Function to generate JWT
function generateToken(username) {
    //const expirationTime = '15m'; // Token expires in 1 hour
    //return jwt.sign({ username }, SECRET_KEY, { expiresIn: expirationTime });
    return jwt.sign({ username }, SECRET_KEY);//let's make it non-expirale for convenience
    //always restart to apply changes
    //that's new
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

        const queryString = "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)";
        await pool.query(queryString, [userId, username, email, passwordHash]);

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
            `SELECT
                 u.username AS "userName",
                 u.email,
                 up.image,
                 up.followers_number AS "followersNumber",
                 up.bio
             FROM users u
                      JOIN user_profiles up ON u.id = up.user_id
             WHERE u.username = $1 OR u.email = $1`,
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


//let's create an endpoint to get polls
//auth is needed bc it's regular api request for authorised users only
app.get('/polls', authMiddleware, async (
    req, res) => {
    //we'll write our logic here
    //this is the bare minimum to create an endpoint

    //let's write a query to get all polls and their options
    //first let's see what client expect us to send
    //let's imagine the final output the endpoint will produce

    //we've moved pool to a separate file to share it accross the application
    //bc it's a bad practice to have dependency loops, like server imports pollQueries.js and vice versa
    //so now pool.js does not import anything and is only imported by other files -> no loops

    // const result =     {
    //         id: 1,
    //         question: "What is your favorite color?",
    //         options: ["Red", "Blue", "Green", "Yellow"],
    //         results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
    //         timeLeft: "10m 30s",
    //         totalVotes: 1457,
    //         user: {
    //             userName: "Emil",
    //             image: "123",//does not matter
    //             followersNumber: 1
    //         }
    //     };
    //okay so let's go and create SQL or ask chat
    // i'm giving chat the structure to follow, values are irrelevnt
    // we don't have result so far, so I'll ask to hardocde
    //to organise code, we'll move most of the logic of the endpoint to
    // a service and going forward let's try to follow this approach

    // instead of username and image diretly at the top level of the response object,
    // we will put it into a nested object exactly the same as in /profile, to put in awesome header


    //let's try our new DAL function
    const result = await fetchPolls();
    //we await, because fetchPolls return Promise
    //we'll talk later about this
    //bad thing we don't have a lot of server logging, but let's debug again

    res.json(result);
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