from fastapi import APIRouter
from backend.core.models import MoveRequest, DifficultyRequest
from backend.services.game_service import (
    reset_game, get_state, player_move, set_game_difficulty, auto_player_move
)

router = APIRouter()

def response():
    s = get_state()
    return {
        "player": list(s.player),
        "enemy": list(s.enemy),
        "goal": list(s.goal),
        "maze": s.maze,
        "path": [list(x) for x in s.path],
        "explored": [list(x) for x in s.explored],
        "player_steps": s.player_steps,
        "enemy_steps": s.enemy_steps,
        "status": s.status,
        "message": s.message,
        "difficulty": s.difficulty,
        "depth": s.depth,
        "suggested_move": s.suggested_move,
        "predicted_enemy_move": s.predicted_enemy_move,
    }

@router.post("/start")
def start_game():
    reset_game()
    return response()

@router.post("/reset")
def reset():
    reset_game()
    return response()

@router.get("/state")
def state():
    return response()

@router.post("/move")
def move(request: MoveRequest):
    player_move(request.direction)
    return response()

@router.post("/difficulty")
def set_difficulty(request: DifficultyRequest):
    set_game_difficulty(request.level)
    return response()

@router.post("/auto-move")
def auto_move():
    auto_player_move()
    return response()
