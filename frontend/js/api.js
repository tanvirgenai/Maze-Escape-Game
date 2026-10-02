const API_BASE = "http://127.0.0.1:8000/api";

async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`GET ${path} failed`);
    return res.json();
}

async function apiPost(path, body = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `POST ${path} failed`);
    }
    return res.json();
}

const GameAPI = {
    start: () => apiPost("/game/start"),
    reset: () => apiPost("/game/reset"),
    state: () => apiGet("/game/state"),
    move: (direction) => apiPost("/game/move", { direction }),
    setDifficulty: (level) => apiPost("/game/difficulty", { level }),
};
