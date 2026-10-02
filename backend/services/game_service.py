from backend.algorithms.astar import astar
from backend.algorithms.minimax import minimax
from backend.core.game_state import game_state
from backend.core.maze import move_position, neighbors

def serialize_position(pos):
    return [pos[0], pos[1]]

def calculate_path():
    path, explored = astar(
        game_state.maze,
        game_state.player,
        game_state.goal
    )
    game_state.path = path
    game_state.explored = explored

def update_status():
    if game_state.player == game_state.goal:
        game_state.status = "won"
        game_state.message = "Player reached the goal!"
    elif game_state.player == game_state.enemy:
        game_state.status = "lost"
        game_state.message = "Enemy caught the player!"

def suggest_player_move():
    calculate_path()
    if len(game_state.path) >= 2:
        current = game_state.path[0]
        nxt = game_state.path[1]
        dr = nxt[0] - current[0]
        dc = nxt[1] - current[1]
        if dr == -1: return "UP"
        if dr == 1: return "DOWN"
        if dc == -1: return "LEFT"
        if dc == 1: return "RIGHT"
    return None

def predict_enemy():
    _, move = minimax(
        game_state.maze,
        game_state.player,
        game_state.enemy,
        game_state.goal,
        game_state.depth,
        True
    )
    game_state.predicted_enemy_move = move
    return move

def make_enemy_move():
    if game_state.status != "running":
        return

    _, move = minimax(
        game_state.maze,
        game_state.player,
        game_state.enemy,
        game_state.goal,
        game_state.depth,
        True
    )

    if move:
        new_pos = move_position(game_state.maze, game_state.enemy, move)
        if new_pos != game_state.enemy:
            game_state.enemy = new_pos
            game_state.enemy_steps += 1

    game_state.predicted_enemy_move = move
    update_status()

def set_game_difficulty(level: str):
    game_state.set_difficulty(level)
    if game_state.status == "running":
        game_state.predicted_enemy_move = predict_enemy()
    return game_state

def reset_game():
    game_state.reset()
    calculate_path()
    game_state.suggested_move = suggest_player_move()
    game_state.predicted_enemy_move = predict_enemy()
    return game_state

def get_state():
    calculate_path()
    game_state.suggested_move = suggest_player_move()
    if game_state.status == "running":
        game_state.predicted_enemy_move = predict_enemy()
    return game_state

def player_move(direction):
    if game_state.status != "running":
        return game_state

    old = game_state.player
    new = move_position(game_state.maze, old, direction.upper())

    if new == old:
        game_state.message = "That move is blocked."
        return get_state()

    game_state.player = new
    game_state.player_steps += 1
    game_state.message = f"Player moved {direction.upper()}"

    update_status()

    if game_state.status == "running":
        make_enemy_move()

    calculate_path()
    game_state.suggested_move = suggest_player_move()

    if game_state.status == "running":
        game_state.predicted_enemy_move = predict_enemy()

    return game_state
