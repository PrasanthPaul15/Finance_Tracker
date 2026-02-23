# 💰 Finance Tracker

A full-stack personal finance tracker with React, FastAPI, PostgreSQL, and Grok AI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Recharts |
| Backend | FastAPI + SQLAlchemy |
| Database | PostgreSQL |
| AI | Grok API (xAI) |

---

## Prerequisites

Make sure you have these installed:
- **Node.js** v18+ (`node --version`)
- **Python** 3.10+ (`python --version`)
- **PostgreSQL** 14+ (running locally or remote)
- **Grok API Key** from [https://console.x.ai](https://console.x.ai)

---

## 🚀 Setup & Run

### Step 1: Clone / Extract the project

```bash
cd finance-tracker
```

---

### Step 2: Set up PostgreSQL

Create the database:

```bash
psql -U postgres
```

Inside psql:
```sql
CREATE DATABASE finance_tracker;
\q
```

---

### Step 3: Backend Setup

```bash
cd backend
```

Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Configure environment:
```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/finance_tracker
GROK_API_KEY=your_grok_api_key_here
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

✅ Backend is running at: http://localhost:8000  
📚 API Docs: http://localhost:8000/docs

---

### Step 4: Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend is running at: http://localhost:5173

---

## 🔑 Getting a Grok API Key

1. Visit [https://console.x.ai](https://console.x.ai)
2. Create an account / sign in
3. Go to **API Keys** → Generate a new key
4. Paste it in `backend/.env` as `GROK_API_KEY`

> Without the API key, the app still works — the AI features will just show a message saying the key is not configured.

---

## 📁 Project Structure

```
finance-tracker/
├── backend/
│   ├── main.py              # FastAPI app entry
│   ├── database.py          # DB connection & session
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   └── transaction.py   # SQLAlchemy models
│   └── routers/
│       ├── transactions.py  # CRUD endpoints
│       ├── analytics.py     # Summary & chart data
│       └── ai_insights.py   # Grok AI integration
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx           # App shell & routing
        ├── index.css         # Global styles
        ├── utils/api.js      # Axios API client
        └── pages/
            ├── Dashboard.jsx    # Summary stats + recent
            ├── Transactions.jsx # Full CRUD UI
            ├── Analytics.jsx    # Charts & graphs
            └── AIAssistant.jsx  # Grok AI chat
```

---

## 🌐 API Endpoints

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions/` | List all transactions |
| POST | `/api/transactions/` | Create transaction |
| PUT | `/api/transactions/{id}` | Update transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Income, expenses, balance |
| GET | `/api/analytics/by-category` | Grouped by category |
| GET | `/api/analytics/monthly` | Monthly breakdown |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/insights` | Get AI-generated tips |
| POST | `/api/ai/ask` | Ask the AI a question |

---

## 🛠 Troubleshooting

**CORS errors:** Make sure the backend is running on port 8000 and the frontend on 5173.

**Database connection fails:** Check your `DATABASE_URL` in `.env` — password and host must match your PostgreSQL setup.

**Grok API error:** Verify your API key is valid at console.x.ai and has credits.

**Tables not created:** The app auto-creates tables on startup via SQLAlchemy. Make sure the DB exists and the connection string is correct.
