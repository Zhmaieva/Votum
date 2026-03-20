const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../constants");

module.exports = (req, res, next) => {
    const token = req.header('Authorization'); // Expecting "Bearer <token>"

    if (!token) {
        next();
        return;
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // Verify token
        req.user = decoded;
    }
    catch (err) {}
    finally {
        next();
    }
};
