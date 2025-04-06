const multer = require("multer");

const uploadMiddleware = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    fileFilter(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPG and PNG files are allowed.'));
        }
        cb(null, true);
    },
});

module.exports = {
    uploadMiddleware,
}