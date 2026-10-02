# 🌀 AI Maze Escape Game

An intelligent, full-stack maze navigation and escape game powered by artificial intelligence algorithms. The player navigates through procedurally generated mazes while evading an AI-controlled enemy, supported by real-time heuristic search algorithms, procedural audio, and an interactive dashboard.

---

## 🌟 Key Features

### 🧠 Artificial Intelligence & Algorithms
- **A\* Pathfinding Algorithm:** Computes the optimal shortest path from player to goal using Manhattan distance heuristic. Supports real-time path recalculation and step-by-step suggestions.
- **Minimax with Alpha-Beta Pruning:** Powers the intelligent enemy chaser. Recursively evaluates future game states to intercept the player while pruning suboptimal branches for optimal performance.
- **BFS True Distance Heuristic:** Uses Breadth-First Search to calculate true traversable distance around maze walls, preventing the enemy from getting trapped behind obstacles.
- **Auto-Play Mode:** Autonomous gameplay mode where the A\* algorithm navigates the maze in real time without human intervention.
- **Dynamic Procedural Maze Generation:** Generates fresh, fully-connected, and solvable 15×15 mazes on every reset using randomized Depth-First Search (DFS) backtracking with auxiliary open paths.

### 🎮 Gameplay & Interface
- **Dynamic Difficulty Levels:**
  - **Easy:** Minimax search depth = 1 (relaxed chase)
  - **Medium:** Minimax search depth = 3 (balanced chase)
  - **Hard:** Minimax search depth = 5 (aggressive chase)
- **Modern 3-Column Dashboard:**
  - **Left Panel:** Game status badges, active difficulty selectors, directional D-Pad, and reset/auto controls.
  - **Center Panel:** 15×15 interactive maze board with coordinate headers, animated sprites, and glowing goal tiles.
  - **Right Panel:** HTML5 Canvas minimap with live player/enemy pings, next-move prediction arrows, algorithm details, and timestamped action logs.
- **Scoring & High Score System:** Real-time formula based on steps, elapsed time, and difficulty multiplier, with persistent storage via browser `localStorage`.
- **Procedural Sound Engine:** Built with the Web Audio API (synthesizer without external audio files) providing sound effects for movement, wall collisions, victory, and defeat. Includes a sound mute toggle.
- **End-Game Modal Dialogs:** Victory and Game Over popup cards displaying round statistics (score, total steps, time elapsed) and instant restart controls.

---

## 📁 Project Architecture

```text
AI-Maze-Escape-Full-Project/
├── backend/
│   ├── algorithms/
│   │   ├── astar.py              # A* search algorithm & heuristic calculation
│   │   └── minimax.py            # Minimax AI with Alpha-Beta Pruning & BFS distance
│   ├── api/
│   │   ├── astar_routes.py       # A* route endpoints (/api/astar)
│   │   ├── game_routes.py        # Core gameplay & difficulty endpoints (/api/game)
│   │   └── minimax_routes.py     # Minimax prediction endpoints (/api/minimax)
│   ├── core/
│   │   ├── game_state.py         # Singleton state manager
│   │   ├── maze.py               # Procedural DFS maze generator & grid utilities
│   │   └── models.py             # Pydantic schemas for requests and responses
│   ├── services/
│   │   └── game_service.py       # Orchestration layer between algorithms and game state
│   ├── app.py                    # FastAPI application initialization & CORS config
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── css/
│   │   └── style.css             # Modern styling, animations, and responsive layout
│   ├── js/
│   │   ├── api.js                # Frontend API client communicating with backend
│   │   └── game.js               # UI controller, timer, score, audio, canvas minimap
│   └── index.html                # Game interface layout
├── tests/
│   ├── test_astar.py             # A* unit tests
│   ├── test_game.py              # Game service logic unit tests
│   └── test_minimax.py           # Minimax algorithm unit tests
└── README.md                     # Project documentation
```

---

## 🛠️ Technology Stack

- **Backend:** Python 3.9+, FastAPI, Uvicorn, Pydantic
- **Frontend:** HTML5, CSS3 (CSS Grid & Flexbox), JavaScript (ES6+), HTML5 Canvas, Web Audio API, Font Awesome 6
- **Algorithms:** A\* Search, Minimax, Alpha-Beta Pruning, BFS, Randomized DFS Backtracking
- **Version Control:** Git & GitHub

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9 or higher
- Git

### 2. Backend Setup
In your terminal, navigate to the project directory and create a virtual environment:

```bash
cd AI-Maze-Escape-Full-Project

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run FastAPI server
uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

The backend API will run at `http://127.0.0.1:8000`.  
Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
In a separate terminal window, start a static web server:

```bash
cd AI-Maze-Escape-Full-Project/frontend
python3 -m http.server 5500
```

Open your web browser and navigate to:
```text
http://127.0.0.1:5500
```

---

## 🕹️ Controls

| Control | Action |
|---|---|
| `W` / `↑` | Move Player Up |
| `S` / `↓` | Move Player Down |
| `A` / `←` | Move Player Left |
| `D` / `→` | Move Player Right |
| `On-screen D-Pad` | Mobile / Mouse click navigation |
| `Reset Button` | Generate a new maze and reset round |
| `Auto Mode Button` | Toggle A\* autonomous gameplay ON / OFF |
| `Sound Toggle (🔊/🔇)` | Toggle procedural audio effects |
| `Difficulty (Easy / Med / Hard)` | Adjust Minimax depth and score multiplier |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/game/start` | Initialize a new game session |
| `POST` | `/api/game/reset` | Generate fresh maze and reset state |
| `GET` | `/api/game/state` | Fetch current game state and coordinates |
| `POST` | `/api/game/move` | Execute a manual player move (`UP`, `DOWN`, `LEFT`, `RIGHT`) |
| `POST` | `/api/game/auto-move` | Execute next best move suggested by A\* |
| `POST` | `/api/game/difficulty` | Update difficulty level (`easy`, `medium`, `hard`) |
| `POST` | `/api/astar/path` | Calculate A\* path between arbitrary points |
| `POST` | `/api/minimax/predict` | Get next predicted enemy move via Minimax |
