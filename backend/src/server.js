require('dotenv').config();
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
const {getActivationCode, checkActivationCode, checkAndInsertUserWithProfile, getUserByLogin, getUser, getVerificationCode, changePassword,
    addInquiry,
    changeEmail
} = require("./db/dal/userQueries");
const {validateEmail, validateUsername, validatePassword} = require("./validation");
const {uploadMiddleware} = require("./middleware/fileUploadMiddleware");
const {updateUserImage} = require("./services/userService");
const {getPollById, sharePoll} = require("./db/dal/pollQueries");
const {next} = require("lodash/seq");
const {sendExpoPushNotification} = require("./services/notificationService");
const {getUserNotifications, deleteAllUserNotifications, markNotificationsAsRead} = require("./db/dal/notificationQueries");
const sendCodeEmail = require("./mail/mailing");
const {join} = require("node:path");
const {writeDebugLog, writeActivityReport} = require("./db/dal/activityQueries");

const app = express();
// Manual CORS header
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No Content
    }
    //setTimeout(next, 6000);
    next();
});

app.use(express.json());

// Grab the port from CLI args
const args = process.argv;
const portIndex = args.indexOf('-p');
const isDebug = process.argv.includes('--debug');
const port = (portIndex !== -1 && args[portIndex + 1]) ? parseInt(args[portIndex + 1], 10) : 3000;

function generateToken({id, username}) {
    return jwt.sign({ id, username }, SECRET_KEY);//let's make it non-expirale for convenience
}

function generateSignUpToken({email}) {
    return jwt.sign({ email }, SECRET_KEY);//let's make it non-expirale for convenience
}

