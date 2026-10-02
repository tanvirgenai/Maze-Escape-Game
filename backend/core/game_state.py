from copy import deepcopy
from backend.core.maze import generate_maze, START, GOAL, ENEMY_START

class GameState:
    def __init__(self):
        self.reset()

    def reset(self):
        self.maze = generate_maze()
        self.player = START
        self.enemy = ENEMY_START
        self.goal = GOAL
        self.path = []
        self.explored = []
        self.player_steps = 0
        self.enemy_steps = 0
        self.status = "running"
        self.message = "Game started"
        self.difficulty = "medium"
        self.depth = 3
        self.suggested_move = None
        self.predicted_enemy_move = None

    def set_difficulty(self, level: str):
        level = level.lower()
        if level == "easy":
            self.difficulty = "easy"
            self.depth = 1
        elif level == "hard":
            self.difficulty = "hard"
            self.depth = 5
        else:
            self.difficulty = "medium"
            self.depth = 3

game_state = GameState()
