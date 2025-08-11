const nodemailer = require('nodemailer');
const {MAIL_PASS} = require("../constants");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Use 465 for SSL
    secure: false, // Set to true for port 465
    auth: {
        user: 'votum.contact@gmail.com', // Your custom domain email on iCloud
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
        from: 'votum.contact@gmail.com',
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

function sendCodeEmail(to, code) {
    return sendMail(to, 'Your Votum code', `Your code: ${code} (Expires in 10 minutes)\n\nSkip it if you’re not sure what this is.\nNeed help? Just reply to this email.\n\nVotum`);
}

module.exports = sendCodeEmail;