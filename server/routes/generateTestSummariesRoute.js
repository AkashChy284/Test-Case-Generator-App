require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/generate-test-summaries', async (req, res) => {
  console.log('🎯 Endpoint /api/generate-test-summaries hit');

  const { username, repo, files } = req.body;

  if (!username || !repo || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: 'Invalid input. Provide username, repo, and files array.' });
  }

  try {
    const summaries = await Promise.all(files.map(async (filePath) => {
      const url = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`;
      try {
        const fileRes = await axios.get(url, {
          headers: { 'User-Agent': 'request' }
        });

        const content = Buffer.from(fileRes.data.content, 'base64').toString('utf8');

        // Simulate AI-generated test summaries
        const generatedSummaries = [];

        if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
          generatedSummaries.push(
            `Test if the ${filePath} component renders without crashing`,
            `Check if major props are handled in ${filePath}`,
            `Validate error handling and edge cases in ${filePath}`
          );
        } else if (filePath.endsWith('.py')) {
          generatedSummaries.push(
            `Test main functions in ${filePath}`,
            `Ensure exception handling is implemented`,
            `Validate correct return types`
          );
        } else {
          generatedSummaries.push(`No test suggestions for this file type: ${filePath}`);
        }

        return {
          file: filePath,
          summaries: generatedSummaries
        };

      } catch (err) {
        console.error(`❌ Error reading file ${filePath}:`, err.message);
        return {
          file: filePath,
          summaries: [`⚠️ Failed to fetch file or generate summaries.`]
        };
      }
    }));

    res.json(summaries);

  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: 'Failed to generate test summaries.' });
  }
});

module.exports = router;
