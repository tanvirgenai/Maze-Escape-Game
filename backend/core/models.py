from pydantic import BaseModel, Field
from typing import List, Tuple, Optional

class MoveRequest(BaseModel):
    direction: str

class AStarRequest(BaseModel):
    maze: List[List[int]]
    start: Tuple[int, int]
    goal: Tuple[int, int]

class MinimaxRequest(BaseModel):
    maze: List[List[int]]
    player: Tuple[int, int]
    enemy: Tuple[int, int]
    goal: Tuple[int, int]
    depth: int = Field(default=3, ge=1, le=5)

class DifficultyRequest(BaseModel):
    level: str

class GameStateResponse(BaseModel):
    player: Tuple[int, int]
    enemy: Tuple[int, int]
    goal: Tuple[int, int]
    maze: List[List[int]]
    path: List[Tuple[int, int]]
    explored: List[Tuple[int, int]]
    player_steps: int
    enemy_steps: int
    status: str
    message: str
    difficulty: str
    depth: int
    suggested_move: Optional[str] = None
    predicted_enemy_move: Optional[str] = None
