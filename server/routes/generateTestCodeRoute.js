require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @route POST /api/generate-tests
 * @desc Generates full test code for a given file
 */
router.post('/generate-test-code', async (req, res) => {
  console.log('🎯 POST /api/generate-tests hit');

  const { username, repo, file } = req.body;

  if (!username || !repo || !file) {
    return res.status(400).json({ error: 'Missing required fields: username, repo, or file.' });
  }

  const url = `https://api.github.com/repos/${username}/${repo}/contents/${file}`;

  try {
    const fileRes = await axios.get(url, {
      headers: { 'User-Agent': 'test-case-generator' },
    });

    const content = Buffer.from(fileRes.data.content, 'base64').toString('utf8');

    let testCode = '';

    // Simulated AI-generated test code for JSX/JS
    if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const componentName = file.split('/').pop().replace('.jsx', '').replace('.js', '');

      testCode = `
// Auto-generated test for ${componentName}

import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from '../${file.split('/').slice(-2).join('/')}';

describe('${componentName} Component', () => {
  test('renders without crashing', () => {
    render(<${componentName} />);
    expect(screen.getByTestId('${componentName.toLowerCase()}')).toBeInTheDocument();
  });

  // Add more tests here...
});
      `.trim();
    } else if (file.endsWith('.py')) {
      testCode = `
# Auto-generated test for ${file}

import unittest
from ${file.replace('.py', '').replace('/', '.')} import *  # Adjust import as needed

class Test${file.replace('/', '_').replace('.py', '').title().replace('_', '')}(unittest.TestCase):
    def test_sample(self):
        self.assertEqual(1, 1)  # Replace with real test

if __name__ == '__main__':
    unittest.main()
      `.trim();
    } else {
      testCode = `// ❌ Test generation not supported for file type: ${file}`;
    }

    res.json({ file, testCode });

  } catch (err) {
    console.error(`❌ Error generating test code for ${file}:`, err.message);
    res.status(500).json({ error: 'Failed to generate test code.' });
  }
});

module.exports = router;
