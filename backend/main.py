import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import transactions, analytics, ai_insights, auth
from database import engine, Base
import models.user
import models.transaction

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finance Tracker API", version="1.0.0")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(ai_insights.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
def root():
    return {"message": "Finance Tracker API is running"}
