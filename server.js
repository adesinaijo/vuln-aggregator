// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const newsRouter = require("./routes/news");
const subscribeRouter = require("./routes/subscribe");
const connectDB = require("./db");
const { sendNewsletter } = require("./services/mailer");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/news", newsRouter);
app.use("/api/subscribe", subscribeRouter);

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Schedule the newsletter to send every day at 8 AM (server time)
cron.schedule("0 8 * * *", async () => {
    console.log("🔔 Sending daily newsletter...");
    await sendNewsletter();
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
// Test the newsletter function (remove after testing)
// sendNewsletter();
