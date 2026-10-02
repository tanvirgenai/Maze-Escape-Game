from backend.algorithms.astar import astar

def test_astar_finds_path():
    maze = [
        [0, 0, 0],
        [1, 1, 0],
        [0, 0, 0],
    ]
    path, explored = astar(maze, (0, 0), (2, 2))
    assert path[0] == (0, 0)
    assert path[-1] == (2, 2)
    assert len(path) > 0

def test_astar_no_path():
    maze = [
        [0, 1],
        [1, 0],
    ]
    path, _ = astar(maze, (0, 0), (1, 1))
    assert path == []
