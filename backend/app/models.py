"""
SQLAlchemy database models
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base


class SubscriptionPlan(str, enum.Enum):
    """Subscription plan types"""
    FREE = "free"
    PRO = "pro"


class DiagramType(str, enum.Enum):
    """UML diagram types"""
    CLASS = "class"
    SEQUENCE = "sequence"
    USECASE = "usecase"
    ACTIVITY = "activity"


class User(Base):
    """User model for authentication and profile"""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    subscription_plan = Column(
        Enum(SubscriptionPlan),
        default=SubscriptionPlan.FREE,
        nullable=False
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    diagrams = relationship("Diagram", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, plan={self.subscription_plan})>"


class Diagram(Base):
    """Diagram model for storing generated UML diagrams"""
    
    __tablename__ = "diagrams"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    prompt = Column(Text, nullable=False)
    mermaid_code = Column(Text, nullable=False)
    diagram_type = Column(
        Enum(DiagramType),
        default=DiagramType.CLASS,
        nullable=False
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="diagrams")
    
    def __repr__(self):
        return f"<Diagram(id={self.id}, title={self.title}, type={self.diagram_type})>"
