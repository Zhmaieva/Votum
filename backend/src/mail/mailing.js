const nodemailer = require('nodemailer');
const {MAIL_PASS} = require("../constants");

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.me.com',
    port: 587, // Use 465 for SSL
    secure: false, // Set to true for port 465
    auth: {
        user: 'artem.ovechko@icloud.com', // Your custom domain email on iCloud
        pass: MAIL_PASS, // App-specific password
    },
    socketTimeout: 10000,
    timeout: 15000,
    tls: {
        rejectUnauthorized: true, // Helps with some SSL issues
    }
});

const sendMail = async function (to, subject, text) {
    const mailOptions = {
        from: 'artem.ovechko@icloud.com',
        to,
        subject,
        text
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

function sendEmail(to, subject, text) {
    sendMail(to, subject, text).then(_ => {})
}

module.exports = sendEmail;