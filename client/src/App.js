import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiGithub, FiLogOut, FiCopy, FiMoon, FiSun } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [testSummaries, setTestSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [generatedTestCode, setGeneratedTestCode] = useState('');
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  const [loadingTestCode, setLoadingTestCode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('github_token') || null);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/github/login';
  };

  const handleLogout = () => {
    localStorage.removeItem('github_token');
    setToken(null);
    window.location.reload();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    if (accessToken) {
      localStorage.setItem('github_token', accessToken);
      setToken(accessToken);
      window.history.replaceState({}, document.title, '/');
    }

    if (!token) return;

    axios
      .get('http://localhost:5000/api/github/repo/AkashChy284/akash-portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setFiles(res.data))
      .catch(err => console.error(err));
  }, [token]);

  const handleCheckboxChange = (filePath) => {
    setSelectedFiles(prev =>
      prev.includes(filePath)
        ? prev.filter(path => path !== filePath)
        : [...prev, filePath]
    );
  };

  const generateTestSummaries = async () => {
    if (selectedFiles.length === 0) {
      toast.warn('Please select files first!');
      return;
    }
    setLoadingSummaries(true);
    setTestSummaries([]);
    setSelectedSummary(null);
    setGeneratedTestCode('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/generate-test-summaries',
        {
          username: 'AkashChy284',
          repo: 'akash-portfolio',
          files: selectedFiles,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTestSummaries(res.data);
      toast.success('Summaries generated successfully!');
    } catch (error) {
      console.error('Error generating test summaries:', error);
      toast.error('Failed to generate test summaries.');
    } finally {
      setLoadingSummaries(false);
    }
  };

  const generateFullTestCode = async () => {
    if (!selectedSummary) {
      toast.warn('Please select a test summary first.');
      return;
    }
    setLoadingTestCode(true);
    setGeneratedTestCode('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/generate-tests',
        {
          files: [selectedSummary.file],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const testCodeArray = res.data.tests || [];
      const combinedCode = testCodeArray.map(t => t.code).join('\n\n');
      setGeneratedTestCode(combinedCode);
      toast.success('Test code generated!');
    } catch (error) {
      console.error('Error generating full test code:', error);
      toast.error('Failed to generate full test code.');
    } finally {
      setLoadingTestCode(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTestCode);
    toast.info('Copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-poppins min-h-screen transition-colors">
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-indigo-400 flex items-center gap-2">🔪 Test Case Generator
          </h1>
          <p className="text-sm text-gray-400">Generate test cases from your GitHub repo with AI</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className="text-xl text-gray-300 hover:text-yellow-300"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </header>

      {!token ? (
        <button
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded shadow-lg"
          onClick={handleLogin}
        >
          <FiGithub className="inline mr-2" /> Login with GitHub
        </button>
      ) : (
        <div className="mb-4">
          <p className="mb-2 text-green-400">✅ Logged in with GitHub</p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center gap-2"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      )}

      {token && (
        <>
          <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-300">📁 Repository Files</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {files.map(file => (
              <label key={file.path} className="flex items-center gap-2 p-2 bg-slate-800 rounded cursor-pointer hover:bg-slate-700">
                <input
                  type="checkbox"
                  value={file.path}
                  onChange={() => handleCheckboxChange(file.path)}
                  checked={selectedFiles.includes(file.path)}
                />
                {file.path}
              </label>
            ))}
          </div>

          <button
            onClick={generateTestSummaries}
            disabled={loadingSummaries}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded shadow-lg"
          >
            {loadingSummaries ? 'Generating Summaries...' : '🚀 Generate Test Case Summaries'}
          </button>

          <h3 className="text-lg font-medium mt-6 text-green-400">✅ Selected Files:</h3>
          <ul className="list-disc list-inside text-slate-200">
            {selectedFiles.map(f => <li key={f}>{f}</li>)}
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-indigo-300">📋 Suggested Test Case Summaries</h2>
          {testSummaries.length === 0 && <p className="text-gray-400">No summaries generated yet.</p>}
          {testSummaries.map(({ file, summaries }) => (
            <motion.div
              key={file}
              className="card mb-4 bg-slate-800 rounded-lg p-4 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-2 text-indigo-300">{file}</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-200">
                {summaries.map((summary, idx) => (
                  <li
                    key={idx}
                    onClick={() => setSelectedSummary({ file, summary })}
                    className={`cursor-pointer p-2 rounded-md border ${
                      selectedSummary?.summary === summary
                        ? 'bg-indigo-900 border-indigo-400'
                        : 'bg-slate-700 border-slate-600'
                    }`}
                  >
                    {summary}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <button
            onClick={generateFullTestCode}
            disabled={!selectedSummary || loadingTestCode}
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded shadow-lg"
          >
            {loadingTestCode ? 'Generating Full Test Code...' : '🧾 Generate Full Test Code'}
          </button>

          {generatedTestCode && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-indigo-300">🧾 Generated Test Code</h2>
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <FiCopy /> Copy
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded overflow-auto whitespace-pre-wrap max-h-96">
                {generatedTestCode}
              </pre>
            </div>
          )}
        </>
      )}

      <footer className="footer text-center mt-10 mb-4">
        Made with ❤️ by Akash | © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
