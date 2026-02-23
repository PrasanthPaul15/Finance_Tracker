from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.transaction import Transaction, TransactionType
from models.user import User
from auth import get_current_user
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.x.ai/v1/chat/completions"

class AIQuery(BaseModel):
    question: str

from fastapi import HTTPException
from dotenv import load_dotenv
import httpx, os

load_dotenv()

async def call_groq(prompt: str):
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    headers = {
        "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            json=payload,
            headers=headers
        )

        data = response.json()
        print("Groq raw response:", data)

        if "choices" not in data:
            raise HTTPException(status_code=500, detail=data)

        return data["choices"][0]["message"]["content"]
    
@router.get("/insights")
async def get_ai_insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == TransactionType.income, Transaction.user_id == current_user.id
    ).scalar() or 0
    total_expenses = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == TransactionType.expense, Transaction.user_id == current_user.id
    ).scalar() or 0
    categories = db.query(Transaction.category, func.sum(Transaction.amount).label("total")).filter(
        Transaction.type == TransactionType.expense, Transaction.user_id == current_user.id
    ).group_by(Transaction.category).all()
    category_breakdown = ", ".join([f"{c.category}: ${c.total:.2f}" for c in categories])
    prompt = f"""You are a concise personal finance advisor. Analyze this financial data and give 3 brief actionable tips:
Total Income: ${total_income:.2f}
Total Expenses: ${total_expenses:.2f}
Net Balance: ${total_income - total_expenses:.2f}
Expense breakdown: {category_breakdown or 'No expense data yet'}
Respond in JSON format: {{"insights": ["tip1", "tip2", "tip3"]}}"""
    result = await call_groq(prompt)
    try:
        import json
        start = result.find('{'); end = result.rfind('}') + 1
        if start >= 0 and end > start:
            return json.loads(result[start:end])
    except:
        pass
    return {"insights": [result]}

@router.post("/ask")
async def ask_ai(query: AIQuery, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.date.desc()).limit(20).all()
    transaction_summary = "\n".join([
        f"- {t.type.value}: ${t.amount} for {t.title} ({t.category}) on {t.date.strftime('%Y-%m-%d')}"
        for t in transactions
    ])
    prompt = f"""You are a personal finance assistant. Here are recent transactions:
{transaction_summary or 'No transactions yet'}
User question: {query.question}
Give a helpful, concise answer (2-3 sentences max)."""
    result = await call_groq(prompt)
    return {"answer": result}
