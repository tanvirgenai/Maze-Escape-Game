from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.game_routes import router as game_router
from backend.api.astar_routes import router as astar_router
from backend.api.minimax_routes import router as minimax_router

app = FastAPI(title="AI Maze Escape API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game_router, prefix="/api/game", tags=["Game"])
app.include_router(astar_router, prefix="/api/astar", tags=["A*"])
app.include_router(minimax_router, prefix="/api/minimax", tags=["Minimax"])

@app.get("/")
def root():
    return {"message": "AI Maze Escape API is running"}

@app.get("/api/health")
def health():
    return {"status": "ok"}
