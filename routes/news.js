// routes/news.js

const express = require("express");
const router = express.Router();
const newsFetcher = require("../services/newsFetcher");

router.get("/", async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const news = await newsFetcher.fetchAllNews(keyword);
        res.json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Failed to fetch news." });
    }
});

module.exports = router;
