# AI Maze Escape — Project Notes

## Team Division

1. Frontend:
   - HTML/CSS/JavaScript
   - Maze rendering
   - HUD
   - Controls
   - Action log

2. A*:
   - astar.py
   - Manhattan heuristic
   - path reconstruction
   - A* tests

3. Minimax:
   - minimax.py
   - evaluation function
   - enemy prediction
   - Minimax tests

4. Backend/Integration:
   - FastAPI
   - GameState
   - API integration
   - testing
   - merge/integration

## API

POST /api/game/start
POST /api/game/reset
GET  /api/game/state
POST /api/game/move
POST /api/astar/path
POST /api/minimax/predict
