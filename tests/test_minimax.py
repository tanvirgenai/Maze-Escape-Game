from backend.algorithms.minimax import minimax

def test_minimax_returns_legal_move():
    maze = [
        [0,0,0],
        [0,0,0],
        [0,0,0],
    ]
    value, move = minimax(
        maze,
        (0,0),
        (2,2),
        (0,2),
        2,
        True
    )
    assert move in {"UP", "DOWN", "LEFT", "RIGHT"}
