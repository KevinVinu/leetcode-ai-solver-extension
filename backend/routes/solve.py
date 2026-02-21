from fastapi import APIRouter, HTTPException
from models.schemas import SolveRequest, SolveResponse
from services.openrouter_service import OpenRouterService

router = APIRouter()

@router.post("/solve", response_model=SolveResponse)
async def solve_problem(request: SolveRequest):
    try:
        solution = await OpenRouterService.get_solution(
            request.title, 
            request.description, 
            request.language
        )
        return SolveResponse(solution=solution, success=True)
    except Exception as e:
        return SolveResponse(solution="", success=False, error=str(e))
