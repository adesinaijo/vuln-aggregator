// services/emailService.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an email.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text email content.
 * @param {string} html - HTML email content.
 * @returns {Promise}
 */
async function sendEmail(to, subject, text, html = null) {
    try {
        const info = await transporter.sendMail({
            from: `"0-Day Vulnerability Alerts" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || text
        });
        console.log("📧 Email sent:", info.response);
        return info;
    } catch (error) {
        console.error("❌ Email sending error:", error);
        throw new Error("Failed to send email.");
    }
}

/**
 * Subscribes a new email address.
 * @param {string} email - The email address to subscribe.
 * @returns {Promise}
 */
async function subscribe(email) {
    const subject = "Subscription Confirmation";
    const message = `
Thank you for subscribing to 0-Day Vulnerability Alerts!

You will now receive regular updates about the latest security vulnerabilities.
Stay safe and secure!

Best,
0-Day Vulnerability Aggregator Team
    `;
    const htmlMessage = `
        <h2>Welcome to 0-Day Vulnerability Alerts</h2>
        <p>Thank you for subscribing!</p>
        <p>You will now receive regular updates about the latest security vulnerabilities.</p>
        <p>Stay safe and secure!</p>
        <p>Best,<br>0-Day Vulnerability Aggregator Team</p>
    `;
    return sendEmail(email, subject, message, htmlMessage);
}

module.exports = { sendEmail, subscribe };
