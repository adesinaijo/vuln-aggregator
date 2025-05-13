// public/main.js

// Fetch and display news
async function fetchNews() {
    try {
        const response = await fetch('/api/news');
        const newsItems = await response.json();
        
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = "";
        
        newsItems.slice(0, 20).forEach(item => {
            const newsCard = `
                <div class="news-item">
                    <a href="${item.url}" class="clickable-title" target="_blank">${item.title}</a>
                    <p class="meta">${new Date(item.publishedDate).toLocaleDateString()} | ${item.source}</p>
                    <p>${item.description || 'No description available'}</p>
                    <a href="${item.url}" target="_blank" class="read-more">Read more</a>
                </div>
            `;
            newsContainer.innerHTML += newsCard;
        });
    } catch (error) {
        console.error("Failed to load news:", error);
    }
}

// Handle subscriptions
async function subscribeUser(emailFieldId) {
    const emailInput = document.getElementById(emailFieldId);
    const email = emailInput.value.trim();

    if (!email) {
        alert("Please enter a valid email address.");
        return;
    }

    try {
        const response = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            alert("Subscription successful!");
            emailInput.value = "";
        } else {
            alert("Subscription failed. Please try again.");
        }
    } catch (error) {
        console.error("Subscription error:", error);
        alert("An error occurred. Please try again.");
    }
}

// Load news on page load
document.addEventListener("DOMContentLoaded", fetchNews);
