const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const ApiKey = require('./models/ApiKey'); // Adjust the path as necessary
const router = express.Router();

// Route to serve the login form
router.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Login to Generate API Key</title>
      </head>
      <body>
        <h2>Login</h2>
        <form action="/gen" method="get">
          Master Password: <input type="password" name="pw" required>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});

// Master password middleware
    const masterPasswordMiddleware = (req, res, next) => {
        const masterPassword = process.env.MASTER_PASSWORD; // Ensure this is set in your .env file
        // Check both query parameters and body for the provided password
        const providedPassword = req.query.pw || req.body.pw;
      
        if (providedPassword !== masterPassword) {
          return res.status(401).send('Unauthorized. <a href="/gen/login">Login</a>');
        }
      
        next();
      };
      
// Route to serve HTML form for API Key generation after login
router.get('/', masterPasswordMiddleware, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Generate API Key</title>
      </head>
      <body>
        <h2>Generate API Key</h2>
        <form action="/gen/generate-api-key" method="post" enctype="application/x-www-form-urlencoded">
        <input type="hidden" name="pw" value="${req.query.pw}">
        <button type="submit">Generate API Key</button>
      </form>      
      </body>
    </html>
  `);
});

// Direct API key generation route, now integrated into genSite.js
router.post('/generate-api-key', masterPasswordMiddleware, async (req, res) => {
  try {
    const key = crypto.randomBytes(30).toString('hex');
    const newApiKey = new ApiKey({
      key: key,
    });
  
    console.log('Attempting to save API key:', newApiKey);
    const savedKey = await newApiKey.save();
    console.log('API Key saved:', savedKey);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Key Generated</title>
          <script>
            function copyToClipboard() {
              const el = document.createElement('textarea');
              el.value = "${key}";
              document.body.appendChild(el);
              el.select();
              document.execCommand('copy');
              document.body.removeChild(el);
              alert('API Key copied to clipboard!');
            }
          </script>
        </head>
        <body>
          <h2>API Key Generated:</h2>
          <input type="text" value="${key}" id="apiKey" readonly>
          <button onclick="copyToClipboard()">Copy to Clipboard</button>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error generating or saving API key:', error);
    res.status(500).send('Error generating or saving API key');
  }
});

module.exports = router;
