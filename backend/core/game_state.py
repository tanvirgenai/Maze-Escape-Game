from copy import deepcopy
from backend.core.maze import DEFAULT_MAZE, START, GOAL, ENEMY_START

class GameState:
    def __init__(self):
        self.reset()

    def reset(self):
        self.maze = deepcopy(DEFAULT_MAZE)
        self.player = START
        self.enemy = ENEMY_START
        self.goal = GOAL
        self.path = []
        self.explored = []
        self.player_steps = 0
        self.enemy_steps = 0
        self.status = "running"
        self.message = "Game started"
        self.suggested_move = None
        self.predicted_enemy_move = None

game_state = GameState()
