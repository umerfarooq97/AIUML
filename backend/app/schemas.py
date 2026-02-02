"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class SubscriptionPlan(str, Enum):
    """Subscription plan types"""
    FREE = "free"
    PRO = "pro"


class DiagramType(str, Enum):
    """UML diagram types"""
    CLASS = "class"
    SEQUENCE = "sequence"
    USECASE = "usecase"
    ACTIVITY = "activity"


# User Schemas
class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr


class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    subscription_plan: SubscriptionPlan
    created_at: datetime
    is_admin: bool = False
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Diagram Schemas
class DiagramCreate(BaseModel):
    """Schema for creating a new diagram"""
    prompt: str = Field(..., min_length=10, max_length=10000)
    diagram_type: Optional[DiagramType] = None
    title: Optional[str] = Field(None, max_length=255)


class DiagramSave(BaseModel):
    """Schema for saving a generated diagram"""
    prompt: str
    title: Optional[str] = None
    mermaid_code: str
    diagram_type: str


class DiagramResponse(BaseModel):
    """Schema for diagram response"""
    id: int
    user_id: int
    title: str
    prompt: str
    mermaid_code: str
    diagram_type: DiagramType
    created_at: datetime
    
    class Config:
        from_attributes = True


class DiagramGenerateResponse(BaseModel):
    """Schema for AI generation response"""
    mermaid_code: str
    diagram_type: DiagramType
    success: bool
    error: Optional[str] = None


class DiagramListResponse(BaseModel):
    """Schema for list of diagrams"""
    diagrams: list[DiagramResponse]
    total: int
    page: int
    page_size: int
