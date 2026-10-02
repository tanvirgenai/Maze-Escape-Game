# AI Maze Escape

AI Maze Escape is a web-based AI maze game.

- **Player:** A* pathfinding
- **Enemy:** Minimax decision-making
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python + FastAPI
- **Version Control:** Git + GitHub

## Project Structure

```text
AI-Maze-Escape/
├── frontend/
├── backend/
│   ├── api/
│   ├── algorithms/
│   ├── core/
│   └── services/
├── tests/
├── README.md
└── requirements.txt
```

## Dependencies

```txt
fastapi
uvicorn[standard]
pydantic
```

## Run Backend

```bash
cd AI-Maze-Escape
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload
```

Windows:

```bash
venv\Scripts\activate
```

API docs:

```text
http://127.0.0.1:8000/docs
```

## Run Frontend

Open `frontend/index.html` in a browser.

For best browser compatibility, serve the frontend with a simple local server:

```bash
cd frontend
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

## Git Branches

```text
main
├── feature/astar
└── feature/minimax
```

A* work:

```bash
git checkout -b feature/astar
git add .
git commit -m "Implement A* pathfinding"
git push origin feature/astar
```

Minimax work:

```bash
git checkout main
git checkout -b feature/minimax
git add .
git commit -m "Implement Minimax enemy AI"
git push origin feature/minimax
```

## Game Flow

```text
Frontend
   ↓
FastAPI
   ↓
Game Service
   ├── A* → Player path
   └── Minimax → Enemy decision
   ↓
Game State
   ↓
Frontend
```

Keep algorithm code separate from the frontend so each team member can develop and test independently.
