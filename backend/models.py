from pydantic import BaseModel
from typing import Optional

class TermRequest(BaseModel):
    """Request model for medical term explanation"""
    term: str

class ExplanationResponse(BaseModel):
    """Response model for medical term explanation"""
    explanation: str

class ImageExplorationResponse(BaseModel):
    """Response model for medical image exploration"""
    image_description: str
    answer: Optional[str] = None
