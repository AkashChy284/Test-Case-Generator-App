# 🧪 Test Case Generator App

An AI-powered test case generator that connects with your GitHub repo, fetches code files, and generates test case summaries and actual test code using intelligent prompts.

## 🚀 Live Demo

Coming soon...

## 📸 Preview

![Preview](screenshots/demo.png)

---

## ✨ Features

- 🔐 GitHub OAuth login
- 📁 Fetches code files from any public/private GitHub repo
- 🧠 AI-generated test case summaries
- 🧾 Full test code generation (e.g. Jest, JUnit)
- 🌙 Dark mode toggle
- 🎨 Polished UI with Tailwind CSS + Framer Motion
- 📋 Copy-to-clipboard support
- ⚙️ Backend + frontend integrated

---

## 🛠️ Tech Stack

### Frontend:
- ⚛️ React.js
- 💨 Tailwind CSS
- 🎥 Framer Motion
- 🍞 React Toastify
- 🔗 Axios

### Backend:
- 🌐 Node.js + Express
- 🔐 GitHub OAuth via Passport.js
- 🔗 REST APIs
- 🧠 AI Prompt (via OpenAI/Gemini integration
- - 🗃 MongoDB (optional)

---

## 📂 Project Structure
)test-case-generator/
├── client/ # React frontend
│ ├── public/
│ └── src/
├── server/ # Node.js backend
│ ├── routes/
│ └── controllers/
├── .env
├── README.md


---

## ⚙️ Local Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/AkashChy284/Test-Case-Generator-App.git
   cd Test-Case-Generator-App
cd client
npm install
npm start
Backend setup

bash
Copy code
cd ../server
npm install
node index.js
Add .env (in /server)

env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_secret
📄 License
MIT © 2025 Akash Choudhary



