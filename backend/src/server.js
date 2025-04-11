const express = require("express");
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('./middleware/authMiddleware');
const signupAuthMiddleware = require('./middleware/signupAuthMiddleware');
const {SECRET_KEY} = require("./constants");
const {pool} = require("./db/dal/pool");
const pollQueries = require("./db/dal/pollQueries");
const userQueries = require("./db/dal/userQueries");
const {getActivationCode, checkActivationCode, checkAndInsertUserWithProfile, getUserByLogin, updateProfileImage,
    refreshUserFollows, refreshUserFollowers
} = require("./db/dal/userQueries");
const sendEmail = require("./mail/mailing");
const {validateEmail, validateUsername, validatePassword} = require("./validation");
const {uploadMiddleware} = require("./middleware/fileUploadMiddleware");
const {updateUserImage} = require("./services/userService");

const app = express();
app.use(express.json());

function generateToken({id, username}) {
    return jwt.sign({ id, username }, SECRET_KEY);//let's make it non-expirale for convenience
}

function generateSignUpToken({email}) {
    return jwt.sign({ email }, SECRET_KEY);//let's make it non-expirale for convenience
}

app.post("/users/register", async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!await validateEmail(email)) {
            return res.status(400).send("invalid email");
        }

        const { code, canSend } = await getActivationCode(email);

        if (parseInt(code) === -1) {
            return res.status(409).json({ error: "user registered" });
        }

        if (code) {
            if (canSend) {
                sendEmail(email, 'Poll App email verification', 'Welcome to Poll App, please enter this code in Poll App to continue registration: ' + code + ' This code is valid for 15 minutes.');
            }

            return res.json({});
        }
        else
            throw "invalid code";
    } catch (e) {
        next(e);
    }
});

app.post("/user/register/verify", async (req, res, next) => {
    try {
        const { email, code } = req.body;

        const result = await checkActivationCode(email, code);
        switch (result) {
            default:
            case 0:
                return res.status(404).json({ error: "invalid code" });
            case 1:
                return res.json({ message: "email confirmed", token: (await generateSignUpToken({email})) });
            case 2:
                return res.status(410).json({ error: "code expired" });
            case -1:
                return res.status(403).json({ error: "too many attempts - request another code" });
        }
    } catch (e) {
        next(e);
    }
});

// Check username availability endpoint
app.get('/users', signupAuthMiddleware, async (req, res, next) => {
    try {
        const { username } = req.query;

        // Check if username is valid
        if (!username || username.length > 32 || username.length === 0) {
            return res.status(400).json({message: "invalid username"});
        }

        const existingUser = await getUserByLogin(username);

        if (existingUser) {
            return  res.status(409).json({message: "user already exists"});
        }

        return res.json({ message: 'username available' });
    }
    catch (e) {
        next(e);
    }
});

// Check registered username availability endpoint
app.get('/users/registered', authMiddleware, async (req, res, next) => {
    try {
        const { username } = req.query;

        // Check if username is valid
        if (!username || username.length > 32 || username.length === 0) {
            return res.status(400).json({message: "invalid username"});
        }

        const existingUser = await getUserByLogin(username, req.user.id);

        if (existingUser) {
            return  res.status(409).json({message: "user already exists"});
        }

        return res.json({ message: 'username available' });
    }
    catch (e) {
        next(e);
    }
});

app.post("/profile/register", signupAuthMiddleware,async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!validateUsername(username)) {
            return res.status(400).send("invalid username");
        }

        if (!validatePassword(password)) {
            return res.status(400).send("invalid password");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const { code, user_id } = await checkAndInsertUserWithProfile(username, req.user.email, passwordHash);

        if (code === -1 || !user_id) {
            return res.status(409).json({ error: "Username or email already exists" });
        }

        const token = generateToken({id: user_id, username: username.toLowerCase()});
        res.status(201).json({ message: "User registered successfully", userId: user_id, token: token});
    } catch (e) {
        next(e);
    }
});

