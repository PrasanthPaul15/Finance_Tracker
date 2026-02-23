from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from database import get_db
from models.transaction import Transaction, TransactionType
from models.user import User
from auth import get_current_user

router = APIRouter()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == TransactionType.income,
        Transaction.user_id == current_user.id
    ).scalar() or 0

    total_expenses = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == TransactionType.expense,
        Transaction.user_id == current_user.id
    ).scalar() or 0

    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "net_balance": round(total_income - total_expenses, 2),
        "savings_rate": round((total_income - total_expenses) / total_income * 100, 1) if total_income > 0 else 0
    }

@router.get("/by-category")
def get_by_category(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = db.query(
        Transaction.category,
        Transaction.type,
        func.sum(Transaction.amount).label("total")
    ).filter(Transaction.user_id == current_user.id).group_by(Transaction.category, Transaction.type).all()
    return [{"category": r.category, "type": r.type, "total": round(r.total, 2)} for r in results]

@router.get("/monthly")
def get_monthly(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = db.query(
        extract('year', Transaction.date).label('year'),
        extract('month', Transaction.date).label('month'),
        Transaction.type,
        func.sum(Transaction.amount).label("total")
    ).filter(Transaction.user_id == current_user.id).group_by('year', 'month', Transaction.type).order_by('year', 'month').all()

    monthly = {}
    for r in results:
        key = f"{int(r.year)}-{int(r.month):02d}"
        if key not in monthly:
            monthly[key] = {"month": key, "income": 0, "expenses": 0}
        if r.type == TransactionType.income:
            monthly[key]["income"] = round(r.total, 2)
        else:
            monthly[key]["expenses"] = round(r.total, 2)
    return list(monthly.values())
