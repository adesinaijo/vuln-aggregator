// utils/sanitizer.js
function sanitize(input) {
    return input.replace(/<[^>]*>/g, "").trim();
}

module.exports = { sanitize };

// utils/sanitizer.js

/**
 * Sanitizes an email address.
 * @param {string} email - The email address to sanitize.
 * @returns {string}
 */
function sanitizeEmail(email) {
    return email.trim().toLowerCase();
}

module.exports = { sanitizeEmail };
