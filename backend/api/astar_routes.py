from fastapi import APIRouter
from backend.core.models import AStarRequest
from backend.algorithms.astar import astar

router = APIRouter()

@router.post("/path")
def calculate(request: AStarRequest):
    path, explored = astar(
        request.maze,
        tuple(request.start),
        tuple(request.goal)
    )
    return {
        "path": [list(x) for x in path],
        "cost": max(0, len(path) - 1),
        "explored": [list(x) for x in explored],
    }
