import random

def generate_maze(rows=15, cols=15):
    # Initialize maze with all walls
    maze = [[1 for _ in range(cols)] for _ in range(rows)]

    DIRS = [(0, 2), (0, -2), (2, 0), (-2, 0)]

    def carve_path(r, c):
        maze[r][c] = 0
        # Use a local shuffled copy — avoids mutation bug during recursion
        directions = DIRS[:]
        random.shuffle(directions)
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 < nr < rows - 1 and 0 < nc < cols - 1 and maze[nr][nc] == 1:
                maze[r + dr // 2][c + dc // 2] = 0
                carve_path(nr, nc)

    carve_path(1, 1)

    # Always keep key positions open
    maze[1][1] = 0    # Player start
    maze[13][1] = 0   # Enemy start
    maze[13][13] = 0  # Goal

    # Add extra open cells for multiple paths
    for _ in range(12):
        rr = random.randrange(1, rows - 1)
        rc = random.randrange(1, cols - 1)
        maze[rr][rc] = 0

    return maze

START = (1, 1)
GOAL = (13, 13)
ENEMY_START = (13, 1)

DIRECTIONS = {
    "UP": (-1, 0),
    "DOWN": (1, 0),
    "LEFT": (0, -1),
    "RIGHT": (0, 1),
}

def in_bounds(maze, pos):
    r, c = pos
    return 0 <= r < len(maze) and 0 <= c < len(maze[0])

def is_walkable(maze, pos):
    return in_bounds(maze, pos) and maze[pos[0]][pos[1]] == 0

def neighbors(maze, pos):
    result = []
    for name, (dr, dc) in DIRECTIONS.items():
        nxt = (pos[0] + dr, pos[1] + dc)
        if is_walkable(maze, nxt):
            result.append((name, nxt))
    return result

def move_position(maze, pos, direction):
    if direction not in DIRECTIONS:
        return pos
    dr, dc = DIRECTIONS[direction]
    nxt = (pos[0] + dr, pos[1] + dc)
    return nxt if is_walkable(maze, nxt) else pos
