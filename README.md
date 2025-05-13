📋 Project Overview

Vulnerability Aggregator is a full-stack application designed to aggregate and present real-time cybersecurity news and vulnerability data from multiple trusted sources. It supports keyword-based filtering, real-time updates, and email notifications to keep security professionals and enthusiasts informed about the latest security threats. The project is built using Node.js, Express.js, MongoDB, and Vanilla JavaScript, making it highly extensible for developers while remaining accessible for less technical users.

🗂️ Project Structure

vuln-aggregator/
├── models/
│   ├── vulnerability.js          # Mongoose model for vulnerability tracking
│   └── subscriber.js             # Mongoose model for email subscribers
├── routes/
│   ├── news.js                   # API routes for news fetching
│   └── subscribe.js              # API routes for subscriber management
├── services/
│   ├── newsFetcher.js            # Fetches data from various news sources
│   └── emailService.js           # Handles email notifications
├── public/
│   ├── index.html                # Main frontend HTML
│   ├── style.css                 # Main frontend styles
│   └── main.js                   # Main frontend logic
├── .env                          # Environment variables
├── server.js                     # Main server file
├── db.js                         # Database connection logic
└── README.md                     # Project documentation (this file)

⚙️ Prerequisites

Make sure you have the following installed:

    Node.js (v18+ recommended)

    MongoDB (local or cloud instance)

    npm or yarn (package manager)

🚀 Getting Started

1. Clone the Repository:
    git clone https://github.com/adesinaijo/vuln-aggregator.git
    cd vuln-aggregator
2. Install Dependencies
    npm install
3. Set Up Environment Variables:
  Create a .env file in the root directory with the following variables:
      # Database Configuration
    MONGODB_URI=mongodb://localhost:27017/vuln-aggregator
    MONGO_CLOUD_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
    
    # Server Configuration
    PORT=3000
    
    # Email Configuration
    EMAIL_SERVICE=gmail
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-email-app-password
    
    # News API Configuration
    NEWS_API_KEY=your-newsapi-key
    NEWS_API_URL=https://newsapi.org/v2/everything
    
    # NVD API Configuration
    NVD_API_KEY=your-nvd-api-key
    NVD_API_URL=https://services.nvd.nist.gov/rest/json/cves/2.0
    
    # Other News Sources
    MITRE_API_URL=https://cveawg.mitre.org/api/cve
    HACKER_NEWS_RSS=https://thehackernews.com/feeds/posts/default?alt=json
    BLEEPING_COMPUTER_RSS=https://bleepingcomputer.com/feed/
    CIRCL_API_URL=https://cve.circl.lu/api
4. Run the server:
     npm start

📰 Features

    Real-Time News Aggregation: Collects the latest cybersecurity news from multiple sources, including NVD, MITRE, The Hacker News, BleepingComputer, and CIRCL.

    Keyword-Based Filtering: Search for vulnerabilities based on specific keywords.

    Email Notifications: Notifies subscribers about new vulnerabilities.

    Deduplication: Prevents duplicate news items from being displayed or sent.

    Mobile-Responsive UI: Clean, responsive frontend for a seamless user experience.

🔌 API Routes
Route	Method	Description
/api/news	GET	Fetches the latest news.
/api/subscribe	POST	Adds a new subscriber.
/api/subscribe	DELETE	Removes a subscriber.

🛠️ Developer Guide

Extending the Backend:

    Adding New Sources: Add new sources by modifying newsFetcher.js to include additional APIs or RSS feeds.

    Improving Performance: Implement caching for faster responses or integrate WebSockets for real-time updates.

    Customizing Data Models: Extend the vulnerability.js and subscriber.js models to include additional metadata.

Extending the Frontend:

    UI Enhancements: Add animations, advanced search filters, or interactive charts.

    Push Notifications: Use service workers for real-time browser notifications.

    Progressive Web App (PWA) Features: Make the app installable and offline-capable.

🛡️ Security Considerations

This project introduces several security risks:

    Sensitive Data Exposure:

        Issue: API keys and credentials in the .env file are highly sensitive.

        Mitigation: Use environment variables and avoid committing them to public repositories.

    Injection Attacks:

        Issue: Inputs from subscribers can be exploited if not sanitized.

        Mitigation: Use input validation and sanitization in both frontend and backend.

    DDoS and Rate Limiting:

        Issue: APIs like NVD and MITRE have strict rate limits.

        Mitigation: Implement request throttling and caching strategies.

    Email Spoofing and Abuse:

        Issue: Using plain SMTP can expose your service to spam and abuse.

        Mitigation: Use more secure options like OAuth or external services like SendGrid.

    Database Security:

        Issue: Open MongoDB databases are a common attack vector.

        Mitigation: Use strong passwords, IP whitelisting, and encrypted connections.
🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for:

    New features

    Bug fixes

    Documentation improvements

📄 License

This project is licensed under the MIT License.
