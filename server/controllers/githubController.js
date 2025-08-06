// server/controllers/githubController.js
const axios = require('axios');

const getRepoFiles = async (req, res) => {
  const { owner, repo } = req.params;

  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
    console.log('GitHub API URL:', apiUrl);

    const response = await axios.get(apiUrl);
    console.log('GitHub API response received');
    const allFiles = response.data.tree;

    // Filter only code files (.js, .jsx, .ts, .py, .java, etc.)
    const codeFiles = allFiles.filter(file =>
      file.type === 'blob' &&
      /\.(js|jsx|ts|py|java|cpp|c|cs|rb)$/.test(file.path)
    );

    res.json(codeFiles);
  } catch (err) {
    console.error('Error fetching GitHub repo:', err.message);
    res.status(500).json({ error: 'Failed to fetch repo files' });
  }
};

module.exports = { getRepoFiles };
