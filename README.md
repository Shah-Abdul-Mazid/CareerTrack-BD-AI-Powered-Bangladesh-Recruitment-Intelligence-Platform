# 🎯 CareerTrack BD — AI-Powered Bangladesh Recruitment Intelligence Platform

A modern, production-grade **Recruitment Management & Examination Intelligence System** engineered specifically for Bangladesh job seekers, government recruitment candidates (Bangladesh Bank, BPSC, Combined Banks/BSCS, Ministries), and IT professionals.

Built with **FastAPI**, **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **SQLAlchemy 2.0 / MongoDB**, and **Docker**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bd--niyog--chakri--ledger-10b981?style=for-the-badge&logo=vercel)](https://bd-niyog-chakri-ledger-jobplanner-schedule.vercel.app/)
[![Portfolio Case Study](https://img.shields.io/badge/Author%20Case%20Study-shahabdulmazidezan.me-6366f1?style=for-the-badge&logo=safari)](https://www.shahabdulmazidezan.me/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Shah-Abdul-Mazid/Job-Planner)

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker&logoColor=white)
![OAuth2 / 2FA](https://img.shields.io/badge/Auth-OAuth2%20%2B%202FA%20OTP-7c3aed?style=flat-square&logo=shield&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

---

## 📌 Executive Summary

Government and bank recruitment in Bangladesh (e.g. Bangladesh Bank eRecruitment, Combined 8/10 Banks, BPSC) involves complex application workflows: candidates juggle dozens of separate **Tracking IDs**, **Roll Numbers**, multi-bank preference lists, rolling admit card downloads, and venue seat plans announced only days before preliminary or written exams.

**CareerTrack BD** solves this fragmentation through an automated, secure, all-in-one portal:
- **Centralized Application Lifecycle**: Track circulars, deadlines, payment verification, roll assignments, and exam stages across all major statutory institutions.
- **AI Document Parsing**: Ingest official recruitment circular and admit card PDFs to extract candidate credentials, tracking tokens, and reporting schedules.
- **Seat Plan & Roll-Range Mapping**: Instantly match assigned roll ranges to exam centers, sub-centers, and hall numbers with countdown reporting timers.
- **Enterprise-Grade Security**: 2-Factor Authentication (OAuth2 6-digit OTP delivery via Gmail SMTP / Resend API and Twilio SMS), dynamic password entropy validation, and isolated guest sandbox modes.

---

## 🌟 Key Technical Highlights & Engineering Feats

### 1. Dual-Channel 2FA OTP Authentication
- Secure authentication pipeline issuing cryptographic 6-digit one-time passcodes with expiration countdowns.
- Multi-provider fallback: Primary enterprise delivery via **Gmail SMTP SSL/TLS (port 465/587)**, **Resend API**, and international **Twilio SMS** dispatch with automatic Bangladesh E.164 phone normalization (`+880`).

### 2. Strict Real-Time Password Policy Engine & Hard Gates
- Enforces strict security standards (configurable **8 to 30 characters**, uppercase, lowercase, numbers, and symbols).
- **Anti-Pitfall Guard**: Rejects sequential numbers (e.g., `123`, `789`), keyboard walks (e.g., `qwerty`, `asdfgh`), 3+ repeated characters (e.g., `aaa`), and dynamically inspects against user personal details (applicant name tokens, email prefix, phone digits).
- **Live Interactive Checklist**: Keystroke-level visual audit updating strength scores (0–100%) and individual rule verification.
- **Cryptographic Passphrase Generator**: One-click generation of high-entropy compliant passphrases (e.g., `Nova#Jade7Star`).
- **Hard Gate Protection**: UI buttons and event handlers enforce hard gates to prevent bypass via keyboard Enter or DOM manipulation.

### 3. Role-Based Access & Guest Sandbox Isolation
- **Explore as Guest Mode**: Allows recruiters and visitors to evaluate full dashboard metrics, application grids, and filtering systems without persistent account creation.
- Session isolation ensures guest actions do not contaminate live database records.

### 4. End-to-End Type Safety & Modern Architecture
- Strict Pydantic v2 schemas serialize and validate all inbound REST payloads.
- TypeScript interfaces on the client guarantee zero-drift contract alignment with backend responses.

---

## 🏗️ System Architecture

```text
Job Planner/
├── Backend/                       # FastAPI REST API & SQLAlchemy 2.0 ORM
│   ├── app/
│   │   ├── core/                  # Security (JWT, bcrypt), config, email (SMTP/Resend), SMS (Twilio)
│   │   ├── models/                # SQLAlchemy & Pydantic recruitment models
│   │   ├── schemas/               # Request/Response schemas with validation
│   │   ├── modules/applications/  # Service & Repository layer pattern for CRUD
│   │   ├── api/v1/routes/         # Versioned REST endpoints (/auth, /applications, /stats)
│   │   ├── seed_data.py           # Pre-seeded Bangladesh bank recruitment datasets
│   │   └── main.py                # FastAPI entry point, middleware & CORS configuration
│   ├── migrations/                # Alembic migration management
│   ├── tests/                     # Pytest suite for API endpoints & business logic
│   ├── requirements.txt           # Python dependencies
│   └── Dockerfile                 # Multi-stage production container
│
├── Frontend/                      # React 18+ + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/            # Reusable UI (AuthModal, PasswordChecklist, StatCards, Modals)
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx       # Auth gateway, 2FA OTP verification & reset workflows
│   │   │   ├── Dashboard.tsx      # Recruitment KPIs, pipeline charts & recent activity feeds
│   │   │   ├── Applications.tsx   # Advanced filterable application tracking table
│   │   │   └── PhasePreviews.tsx  # Exam Seat Plans, Document Vault, AI Assistant previews
│   │   ├── utils/
│   │   │   └── passwordPolicy.ts  # Entropy scoring, regex validation, passphrase generator
│   │   ├── services/api.ts        # Axios API client with bearer token interception
│   │   ├── types/index.ts         # TypeScript domain contracts
│   │   └── App.tsx                # App layout, responsive sidebar & navigation shell
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── packages/
│   └── bdjobtracker/              # Standalone Python recruitment toolkit (ready for PyPI)
│
├── docker-compose.yml             # Container orchestration (PostgreSQL, Backend, Frontend)
├── .env.example                   # Environment variable template
└── README.md                      # Project documentation
```

---

## 📋 Pre-Seeded Real Recruitment Records

The system includes pre-seeded live application records representing actual Bangladesh recruitment fixtures:

| Organization | Designation | Grade | Job ID | Tracking ID / Roll | Status |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Bangladesh Bank** | Senior Officer | Grade 9 | `26101` | Roll: `116683` | `Admit Card Available` (Schedule Pending) |
| **Sonali Bank PLC** | Assistant Database Administrator | Grade 9 | `26109` | `2052062-838456` / Roll: `338528` | `Submitted` |
| **Combined 10 Banks / BSCS** | Officer (IT) / MIS & ICT Officer | Grade 10 | `26105` | `2052062-932886` | `Submitted` (7-Bank Preference List) |
| **Combined 8 Banks / BSCS** | Senior Officer (IT) | Grade 9 | `26104` | `2052062-394651` | `Submitted` (4-Bank Preference List) |

---

## 🚀 Getting Started Locally

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & **npm**
- **Docker** & **Docker Compose** (optional)

---

### 1. Backend Setup (FastAPI)

```bash
# Navigate to Backend directory
cd Backend

# Create and activate virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\Activate.ps1
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- **API Base URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **Alternative ReDoc**: `http://127.0.0.1:8000/redoc`

---

### 2. Frontend Setup (React + Vite)

In a separate terminal:

```bash
# Navigate to Frontend directory
cd Frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```

- **Frontend Application**: `http://localhost:5173`

---

### 3. Automated Test Suite

```bash
cd Backend
pytest tests/ -v
```

---

### 4. Running with Docker Compose

Spin up the entire stack (PostgreSQL database, FastAPI backend, and React frontend) with a single command:

```bash
docker-compose up --build
```

---

## 🛡️ Security & Quality Standards

- **OAuth2 with Bearer Tokens**: Stateless JWT session tokens with strict expiration and cryptographic validation.
- **Secure Password Hashing**: Passwords stored via salted bcrypt hashes (`passlib`).
- **Input Sanitization & Validation**: Dual-layer input validation via Pydantic on the server and regex policies on the client.
- **Environment Isolation**: Sensitive credentials (API keys, SMTP passwords, database URLs) managed via `.env` files with git push protection.

---

## 👨‍💻 Author & Contact

**Shah Abdul Mazid (Ezan)**  
*Full Stack Software Engineer & AI Systems Developer*

- **Live Application**: [CareerTrack BD on Vercel](https://bd-niyog-chakri-ledger-jobplanner-schedule.vercel.app/)
- **Portfolio**: [shahabdulmazidezan.me](https://www.shahabdulmazidezan.me/)
- **GitHub**: [@Shah-Abdul-Mazid](https://github.com/Shah-Abdul-Mazid)
- **Repository**: [Job-Planner](https://github.com/Shah-Abdul-Mazid/Job-Planner)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
