// routes/subscribe.js
const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber'); // Note the capitalization
const { subscribe } = require('../services/emailService');
const { sanitizeEmail } = require('../utils/sanitizer');

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        // Basic validation
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        // Sanitize the email address
        const sanitizedEmail = sanitizeEmail(email);

        // Check if the email is already subscribed
        const existingSubscriber = await Subscriber.findOne({ email: sanitizedEmail });
        if (existingSubscriber) {
            return res.status(409).json({ message: "This email is already subscribed." });
        }

        // Save the subscriber to the database
        const subscriber = new Subscriber({ email: sanitizedEmail });
        await subscriber.save();

        // Send a confirmation email
        await subscribe(sanitizedEmail);

        console.log(`✅ Successfully subscribed: ${sanitizedEmail}`);
        res.status(201).json({ message: "Successfully subscribed!" });

    } catch (error) {
        console.error("🚨 Subscription error:", error);
        res.status(500).json({ message: "Failed to subscribe. Please try again later." });
    }
});

module.exports = router;
