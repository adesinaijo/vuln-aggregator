// services/mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");
const Subscriber = require("../models/subscriber");
const { fetchAllNews } = require("./newsFetcher");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send the newsletter to all subscribers
async function sendNewsletter() {
    try {
        const subscribers = await Subscriber.find({});
        const newsItems = await fetchAllNews();
        const latestNews = newsItems.slice(0, 5); // Limit to 5 articles per email

        // Prepare the email content
        const emailContent = latestNews.map((item, index) => `
            <h3>${index + 1}. <a href="${item.url}" target="_blank">${item.title}</a></h3>
            <p>${item.description || "No description available"}</p>
            <hr>
        `).join("");

        for (const subscriber of subscribers) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: subscriber.email,
                subject: "🔔 Latest Cybersecurity News",
                html: `
                    <h2>🔥 Latest Cybersecurity Updates</h2>
                    ${emailContent}
                    <p><small>To unsubscribe, click here</small></p>
                `,
            });
            console.log(`✅ Newsletter sent to: ${subscriber.email}`);
        }

    } catch (error) {
        console.error("❌ Error sending newsletter:", error.message);
    }
}

module.exports = { sendNewsletter };