if (isDebug) {
    app.use((req, res, next) => {
        const start = Date.now();
        const originalJson = res.json;

        res.json = function (body) {
            const duration = Date.now() - start;

            console.groupCollapsed(`[DEBUG] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);

            console.log('%cRequest Headers:', 'color: gray; font-weight: bold;');
            console.dir(req.headers, { depth: null });

            console.log('%cResponse Body:', 'color: cyan; font-weight: bold;');
            console.dir(body, { depth: null });

            console.groupEnd();

            return originalJson.call(this, body);
        };

        next();
    });
}

// Custom middleware to force content-type
app.use('/.well-known/apple-app-site-association', (req, res, next) => {
    const filePath = join(__dirname, 'public/.well-known/apple-app-site-association');

    try {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(filePath);
    } catch (err) {
        next(err);
    }
});

app.get("/ping", (req, res, next) => {
    res.json({});
});

app.post("/users/passwords/forgot", async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!await validateEmail(email)) {
            return res.status(400).send("invalid email");
        }

        const { code, canSend } = await getVerificationCode(email);

        if (code) {
            if (canSend) {
                sendCodeEmail(email, code).then();
            }
        }
        return res.json({});
    } catch (e) {
        next(e);
    }
});

/**
 * reportType:
 * 0 - bug
 * 1 - poll
 */
app.post('/activity-reports', authMiddleware, async (req, res, next) => {
    try {
        const { description, reportType, relatedEntityId } = req.body;

        await writeActivityReport(req.user.id, description, reportType, relatedEntityId ?? null);

        return res.sendStatus(200);
    } catch (e) {
        next(e);
    }
});

app.post('/debug/log', authMiddleware, async (req, res, next) => {
    try {
        const { log } = req.body;

        await writeDebugLog(req.user.id, log);

        return res.sendStatus(200);
    } catch (e) {
        next(e);
    }
});

app.post("/users/passwords", signupAuthMiddleware, async (req, res, next) => {
    try {
        const { password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const {id, username} = await changePassword(req.user.email, passwordHash);

        const token = generateToken({id: id, username: username});
        return res.json({ message: 'Password reset & sign-in successful', token });
    } catch (e) {
        next(e);
    }
});

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
                sendCodeEmail(email, code).then();
            }

            return res.json({});
        }
        else
            throw "invalid code";
    } catch (e) {
        next(e);
    }
});

app.post("/users/email/verify", authMiddleware, async (req, res, next) => {
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
                sendCodeEmail(email, code).then();
            }
        }
        return res.json({});
    } catch (e) {
        next(e);
    }
});

app.put("/users/email/change", authMiddleware, async (req, res, next) => {
    try {
        const { email, code } = req.body;

        const result = await checkActivationCode(email, code);
        switch (result) {
            default:
            case 0:
                return res.status(404).json({ error: "invalid code" });
            case 1:
                await changeEmail(req.user.id, email);
                return res.json({ success: true, message: "email changed" });
            case 2:
                return res.status(410).json({ error: "code expired" });
            case -1:
                return res.status(403).json({ error: "too many attempts - request another code" });
        }
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

// Password check endpoint
app.post('/users/security/verify', authMiddleware, async (req, res, next) => {
    try {
        const { password } = req.body;

        const errorCode = 200;
        const errorMessage = { isSuccess: false, message: 'Invalid credentials' };

        // Check if username and password are valid
        if (!password || password.length > 20) {
            console.log(req.body);
            return res.status(errorCode).json(errorMessage);
        }

        const existingUser = await getUserByLogin(req.user.username);

        if (!existingUser) {
            return res.status(errorCode).json(errorMessage);
        }

        if (!await bcrypt.compare(password, existingUser.password)) {
            return res.status(errorCode).json(errorMessage);
        }

        return res.json({ isSuccess:true, message: 'Security check successful' });
    }
    catch (e) {
        next(e);
    }
});

app.get('/profile/:id?', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (
            userId === 'followers' ||
            userId === 'notifications' ||
            userId === 'follows' ||
            userId === 'birthdate' ||
            userId === 'gender'
        ) return next(); // Forward to next matching route

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
                pool.query(updateUsersSql, [username?.toLowerCase(), email?.toLowerCase(), req.user.id]),
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

        return res.json({});
    }
    catch (e) {
        next(e);
    }
});

app.post('/profile/categories', authMiddleware, async (req, res, next) => {
    try {
        const { categories } = req.body;

        await userQueries.setCategories(categories, req.user.id);

        return res.json({ message: 'Categories set successfully' });
    }
    catch (e) {
        next(e);
    }
});

app.post('/test/push', async (req, res, next) => {
    try {
        const { token, title, body, screenName, code } = req.body;

        if (code !== 'KAkmfm320ALZ939lLZNdmd0i8Mkm3kmzx0zkMALl0--21332xz0xz0..j21mxc.v3.33343xvcij8329rundsbdb z73')
            return res.status(403).json({ message: 'Unauthorized' });

        await sendExpoPushNotification(token, title, body, { screenName: screenName });

        return res.json({ message: 'Message sent successfully' });
    }
    catch (e) {
        next(e);
    }
});

app.put('/user/token', authMiddleware, async (req, res, next) => {
    try {
        const { token, timezoneOffset } = req.body;

        await userQueries.updatePushToken(token, timezoneOffset, req.user.id);

        return res.json({ message: 'Push token set successfully' });
    }
    catch (e) {
        next(e);
    }
});

app.put('/user/notifications', authMiddleware, async (req, res, next) => {
    try {
        const { is_new_followers_notification_enabled } = req.body;

        await userQueries.updateNotificationSettings({is_new_followers_notification_enabled}, req.user.id);

        return res.json({ message: 'Push token set successfully' });
    }
    catch (e) {
        next(e);
    }
});

app.put('/profile/birthdate', authMiddleware, async (req, res, next) => {
    try {
        const { birthdate } = req.body;

        await userQueries.updateBirthDate({birthDate: birthdate}, req.user.id);

        return res.json({ message: 'Birth date set successfully' });
    }
    catch (e) {
        next(e);
    }
});

/**
 * 1 - male
 * 2 - female
 * 3 - non-binary
 * null/0 - no answer
 */
app.put('/profile/gender', authMiddleware, async (req, res, next) => {
    try {
        const { gender } = req.body;

        await userQueries.updateGender({gender}, req.user.id);

        return res.json({ message: 'Gender set successfully' });
    }
    catch (e) {
        next(e);
    }
});

app.post('/profile/followers', authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.body;

        await userQueries.followUser(req.user.id, userId);

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

        return res.json({ message: 'User unfollowed successfully' });
    }
    catch (e) {
        next(e);
    }
});

app.get('/profile/notifications', authMiddleware, async (req, res, next) => {
    try {
        const result = await getUserNotifications(req.user.id);

        return res.json({ notifications: result });
    }
    catch (e) {
        next(e);
    }
});

app.put('/profile/notifications', authMiddleware, async (req, res, next) => {
    try {
        const { notificationIds } = req.body;
        await markNotificationsAsRead(req.user.id, notificationIds);

        return res.json({});
    }
    catch (e) {
        next(e);
    }
});

app.delete('/profile/notifications', authMiddleware, async (req, res, next) => {
    try {
        await deleteAllUserNotifications(req.user.id);

        return res.json({});
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

app.get('/polls', authMiddleware, async (req, res) => {
    try {
        const { featuredId } = req.query;
        const result = await pollQueries.fetchPolls(req.user.id, featuredId);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

app.get('/polls/search', authMiddleware, async (req, res, next) => {
    try {
        const { query, searchFlags } = req.query;
        if (!query) {
            res.json([]);
            return;
        }

        const result = await pollQueries.searchPolls(req.user.id, query, searchFlags);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

app.get('/polls/voted', authMiddleware, async (req, res, next) => {
    try {
        const result = await pollQueries.fetchVotedPolls(req.user.id);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

app.get('/polls/trending', authMiddleware, async (req, res, next) => {
    try {
        const result = await pollQueries.fetchTrendingPolls(req.user.id);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

app.get('/user/:id?/polls', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.params.id;

        const result = await pollQueries.fetchUserPolls(req.user.id, userId ?? req.user.id);
        res.json(result);
    } catch (e) {
        next(e);
    }
});

const durationMap = {
    '1h': '1 hour',
    '1d': '1 day',
    '1w': '1 week',
    '1m': '1 month',
};

app.post('/polls', authMiddleware, async (req, res, next) => {
    try {
        const { question, options, duration } = req.body;

        if (!durationMap[duration]) return req.status(400).json({ message: 'Invalid duration' });
        if (options.length < 2 || options.length > 4) return req.status(400).json({ message: '2 to 4 options required' });

        await pollQueries.createPoll(req.user.id, question, options, durationMap[duration]);

        return res.json({ success: true });
    }
    catch (e) {
        next(e);
    }
});

app.post('/polls/options', authMiddleware, async (req, res, next) => {
    try {
        const { optionId } = req.body;

        const result = await pollQueries.voteOnPoll({userId: req.user.id, optionId});

        if (result.success)
            return res.json({ success: true });
        else
            return res.status(500).json({ success: false });
    }
    catch (e) {
        next(e);
    }
});

app.post('/users/inquiry', async (req, res, next) => {
    try {
        const { email, inquiryType } = req.body;

        if (inquiryType < 0 || inquiryType > 1) {
            return res.json({});
        }

        await addInquiry({email, inquiryType});
        return res.json({ success: true });
    } catch (e) {
        next(e);
    }
});

app.get('/polls/:id?/options', authMiddleware, async (req, res, next) => {
    try {
        const pollId = req.params.id;

        const result = await pollQueries.getPollOptionResults(pollId, req.user.id);

        if (result)
            return res.json(result);
        else
            return res.status(404).json({message: 'poll not found'});
    }
    catch (e) {
        next(e);
    }
});

app.get('/polls/:id?/links', authMiddleware, async (req, res, next) => {
    try {
        const pollId = req.params.id;
        const poll = await getPollById(pollId);

        if (poll?.readableId)
            sharePoll(pollId, req.user.id).then(_ => {});

        return res.status(200).json({ link: `https://api-voteapp.beampie.com/polls/share/${poll?.readableId ?? ''}` });
    } catch (e) {
        next(e);
    }
});

app.get('/polls/share/:id', async (req, res, next) => {
    try {
        const pollId = req.params.id;

        // Example: fetch poll data from DB by readableId (e.g. "abc123")
        const poll = await getPollById(pollId, true); // `true` = allow unauthenticated

        if (!poll || !poll.options) return res.status(404).send('Poll not found');

        const question = poll.question;
        const answers = poll.options.map(option => option.text);

        return res.render('poll-preview', {
            pollId,
            question,
            answers,
        });
    } catch (e) {
        next(e);
    }
});

// app.get('/polls/share/:id', async (req, res) => {
//     try {
//         const pollId = req.params.id;
//         const poll = await getPollById(pollId, true);
//
//         if (!poll) return res.status(404).send('Poll not found');
//
//         const html = `
//           <html>
//             <head>
//               <meta property="og:title" content="${poll.question}" />
//               <meta property="og:description" content="${poll.options.map(o => o.text).join(' | ')}" />
//               <meta property="og:image" content="${poll.user.image}" />
//               <meta http-equiv="refresh" content="1; url=voteapp://poll/${poll.readableId}" />
//             </head>
//             <body>Welcome to Voteapp</body>
//           </html>
//         `;
//         res.send(html);
//     }
//     catch (e) {
//         next(e);
//     }
// });

app.post('/polls/view', authMiddleware, async (req, res, next) => {
    try {
        const { pollId } = req.body;

        await pollQueries.viewPoll(req.user.id, pollId);

        return res.json({ success: true });
    }
    catch (e) {
        next(e);
    }
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
        const { password } = req.query;

        const existingUser = await getUser(req.user.id);

        if (!existingUser)
            return res.json({ success: true });

        // if (!await bcrypt.compare(password, existingUser?.password))
        //     return res.status(403).json({ message: 'Invalid password' });

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});