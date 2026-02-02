"""
Diagram routes - Generate, Save, List, Delete diagrams
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import User, Diagram
from ..schemas import (
    DiagramCreate,
    DiagramSave,
    DiagramResponse,
    DiagramGenerateResponse,
    DiagramListResponse
)
from ..auth import get_current_user
from ..ai_engine import AIEngine

ai_engine = AIEngine()

router = APIRouter(prefix="/diagrams", tags=["Diagrams"])


@router.post("/generate", response_model=DiagramGenerateResponse)
def generate_uml_diagram(
    diagram_data: DiagramCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Generate UML diagram from prompt using AI
    
    Args:
        diagram_data: Diagram creation data (prompt, optional diagram_type)
        current_user: Current authenticated user
    
    Returns:
        Generated Mermaid code and diagram type
    """
    # TODO: Implement rate limiting for free users (5 diagrams per day)
    
    # Generate diagram using AI
    result = ai_engine.generate_uml(
        user_prompt=diagram_data.prompt,
        diagram_type=diagram_data.diagram_type.value if diagram_data.diagram_type else None
    )
    
    if not result.get("success", False):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate diagram: {result.get('error', 'Unknown error')}"
        )
    
    return DiagramGenerateResponse(
        mermaid_code=result["mermaid_code"],
        diagram_type=result["diagram_type"],
        success=True
    )


@router.post("/save", response_model=DiagramResponse, status_code=status.HTTP_201_CREATED)
def save_diagram(
    diagram_data: DiagramSave,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Save a generated diagram to database
    
    Args:
        diagram_data: Original diagram creation data
        mermaid_code: Generated Mermaid code
        diagram_type: Detected diagram type
        db: Database session
        current_user: Current authenticated user
    
    Returns:
        Saved diagram information
    """
    # Generate title if not provided
    title = diagram_data.title or f"Diagram - {diagram_data.prompt[:50]}"
    
    # Create new diagram
    new_diagram = Diagram(
        user_id=current_user.id,
        title=title,
        prompt=diagram_data.prompt,
        mermaid_code=diagram_data.mermaid_code,
        diagram_type=diagram_data.diagram_type
    )
    
    db.add(new_diagram)
    db.commit()
    db.refresh(new_diagram)
    
    return new_diagram


@router.get("/", response_model=DiagramListResponse)
def list_diagrams(
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all diagrams for current user with pagination
    
    Args:
        page: Page number (1-indexed)
        page_size: Number of items per page
        db: Database session
        current_user: Current authenticated user
    
    Returns:
        List of diagrams with pagination info
    """
    # Calculate offset
    offset = (page - 1) * page_size
    
    # Query diagrams
    query = db.query(Diagram).filter(Diagram.user_id == current_user.id)
    total = query.count()
    diagrams = query.order_by(Diagram.created_at.desc()).offset(offset).limit(page_size).all()
    
    return DiagramListResponse(
        diagrams=diagrams,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{diagram_id}", response_model=DiagramResponse)
def get_diagram(
    diagram_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific diagram by ID
    
    Args:
        diagram_id: Diagram ID
        db: Database session
        current_user: Current authenticated user
    
    Returns:
        Diagram information
    
    Raises:
        HTTPException: If diagram not found or unauthorized
    """
    diagram = db.query(Diagram).filter(
        Diagram.id == diagram_id,
        Diagram.user_id == current_user.id
    ).first()
    
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    return diagram


@router.delete("/{diagram_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_diagram(
    diagram_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a diagram
    
    Args:
        diagram_id: Diagram ID
        db: Database session
        current_user: Current authenticated user
    
    Raises:
        HTTPException: If diagram not found or unauthorized
    """
    diagram = db.query(Diagram).filter(
        Diagram.id == diagram_id,
        Diagram.user_id == current_user.id
    ).first()
    
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    db.delete(diagram)
    db.commit()
    
    return None
