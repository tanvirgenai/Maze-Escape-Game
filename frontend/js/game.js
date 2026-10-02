const $ = (id) => document.getElementById(id);

let currentState = null;
let logs = [];
let timerInterval = null;
let secondsElapsed = 0;

function startTimer() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        if (currentState && currentState.status === "running") {
            secondsElapsed++;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
    const secs = String(secondsElapsed % 60).padStart(2, '0');
    $("timeElapsed").textContent = `${mins}:${secs}`;
}

function getTimestamp() {
    const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
    const secs = String(secondsElapsed % 60).padStart(2, '0');
    return `${mins}:${secs}`;
}

function addLog(message, actor = 'system') {
    let icon = '';
    if (message.includes('Player')) icon = '<i class="fa-solid fa-person-running player-icon log-icon"></i>';
    else if (message.includes('Enemy')) icon = '<i class="fa-solid fa-ghost enemy-icon log-icon"></i>';
    else icon = '<i class="fa-solid fa-info-circle log-icon"></i>';

    const logEntry = `<div class="log-item"><span class="log-time">${getTimestamp()}</span> ${icon} <span>${escapeHtml(message)}</span></div>`;
    logs.push(logEntry);
    if (logs.length > 50) logs.shift();

    $("log").innerHTML = logs.slice().reverse().join("");
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#039;"
    }[c]));
}

function positionKey(pos) { return `${pos[0]}-${pos[1]}`; }
function distance(a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); }

function initLabels(size) {
    const colLabels = $("colLabels");
    const rowLabels = $("rowLabels");
    if (colLabels.children.length === 0) {
        for (let i = 0; i < size; i++) {
            const span = document.createElement("span"); span.textContent = i; colLabels.appendChild(span);
        }
        for (let i = 0; i < size; i++) {
            const span = document.createElement("span"); span.textContent = i; rowLabels.appendChild(span);
        }
    }
}

function drawMinimap(state) {
    const canvas = $("minimap");
    const ctx = canvas.getContext("2d");
    const size = state.maze.length;
    canvas.width = size * 10;
    canvas.height = size * 10;
    const cw = canvas.width / size;
    const ch = canvas.height / size;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (state.maze[r][c] === 1) {
                ctx.fillStyle = '#4a5568';
                ctx.fillRect(c * cw, r * ch, cw, ch);
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(c * cw, r * ch, cw, ch);
            }
        }
    }

    // Draw path
    ctx.fillStyle = '#bfdbfe';
    state.path.forEach(p => ctx.fillRect(p[1] * cw, p[0] * ch, cw, ch));

    // Draw entities
    ctx.fillStyle = '#3b82f6'; // Player
    ctx.beginPath(); ctx.arc(state.player[1]*cw + cw/2, state.player[0]*ch + ch/2, cw/2, 0, Math.PI*2); ctx.fill();
    
    ctx.fillStyle = '#ef4444'; // Enemy
    ctx.beginPath(); ctx.arc(state.enemy[1]*cw + cw/2, state.enemy[0]*ch + ch/2, cw/2, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = '#10b981'; // Goal
    ctx.beginPath(); ctx.arc(state.goal[1]*cw + cw/2, state.goal[0]*ch + ch/2, cw/2, 0, Math.PI*2); ctx.fill();
}

function updatePrediction(predictedMove) {
    const dirs = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    dirs.forEach(d => {
        const el = $(`pred-${d.toLowerCase()}`);
        if(el) el.classList.remove('active');
    });
    if (predictedMove) {
        const activeEl = $(`pred-${predictedMove.toLowerCase()}`);
        if(activeEl) activeEl.classList.add('active');
    }
}

function renderMaze(state) {
    initLabels(state.maze.length);
    const mazeEl = $("maze");
    mazeEl.innerHTML = "";

    const path = new Set(state.path.map(positionKey));
    const explored = new Set(state.explored.map(positionKey));
    const player = positionKey(state.player);
    const enemy = positionKey(state.enemy);
    const goal = positionKey(state.goal);

    state.maze.forEach((row, r) => {
        row.forEach((value, c) => {
            const key = `${r}-${c}`;
            const cell = document.createElement("div");
            cell.className = "cell " + (value === 1 ? "wall" : "open");

            if (value === 0) {
                if (explored.has(key)) cell.classList.add("explored");
                if (path.has(key)) cell.classList.add("path");
            }

            if (key === goal) { cell.classList.add("goal"); cell.innerHTML = '<i class="fa-solid fa-flag"></i>'; }
            else if (key === enemy) { cell.classList.add("enemy"); cell.innerHTML = '<i class="fa-solid fa-ghost"></i>'; }
            else if (key === player) { cell.classList.add("player"); cell.innerHTML = '<i class="fa-solid fa-person-running"></i>'; }

            mazeEl.appendChild(cell);
        });
    });
}

function render(state) {
    currentState = state;
    renderMaze(state);
    drawMinimap(state);

    // Update coordinates & distances
    $("playerPos").textContent = `(${state.player[0]}, ${state.player[1]})`;
    $("enemyPos").textContent = `(${state.enemy[0]}, ${state.enemy[1]})`;
    $("goalPos").textContent = `(${state.goal[0]}, ${state.goal[1]})`;
    
    $("playerSteps").textContent = state.player_steps;
    $("enemySteps").textContent = state.enemy_steps;
    
    $("distGoal").textContent = distance(state.player, state.goal);
    $("distEnemy").textContent = distance(state.player, state.enemy);

    updatePrediction(state.predicted_enemy_move);

    // Update Status Pill
    const pill = $("statusPill");
    const statusText = $("statusText");
    const pillDot = pill.querySelector('.dot');
    
    statusText.textContent = state.status.charAt(0).toUpperCase() + state.status.slice(1);
    
    if (state.status === "won") {
        pill.style.color = 'var(--goal)';
        pillDot.style.background = 'var(--goal)';
    } else if (state.status === "lost") {
        pill.style.color = 'var(--enemy)';
        pillDot.style.background = 'var(--enemy)';
    } else {
        pill.style.color = 'var(--primary)';
        pillDot.style.background = 'var(--primary)';
    }
}

async function loadGame() {
    try {
        const state = await GameAPI.start();
        logs = [];
        startTimer();
        addLog("Game started");
        render(state);
    } catch (error) {
        addLog("Backend not connected.");
    }
}

async function move(direction) {
    if (!currentState || currentState.status !== "running") return;
    try {
        const state = await GameAPI.move(direction);
        addLog(state.message);
        if (state.status === "won") addLog("Player reached the goal!");
        if (state.status === "lost") addLog("Enemy caught the player!");
        render(state);
    } catch (error) {
        addLog(error.message);
    }
}

$("resetBtn").addEventListener("click", async () => {
    try {
        const state = await GameAPI.reset();
        logs = [];
        startTimer();
        addLog("Game reset");
        render(state);
    } catch (error) {
        addLog("Error resetting game.");
    }
});

document.querySelectorAll("[data-move]").forEach(btn => {
    btn.addEventListener("click", () => move(btn.dataset.move));
});

document.addEventListener("keydown", (event) => {
    const keys = {
        ArrowUp: "UP", w: "UP", W: "UP",
        ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT"
    };

    if (keys[event.key] && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        move(keys[event.key]);
    }
});

loadGame();
