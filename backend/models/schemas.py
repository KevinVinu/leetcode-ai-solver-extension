from pydantic import BaseModel, Field

class SolveRequest(BaseModel):
    title: str = Field(..., example="Two Sum")
    description: str = Field(..., example="Given an array of integers nums and an integer target...")
    language: str = Field(..., example="python")

class SolveResponse(BaseModel):
    solution: str
    success: bool
    error: str = None
