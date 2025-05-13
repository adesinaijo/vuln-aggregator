// services/newsFetcher.js
require('dotenv').config();
const axios = require('axios');
const Parser = require('rss-parser');

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = process.env.NEWS_API_URL;
const NVD_API_KEY = process.env.NVD_API_KEY;
const NVD_API_URL = process.env.NVD_API_URL;
const MITRE_API_URL = process.env.MITRE_API_URL;
const HACKER_NEWS_RSS = process.env.HACKER_NEWS_RSS;
const BLEEPING_COMPUTER_RSS = process.env.BLEEPING_COMPUTER_RSS;
const CIRCL_API_URL = process.env.CIRCL_API_URL;

const rssParser = new Parser();

async function fetchNewsAPI(keyword) {
    try {
        const params = {
            q: keyword || 'cybersecurity',
            apiKey: NEWS_API_KEY,
            sortBy: 'publishedAt',
            pageSize: 5
        };
        const response = await axios.get(NEWS_API_URL, { params });
        return response.data.articles.map(article => ({
            id: article.url,
            title: article.title,
            description: article.description,
            url: article.url,
            publishedDate: article.publishedAt,
            source: article.source.name
        }));
    } catch (error) {
        console.error("Error fetching News API articles:", error.message);
        return [];
    }
}

async function fetchNVDNews(keyword) {
    try {
        const headers = {
            "apiKey": process.env.NVD_API_KEY
        };
        const params = {
            resultsPerPage: 5,
            startIndex: 0,
            keywordSearch: keyword || 'cybersecurity',
            sortBy: 'publishedDate'
        };
        
        const response = await axios.get(process.env.NVD_API_URL, { params, headers });
        return response.data.vulnerabilities.map(item => ({
            id: item.cve.id,
            title: item.cve.id,
            description: item.cve.descriptions[0]?.value || "No description available",
            publishedDate: item.cve.published,
            source: "NVD",
            url: `https://nvd.nist.gov/vuln/detail/${item.cve.id}`
        }));
    } catch (error) {
        console.error("Error fetching NVD news:", error.message);
        return [];
    }
}



async function fetchMITRENews() {
    try {
        const response = await axios.get(MITRE_API_URL, {
            params: {
                limit: 5
            }
        });

        return response.data.vulnerabilities.map(item => ({
            id: item.cve.id,
            title: item.cve.id,
            description: item.cve.descriptions[0]?.value || "No description available",
            publishedDate: item.cve.published,
            source: "MITRE",
            url: `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${item.cve.id}`
        }));
    } catch (error) {
        console.error("Error fetching MITRE news:", error.message);
        return [];
    }
}


async function fetchRSSFeed(url, sourceName) {
    try {
        const feed = await rssParser.parseURL(url);
        return feed.items.map(item => ({
            id: item.link,
            title: item.title,
            description: item.contentSnippet || item.description,
            publishedDate: item.pubDate,
            source: sourceName,
            url: item.link
        }));
    } catch (error) {
        console.error(`Error fetching RSS feed (${sourceName}):`, error.message);
        return [];
    }
}

async function fetchCIRCLNews() {
    try {
        const response = await axios.get(`${process.env.CIRCL_API_URL}/last`);
        
        // Map the CVE entries correctly
        return response.data.map(item => ({
            id: item.id,
            title: item.id,
            description: item.summary || "No description available",
            publishedDate: item.Published || item.published || "Unknown",
            source: "CIRCL",
            url: `https://cve.circl.lu/cve/${item.id}`
        }));
    } catch (error) {
        console.error("Error fetching CIRCL news:", error.message);
        return [];
    }
}


function deduplicateNews(newsArray) {
    const seen = new Set();
    return newsArray.filter(item => {
        if (seen.has(item.id)) {
            return false;
        } else {
            seen.add(item.id);
            return true;
        }
    });
}

function filterNewsByKeyword(newsArray, keyword) {
    if (!keyword) return newsArray;
    const lowerKeyword = keyword.toLowerCase();
    return newsArray.filter(item =>
        (item.title || "").toLowerCase().includes(lowerKeyword) ||
        (item.description || "").toLowerCase().includes(lowerKeyword)
    );
}


const Vulnerability = require("../models/vulnerability");

async function fetchAllNews(keyword) {
    try {
        const [newsAPI, nvdNews, mitreNews, hackerNews, bleepingComputer, circlNews] = await Promise.all([
            fetchNewsAPI(keyword),
            fetchNVDNews(keyword),
            fetchMITRENews(),
            fetchRSSFeed(HACKER_NEWS_RSS, "The Hacker News"),
            fetchRSSFeed(BLEEPING_COMPUTER_RSS, "BleepingComputer"),
            fetchCIRCLNews()
        ]);

        // Merge all news
        let allNews = [...newsAPI, ...nvdNews, ...mitreNews, ...hackerNews, ...bleepingComputer, ...circlNews];
        allNews = deduplicateNews(allNews);

        // Filter out previously sent vulnerabilities
        const unsentNews = [];
        for (const item of allNews) {
            const exists = await Vulnerability.findOne({ id: item.id });
            if (!exists) {
                unsentNews.push(item);
            }
        }

        // Save unsent news to the database
        if (unsentNews.length > 0) {
            await Vulnerability.insertMany(unsentNews, { ordered: false });
        }

        // Apply keyword filter
        const filteredNews = filterNewsByKeyword(unsentNews, keyword);

        // Sort by date
        return filteredNews.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    } catch (error) {
        console.error("Error fetching all news:", error.message);
        throw new Error("Failed to fetch all news.");
    }
}

module.exports = { fetchAllNews };



module.exports = { fetchAllNews };
// Test fetchAllNews function if this file is run directly
if (require.main === module) {
    (async () => {
        try {
            console.log("🔍 Fetching all news...");
            const allNews = await fetchAllNews("cybersecurity");
            console.log("📰 News fetched successfully:", allNews);
            console.log(`Total articles: ${allNews.length}`);
        } catch (error) {
            console.error("❌ Error in test run:", error.message);
        }
    })();
}
