from backend.core.maze import neighbors
from collections import deque

def distance(a, b):
    """Left completely untouched for GitHub compatibility."""
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def evaluate(player, enemy, goal):
    """Left completely untouched for GitHub compatibility."""
    if player == enemy:
        return 10000
    enemy_player = distance(enemy, player)
    player_goal = distance(player, goal)
    return -enemy_player + 0.15 * player_goal

# NEW HELPER: Finds the true distance around walls
def bfs_distance(maze, start, target):
    queue = deque([(start, 0)])
    visited = {start}
    
    while queue:
        current, dist = queue.popleft()
        if current == target:
            return dist
        
        # Uses your existing neighbors function to safely route around walls
        for move, nxt in neighbors(maze, current):
            if nxt not in visited:
                visited.add(nxt)
                queue.append((nxt, dist + 1))
                
    return float('inf')

# UPDATED: Alpha and beta added as optional defaults so existing calls don't break
def minimax(maze, player, enemy, goal, depth, maximizing=True, alpha=float("-inf"), beta=float("inf")):
    if depth == 0 or player == enemy:
        # WALL FIX: We calculate the true score here since the original evaluate() 
        # doesn't have access to the 'maze' variable to see the walls.
        if player == enemy:
            score = 10000
        else:
            enemy_player = bfs_distance(maze, enemy, player)
            player_goal = bfs_distance(maze, player, goal)
            score = -enemy_player + 0.15 * player_goal
            
        return score, None

    if maximizing:
        best_value = float("-inf")
        best_move = None

        for move, next_enemy in neighbors(maze, enemy):
            value, _ = minimax(
                maze, player, next_enemy, goal,
                depth - 1, False, alpha, beta
            )
            if value > best_value:
                best_value = value
                best_move = move
                
            # Alpha-Beta Pruning implementation[cite: 4]
            alpha = max(alpha, best_value)
            if beta <= alpha:
                break # Prune the remaining branches

        return best_value, best_move

    # Minimizing side (Player)
    best_value = float("inf")
    best_move = None

    for move, next_player in neighbors(maze, player):
        value, _ = minimax(
            maze, next_player, enemy, goal,
            depth - 1, True, alpha, beta
        )
        if value < best_value:
            best_value = value
            best_move = move
            
        # Alpha-Beta Pruning implementation[cite: 4]
        beta = min(beta, best_value)
        if beta <= alpha:
            break # Prune the remaining branches

    return best_value, best_move