require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getRepoFiles } = require('../controllers/githubController');

// existing route
router.get('/repo/:owner/:repo', getRepoFiles);

// ✅ NEW: Route to generate test cases
router.post('/generate-tests', (req, res) => {
  const { files } = req.body;

  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: 'No files provided' });
  }

  const generatedTests = files.map(file => ({
    fileName: file,
    testCode: `// Sample test for ${file}\n// Add your actual tests here`
  }));

  return res.json(generatedTests);
});

module.exports = router;
