from fastapi import APIRouter
from backend.core.models import MinimaxRequest
from backend.algorithms.minimax import minimax

router = APIRouter()

@router.post("/predict")
def predict(request: MinimaxRequest):
    value, move = minimax(
        request.maze,
        tuple(request.player),
        tuple(request.enemy),
        tuple(request.goal),
        request.depth,
        True
    )
    return {
        "next_move": move,
        "value": value,
        "depth": request.depth,
    }
