# 🚀 Free Deployment Guide — Render.com

This guide walks you through deploying your Finance Tracker **100% free** using:

| Service | Platform | Free Limits |
|---------|----------|------------|
| **Frontend** (React) | Render Static Site | Unlimited, free forever |
| **Backend** (FastAPI) | Render Web Service | 750 hrs/month free |
| **Database** (PostgreSQL) | Render Postgres | 1GB, expires every 30 days* |

> ⚠️ **Important**: Render's free PostgreSQL expires every 30 days. You'll need to create a new free DB monthly (and re-add the connection string), OR upgrade to $7/month for a permanent DB. For a personal/hobby tracker this is totally workable.

---

## Step 1 — Push your code to GitHub

Render deploys directly from GitHub.

```bash
# Inside the finance-tracker folder
git init
git add .
git commit -m "Initial commit"
```

Create a new repo at [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/finance-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Create a Render account

Go to [render.com](https://render.com) and sign up for free (no credit card needed).

---

## Step 3 — Create the PostgreSQL Database

1. In your Render dashboard, click **New → PostgreSQL**
2. Set:
   - **Name**: `finance-tracker-db`
   - **Database**: `finance_tracker`
   - **Region**: Choose closest to you
   - **Instance Type**: **Free**
3. Click **Create Database**
4. Once created, go to the database page and copy the **Internal Database URL** — you'll need it in Step 4.

---

## Step 4 — Deploy the Backend (FastAPI)

1. Click **New → Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `finance-tracker-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

4. Add **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | *(paste the Internal DB URL from Step 3)* |
   | `GROK_API_KEY` | *(your Grok API key from console.x.ai)* |
   | `ALLOWED_ORIGINS` | *(leave blank for now, update after Step 5)* |

5. Click **Create Web Service**

6. Wait for it to deploy (~2 min). Copy your backend URL, e.g.:
   `https://finance-tracker-backend.onrender.com`

---

## Step 5 — Deploy the Frontend (React)

1. Click **New → Static Site**
2. Connect the same GitHub repo
3. Configure:
   - **Name**: `finance-tracker-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `VITE_BACKEND_URL` | `https://finance-tracker-backend.onrender.com` |

5. Click **Create Static Site**

Your frontend URL will be something like:
`https://finance-tracker-frontend.onrender.com`

---

## Step 6 — Fix CORS (allow your frontend)

Go back to your **backend Web Service** → Environment tab, and update:

| Key | Value |
|-----|-------|
| `ALLOWED_ORIGINS` | `https://finance-tracker-frontend.onrender.com` |

Click **Save Changes** — the backend will redeploy automatically.

---

## ✅ Your app is live!

Visit `https://finance-tracker-frontend.onrender.com` — everything should be working.

---

## ⚠️ Free Tier Gotchas

**Backend sleeps after 15 min of inactivity** — the first request after sleep takes ~30 seconds to wake up. This is normal on the free tier.

**Database expires after 30 days** — Render will email you before it expires. To renew:
1. Go to Render dashboard → create a new Free PostgreSQL
2. Copy the new Internal URL
3. Update the `DATABASE_URL` env var on your backend service
4. Redeploy

**Alternatively**, use [Supabase](https://supabase.com) for a truly free permanent PostgreSQL (see below).

---

## 🆚 Alternative: Supabase for Permanent Free DB

[Supabase](https://supabase.com) offers a **permanent free PostgreSQL** (500MB, no expiry) — great for this use case.

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database**
3. Copy the **Connection String** (URI format)
4. Replace `DATABASE_URL` in Render with the Supabase URL

The format will be:
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

---

## 🗺️ Summary: What Goes Where

```
GitHub Repo
    │
    ├── frontend/ ──────→ Render Static Site (free forever)
    │                      URL: finance-tracker-frontend.onrender.com
    │
    └── backend/  ──────→ Render Web Service (750 hrs/month free)
                           URL: finance-tracker-backend.onrender.com
                                      │
                                      └── PostgreSQL DB (Render free / Supabase)
```
