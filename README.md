# 🚀 KinyaAI — Full-Stack AI Platform in Kinyarwanda & Beyond

![KinyaAI Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop)

**KinyaAI** is a comprehensive, production-ready AI platform designed for Rwandan and global students, educators, professionals, and organizations. It natively integrates Artificial Intelligence with the Kinyarwanda language, delivering conversational intelligence, bidirectional translation, document deep analysis, voice interactions, and a certified academic examination portal.

---

## 🌟 Key Features

### 1. 💬 AI Chat Studio
- Context-aware multi-turn conversations fluently answering in Kinyarwanda & English.
- Chat session history, renaming, deletion, markdown rendering, and code syntax highlighting.
- Built-in Rwandan cultural context, proverbs, and prompt starters across programming, business, and education.

### 2. 🌐 Ururimi Translator (Kinyarwanda ↔ English)
- Real-time bidirectional translation with formality control (Standard, Informal/Bite, Formal/Icyubahiro).
- Text-to-Speech audio pronunciation for correct phonetics and phrasing.
- Grammatical, morphological, and cultural breakdown notes.

### 3. 🎓 KinyaAI Academy & Certified Examination Portal
- **Enrollment Key Gate**: Courses are protected and unlocked using custom enrollment keys set by administrators.
- **Interactive Curricula**: Lessons in Programming (JavaScript/TypeScript in Kinyarwanda), Career English, and Cybersecurity Fundamentals.
- **Umukoro w'Ibibazo 50 (50-Question Assignment)**: 1–50 question mastery grid with automated grading and detailed explanations.
- **Ikizamini cya Leta (20 Hardest Questions Exam)**:
  - Score $\le 74\%$: Fair result — no certificate issued, student prompted to retake.
  - Score $\ge 75\%$: Honors pass — automatically issues verified certificate.
- **Impamyabumenyi (Official Course Certificate)**:
  - Features student's real name, course title, percentage score, distinction grade, official signatures, and unique verification ID.
- **Impamyabumenyi y'Ikirenga mu Masomo Yose (Master Diploma of All Subjects)**:
  - Conferred upon mastering all courses.
  - Showcases complete transcript grid, cumulative GPA, and institutional seals on a strictly **1-page** luxury dark emerald & gold layout.
  - **Dual Export**: Direct high-resolution PNG image download (`html-to-image`) and 1-page PDF print with 100% color retention.

### 4. 📄 Gusesengura Inyandiko (Document Deep Analysis & Summarizer)
- Drag-and-drop file upload (`.pdf`, `.docx`, `.txt`, `.md`, `.json`, `.csv`) up to 25MB via Multer backend.
- Multi-tier structured report: Executive Summary, Detailed Analysis, Key Takeaways, Actionable Steps, and Keywords.
- **Audio Speech Playback**: Built-in audio reader with Play, Pause, Resume, and Stop.
- **Export Suite**: 1-click Copy All, download `.txt`, download `.md`, and print/save as PDF.

### 5. 🎙️ Ijwi (Voice Assistant)
- Speech recognition capturing spoken Kinyarwanda and English audio with live waveform visualization.
- Natural speech audio synthesized responses.

### 6. 👑 Admin Governance Portal
- Default administrator credentials (`bobo` / `bobo`).
- System health monitoring (CPU/Memory usage, database status, uptime).
- Subject & enrollment key management: view keys, create new courses, and configure enrollment keys.
- User management and platform feedback inbox.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (Custom Dark Green/Emerald palette), Lucide Icons, Framer Motion, Axios, Canvas-Confetti, html-to-image.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose ODM, JWT, bcryptjs, Multer, Helmet, CORS, Express-Rate-Limit.
- **Database**: MongoDB (Local or MongoDB Atlas Cloud).
- **AI Integration**: Modular AI service supporting Google Gemini 1.5, OpenAI GPT-4o, and an offline-resilient KinyaAI NLP engine.

---

## 📁 Project Structure

```
KinyAI/
├── client/                     # React 19 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # Layout (Navbar, Sidebar), Learn, Certificate, Feedback
│   │   ├── context/            # AuthContext (sessions, token tracking, demo accounts)
│   │   ├── pages/              # Landing, Dashboard, Chat, Translate, Learn, Voice, Summarize, Admin
│   │   ├── services/           # API services (auth, chat, translate, learn, summarize)
│   │   └── utils/              # Certificate isolated print & export utilities
├── server/                     # Express.js + TypeScript Backend
│   ├── src/
│   │   ├── config/             # Database connection, environment variables
│   │   ├── controllers/        # Auth, chat, translate, learn, summarize, admin controllers
│   │   ├── middleware/         # JWT auth, role guard, rate limiter, file upload
│   │   ├── models/             # Mongoose schemas (User, Course, Certificate, Document, etc.)
│   │   └── services/           # AI service, Kinyarwanda NLP core, document parser
│   └── uploads/                # Temporary document processing directory (gitignored)
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/KinyAI.git
   cd KinyAI
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run build
   npm run start
   # Backend running on http://localhost:5000
   ```

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   npm run dev
   # Frontend running on http://localhost:5173
   ```

### Default Credentials
- **Administrator**:
  - Username: `bobo`
  - Password: `bobo`
- **1-Click Demo Accounts**:
  - Student: `demo.student@kinya.ai` (password: `Demo1234!`)
  - Professional: `demo.professional@kinya.ai` (password: `Demo1234!`)

---

## 🛡️ Security & Privacy
- Passwords secured with bcrypt (`salt rounds = 10`).
- Protected endpoints guarded with JSON Web Tokens (JWT).
- Secure file upload handling with type validation and size limits.
- Strict `.gitignore` preventing `.env` and sensitive credentials from exposure.

---

## 🇷🇼 License
Developed for the Rwandan and global technology community. Licensed under the [MIT License](LICENSE).
