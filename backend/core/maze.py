DEFAULT_MAZE = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
    [1,1,1,1,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

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
