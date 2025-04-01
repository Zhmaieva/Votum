const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../constants");

module.exports = (req, res, next) => {
    const token = req.header('Authorization'); // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // Verify token
        req.user = decoded;

        if (!req?.user?.email) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
