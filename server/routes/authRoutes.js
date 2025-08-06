
const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_CALLBACK_URL;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'; // fallback

// Step 1: Redirect user to GitHub OAuth consent page
router.get('/github/login', (req, res) => {
  const githubAuthUrl = 
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo,user`;

  res.redirect(githubAuthUrl);
});

// Step 2: GitHub redirects here after authorization with ?code=XYZ
router.get('/github/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI
      },
      { headers: { accept: 'application/json' } }
    );

    const accessToken = tokenRes.data.access_token;

    if (!accessToken) {
      return res.status(400).send('Failed to retrieve access token');
    }

    // Redirect back to frontend with access token (you can also set a cookie or session here)
    res.redirect(`${FRONTEND_URL}/?access_token=${accessToken}`);

  } catch (error) {
    console.error('Error getting access token:', error.message);
    res.status(500).send('Error during OAuth process');
  }
});

module.exports = router;
