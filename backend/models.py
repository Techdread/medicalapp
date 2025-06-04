from pydantic import BaseModel

class TermRequest(BaseModel):
    term: str

class ExplanationResponse(BaseModel):
    explanation: str
