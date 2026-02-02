from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

# Admin Dependency
def get_current_admin(current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    total_users = db.query(models.User).count()
    total_diagrams = db.query(models.Diagram).count()
    pro_users = db.query(models.User).filter(models.User.subscription_plan == models.SubscriptionPlan.PRO).count()
    
    # Diagrams by type
    diagrams_by_type = db.query(
        models.Diagram.diagram_type, 
        func.count(models.Diagram.id)
    ).group_by(models.Diagram.diagram_type).all()
    
    # Recent activity (last 5 diagrams)
    recent_diagrams = db.query(models.Diagram)\
        .order_by(models.Diagram.created_at.desc())\
        .limit(5)\
        .all()
    
    recent_activity = []
    for d in recent_diagrams:
        user = db.query(models.User).filter(models.User.id == d.user_id).first()
        recent_activity.append({
            "id": d.id,
            "title": d.title,
            "type": d.diagram_type,
            "created_at": d.created_at,
            "user_email": user.email if user else "Unknown"
        })

    return {
        "total_users": total_users,
        "total_diagrams": total_diagrams,
        "pro_users": pro_users,
        "diagrams_by_type": {type_: count for type_, count in diagrams_by_type},
        "recent_activity": recent_activity
    }

@router.get("/users", response_model=List[schemas.UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