// Login endpoint
app.post('/users/sign-in', async (req, res, next) => {
    try {
        const { login, password } = req.body;

        const errorCode = 401;
        const errorMessage = { message: 'Invalid credentials' };

        // Check if username and password are valid
        if (!login || !password || password.length > 32 || login.length > 32) {
            console.log(req.body);
            return res.status(errorCode).json(errorMessage);
        }

        const existingUser = await getUserByLogin(login);

        if (!existingUser) {
            return res.status(errorCode).json(errorMessage);
        }

        if (!await bcrypt.compare(password, existingUser.password)) {
            return res.status(errorCode).json(errorMessage);
        }

        // If credentials are correct, generate JWT token
        const token = generateToken({id: existingUser.id, username: login});
        return res.json({ message: 'Login successful', token });
    }
    catch (e) {
        next(e);
    }
});

app.get('/profile/:id?', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await userQueries.getUser(userId ?? req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { username, bio, email } = req.body;

        const usernameLower = username.toLowerCase();

        const updateUsersSql = `UPDATE users
         SET
             username = COALESCE(NULLIF($1, NULL), username),
             email = COALESCE(NULLIF($2, NULL), email)
         WHERE id = $3;`

        const updateProfilesSql = `UPDATE user_profiles
         SET
             bio = COALESCE(NULLIF($1, NULL), bio)
         WHERE user_id = $2;`

        try {
            await Promise.all([
                pool.query(updateUsersSql, [usernameLower, email, req.user.id]),
                pool.query(updateProfilesSql, [bio, req.user.id])
            ]);
        }
        catch (e) {
            res.status(400).json({ message: 'save error'});
            return;
        }

        res.json({message: 'profile updated.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/profile/image', authMiddleware, uploadMiddleware.single('file'), async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'invalid file' });

        updateUserImage(file, req.user.id).then(_ => {});

        return res.status(200);
    }
    catch (e) {
        next(e);
    }
});


app.post('/profile/followers', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.body;

        await userQueries.followUser(req.user.id, userId);

        refreshUserFollows(req.user.id).then(_ => {});
        refreshUserFollowers(userId).then(_ => {});

        return res.json({ message: 'User followed successfully' });
    }
    catch (e) {
        next(e);
    }
});

app.delete('/profile/followers', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.query;

        await userQueries.unfollowUser(req.user.id, userId);

        refreshUserFollows(req.user.id).then(_ => {});
        refreshUserFollowers(userId).then(_ => {});

        return res.json({ message: 'User unfollowed successfully' });
    }
    catch (e) {
        next(e);
    }
});

app.get('/profile/followers', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.query;

        const result = await userQueries.getFollowers(userId);

        return res.json({ users: result });
    }
    catch (e) {
        next(e);
    }
});

app.get('/profile/follows', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.query;

        const result = await userQueries.getFollows(userId);

        return res.json({ users: result });
    }
    catch (e) {
        next(e);
    }
});

app.get('/polls', authMiddleware, async (
    req, res) => {
    const result = await pollQueries.fetchPolls(req.user.id);
    res.json(result);
});

app.post('/polls/like', authMiddleware, async (req, res, next) => {
    try {
        const { pollId } = req.body;

        await pollQueries.likePoll(pollId, req.user.id);

        return res.json({ success: true });
    }
    catch (e) {
        next(e);
    }
});

app.delete('/polls/like', authMiddleware, async (req, res, next) => {
    try {
        const { pollId } = req.query;

        await pollQueries.unlikePoll(pollId, req.user.id);

        return res.json({ success: true });
    }
    catch (e) {
        next(e);
    }
});

app.delete('/polls', authMiddleware, async (req, res, next) => {
    try {
        const { pollId } = req.query;

        await pollQueries.deletePoll(pollId, req.user.id);

        return res.json({ success: true });
    }
    catch (e) {
        next(e);
    }
});

app.delete('/users', authMiddleware, async (req, res, next) => {
    try {
        await userQueries.deleteUser(req.user.id);

        return res.json({ success: true });
    }
    catch (e) {
        next(e);
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