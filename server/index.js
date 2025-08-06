require('dotenv').config(); // ✅ Make sure this is before any use of process.env

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config(); // Load .env file

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true               // Allow cookies and sessions to be sent
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard_cat', // Use a secure secret in prod
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Routes
const githubRoutes = require('./routes/githubRoutes');                
const generateTestsRoute = require('./routes/generateTestsRoute');    
const generateSummariesRoute = require('./routes/generateTestSummariesRoute'); 
const generateTestCodeRoute = require('./routes/generateTestCodeRoute');
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/github', githubRoutes);
app.use('/api', generateTestsRoute);
app.use('/api', generateSummariesRoute);
app.use('/api', generateTestCodeRoute);
app.use('/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
