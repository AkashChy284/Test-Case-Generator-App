const express = require('express');
const router = express.Router();

router.post('/generate-tests', async (req, res) => {
  console.log('✅ Received POST /api/generate-tests');
  const { files } = req.body;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({ error: 'Invalid input. Expected files array.' });
  }

  const generated = files.map((file) => ({
    file,
    code: `// Auto-generated test for ${file}\ndescribe('${file}', () => {\n  it('should work', () => {\n    // TODO\n  });\n});`
  }));

  res.json({ tests: generated });
});

module.exports = router;
