import heapq
from backend.core.maze import neighbors

def manhattan(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def reconstruct_path(came_from, current):
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    path.reverse()
    return path

def astar(maze, start, goal):
    if start == goal:
        return [start], [start]

    heap = [(manhattan(start, goal), 0, start)]
    came_from = {}
    g_score = {start: 0}
    explored = []
    visited = set()

    while heap:
        _, current_g, current = heapq.heappop(heap)

        if current in visited:
            continue
        visited.add(current)
        explored.append(current)

        if current == goal:
            return reconstruct_path(came_from, current), explored

        for _, nxt in neighbors(maze, current):
            new_g = current_g + 1
            if new_g < g_score.get(nxt, float("inf")):
                g_score[nxt] = new_g
                came_from[nxt] = current
                f = new_g + manhattan(nxt, goal)
                heapq.heappush(heap, (f, new_g, nxt))

    return [], explored
