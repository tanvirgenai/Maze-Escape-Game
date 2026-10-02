from backend.core.maze import neighbors

def distance(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def evaluate(player, enemy, goal):
    if player == enemy:
        return 10000
    # Enemy wants to get close to player, while the player wants to get
    # close to the goal. Positive values favor the Enemy.
    enemy_player = distance(enemy, player)
    player_goal = distance(player, goal)
    return -enemy_player + 0.15 * player_goal

def minimax(maze, player, enemy, goal, depth, maximizing=True):
    if depth == 0 or player == enemy:
        return evaluate(player, enemy, goal), None

    if maximizing:
        best_value = float("-inf")
        best_move = None

        for move, next_enemy in neighbors(maze, enemy):
            value, _ = minimax(
                maze, player, next_enemy, goal,
                depth - 1, False
            )
            if value > best_value:
                best_value = value
                best_move = move

        return best_value, best_move

    best_value = float("inf")
    best_move = None

    for move, next_player in neighbors(maze, player):
        value, _ = minimax(
            maze, next_player, enemy, goal,
            depth - 1, True
        )
        if value < best_value:
            best_value = value
            best_move = move

    return best_value, best_move
