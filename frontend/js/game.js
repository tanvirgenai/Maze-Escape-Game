const $ = (id) => document.getElementById(id);

let currentState = null;
let logs = [];
let timerInterval = null;
let secondsElapsed = 0;
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type) {
    if (!soundEnabled) return;
    try {
        initAudio();
        if (!audioCtx) return;
        const ctx = audioCtx;
        const now = ctx.currentTime;

        if (type === 'move') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(750, now + 0.07);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc.start(now);
            osc.stop(now + 0.07);
        } else if (type === 'blocked') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.linearRampToValueAtTime(70, now + 0.1);
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'won') {
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const noteOsc = ctx.createOscillator();
                const noteGain = ctx.createGain();
                noteOsc.connect(noteGain);
                noteGain.connect(ctx.destination);
                noteOsc.type = 'sine';
                noteOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
                noteGain.gain.setValueAtTime(0.12, now + idx * 0.09);
                noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
                noteOsc.start(now + idx * 0.09);
                noteOsc.stop(now + idx * 0.09 + 0.25);
            });
        } else if (type === 'lost') {
            [280, 220, 160, 110].forEach((freq, idx) => {
                const noteOsc = ctx.createOscillator();
                const noteGain = ctx.createGain();
                noteOsc.connect(noteGain);
                noteGain.connect(ctx.destination);
                noteOsc.type = 'sawtooth';
                noteOsc.frequency.setValueAtTime(freq, now + idx * 0.11);
                noteGain.gain.setValueAtTime(0.11, now + idx * 0.11);
                noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.2);
                noteOsc.start(now + idx * 0.11);
                noteOsc.stop(now + idx * 0.11 + 0.2);
            });
        }
    } catch (e) {
        // Fallback gracefully
    }
}

let isGameStarted = false;

function updateStartBtn() {
    const btn = $("startGameBtn");
    if (!btn) return;
    if (!isGameStarted) {
        btn.classList.remove("in-progress");
        btn.innerHTML = '<i class="fa-solid fa-play"></i> <span>START GAME</span>';
    } else if (currentState && currentState.status === "running") {
        btn.classList.add("in-progress");
        btn.innerHTML = '<i class="fa-solid fa-gamepad"></i> <span>GAME IN PROGRESS</span>';
    } else {
        btn.classList.remove("in-progress");
        btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> <span>PLAY AGAIN</span>';
    }
}

function ensureGameStarted() {
    if (!isGameStarted) {
        isGameStarted = true;
        startTimer();
        updateStartBtn();
        addLog("Game started! Timer & score active.");
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (isGameStarted && currentState && currentState.status === "running") {
            secondsElapsed++;
            updateTimerDisplay();
        }
    }, 1000);
}

let isAutoMode = false;
let autoInterval = null;

function startAutoMode() {
    ensureGameStarted();
    isAutoMode = true;
    const btn = $("autoMoveBtn");
    if (btn) {
        btn.classList.add("active");
        btn.innerHTML = '<i class="fa-solid fa-robot"></i> Auto Mode: ON';
    }
    autoInterval = setInterval(async () => {
        if (!currentState || currentState.status !== "running") {
            stopAutoMode();
            return;
        }
        try {
            const state = await GameAPI.autoMove();
            addLog(`[AUTO] ${state.message}`);
            if (state.status === "won") {
                isGameStarted = false;
                clearInterval(timerInterval);
                playSound('won');
                setTimeout(() => showModal('won', parseInt($("currentScore").textContent || "0"), state.player_steps, getTimestamp()), 450);
            }
            if (state.status === "lost") {
                isGameStarted = false;
                clearInterval(timerInterval);
                playSound('lost');
                setTimeout(() => showModal('lost', 0, state.player_steps, getTimestamp()), 450);
            }
            render(state);
        } catch (e) {
            stopAutoMode();
        }
    }, 500);
}

function stopAutoMode() {
    isAutoMode = false;
    clearInterval(autoInterval);
    autoInterval = null;
    const btn = $("autoMoveBtn");
    if (btn) {
        btn.classList.remove("active");
        btn.innerHTML = '<i class="fa-solid fa-robot"></i> Auto Mode: OFF';
    }
}

if ($("autoMoveBtn")) {
    $("autoMoveBtn").addEventListener("click", () => {
        if (isAutoMode) {
            stopAutoMode();
        } else {
            startAutoMode();
        }
    });
}


function getHighScore() {
    return parseInt(localStorage.getItem("ai_maze_high_score") || "0", 10);
}

function updateScoreDisplay() {
    const highScore = getHighScore();
    if ($("highScore")) $("highScore").textContent = highScore;
    if (!currentState) {
        if ($("currentScore")) $("currentScore").textContent = "0";
        return;
    }
    const diffMultiplier = currentState.difficulty === "hard" ? 2.0 : currentState.difficulty === "easy" ? 1.0 : 1.5;
    const elapsed = isGameStarted ? secondsElapsed : 0;
    const steps = isGameStarted ? currentState.player_steps : 0;
    const baseScore = Math.max(100, 1500 - (steps * 20) - (elapsed * 5));
    const score = Math.round(baseScore * diffMultiplier);
    if ($("currentScore")) $("currentScore").textContent = score;
}

function updateTimerDisplay() {
    const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
    const secs = String(secondsElapsed % 60).padStart(2, '0');
    $("timeElapsed").textContent = `${mins}:${secs}`;
    updateScoreDisplay();
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

    // Update Difficulty UI
    if (state.depth) {
        $("enemyDepthDisplay").textContent = state.depth;
    }
    if (state.difficulty) {
        document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
        const activeBtn = document.querySelector(`.diff-btn[data-diff="${state.difficulty}"]`);
        if (activeBtn) activeBtn.classList.add("active");
    }

    updateScoreDisplay();
    updateStartBtn();
}

async function setDifficulty(level) {
    if (currentState && currentState.status === "running") {
        try {
            const state = await GameAPI.setDifficulty(level);
            addLog(`Difficulty set to ${level.toUpperCase()}`);
            render(state);
        } catch (error) {
            addLog("Error setting difficulty.");
        }
    }
}

document.querySelectorAll(".diff-btn").forEach(btn => {
    btn.addEventListener("click", () => setDifficulty(btn.dataset.diff));
});

async function loadGame() {
    try {
        const state = await GameAPI.start();

        logs = [];
        isGameStarted = false;
        clearInterval(timerInterval);
        secondsElapsed = 0;
        updateTimerDisplay();
        updateStartBtn();
        addLog("Game ready - Press Start or use arrow keys/WASD!");
        render(state);
    } catch (error) {
        addLog("Backend not connected.");
    }
}

async function move(direction) {
    if (!currentState || currentState.status !== "running") return;
    ensureGameStarted();
    try {
        const state = await GameAPI.move(direction);
        addLog(state.message);
        
        if (state.message.toLowerCase().includes("blocked")) {
            playSound('blocked');
        } else if (state.status === "won") {
            isGameStarted = false;
            clearInterval(timerInterval);
            playSound('won');
            const diffMultiplier = state.difficulty === "hard" ? 2.0 : state.difficulty === "easy" ? 1.0 : 1.5;
            const baseScore = Math.max(100, 1500 - (state.player_steps * 20) - (secondsElapsed * 5));
            const finalScore = Math.round(baseScore * diffMultiplier);
            const prevHighScore = getHighScore();

            addLog(`Player reached the goal! Score: ${finalScore} pts`);
            if (finalScore > prevHighScore) {
                localStorage.setItem("ai_maze_high_score", finalScore.toString());
                if ($("highScore")) $("highScore").textContent = finalScore;
                addLog(`NEW HIGH SCORE: ${finalScore}!`);
            }
            setTimeout(() => {
                showModal('won', finalScore, state.player_steps, getTimestamp());
            }, 450);
        } else if (state.status === "lost") {
            isGameStarted = false;
            clearInterval(timerInterval);
            playSound('lost');
            addLog("Enemy caught the player! Score: 0");
            if ($("currentScore")) $("currentScore").textContent = "0";
            setTimeout(() => {
                showModal('lost', 0, state.player_steps, getTimestamp());
            }, 450);
        } else {
            playSound('move');
        }
        render(state);
    } catch (error) {
        addLog(error.message);
    }
}

const soundToggle = $("soundToggle");
if (soundToggle) {
    soundToggle.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundToggle.classList.add("active");
            soundToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Sound ON</span>';
        } else {
            soundToggle.classList.remove("active");
            soundToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>Sound OFF</span>';
        }
    });
}

$("resetBtn").addEventListener("click", async () => {
    try {
        const state = await GameAPI.reset();
        logs = [];
        isGameStarted = false;
        stopAutoMode();
        clearInterval(timerInterval);
        secondsElapsed = 0;
        updateTimerDisplay();
        updateStartBtn();
        addLog("Game reset - Press Start or move to begin!");
        render(state);
    } catch (error) {
        addLog("Error resetting game.");
    }
});

const startGameBtn = $("startGameBtn");
if (startGameBtn) {
    startGameBtn.addEventListener("click", async () => {
        if (!currentState || currentState.status !== "running") {
            try {
                const state = await GameAPI.reset();
                logs = [];
                isGameStarted = true;
                stopAutoMode();
                secondsElapsed = 0;
                startTimer();
                updateTimerDisplay();
                updateStartBtn();
                addLog("New game started!");
                render(state);
            } catch (e) {
                addLog("Failed to start game.");
            }
        } else {
            ensureGameStarted();
        }
    });
}

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

function showModal(type, score, steps, time) {
    const modal = $("gameModal");
    const icon = $("modalIcon");
    const title = $("modalTitle");
    const msg = $("modalMessage");
    const actionBtn = $("modalActionBtn");
    if (!modal) return;

    if ($("modalScore")) $("modalScore").textContent = score;
    if ($("modalSteps")) $("modalSteps").textContent = steps;
    if ($("modalTime")) $("modalTime").textContent = time;

    if (type === 'won') {
        if (icon) {
            icon.className = "modal-icon victory";
            icon.innerHTML = '<i class="fa-solid fa-trophy"></i>';
        }
        if (title) title.textContent = "Victory!";
        if (msg) msg.textContent = "You reached the goal safely!";
        if (actionBtn) actionBtn.textContent = "Next Level";
    } else {
        if (icon) {
            icon.className = "modal-icon defeat";
            icon.innerHTML = '<i class="fa-solid fa-ghost"></i>';
        }
        if (title) title.textContent = "Caught by Enemy!";
        if (msg) msg.textContent = "The enemy trapped you. Try another route!";
        if (actionBtn) actionBtn.textContent = "Try Again";
    }

    modal.classList.remove("hidden");
}

function hideModal() {
    const modal = $("gameModal");
    if (modal) modal.classList.add("hidden");
}

if ($("modalActionBtn")) {
    $("modalActionBtn").addEventListener("click", async () => {
        hideModal();
        try {
            const state = await GameAPI.reset();
            logs = [];
            isGameStarted = false;
            stopAutoMode();
            clearInterval(timerInterval);
            secondsElapsed = 0;
            updateTimerDisplay();
            updateStartBtn();
            addLog("New round ready - Press Start or move to begin!");
            render(state);
        } catch (e) {
            addLog("Reset failed");
        }
    });
}

if ($("modalCloseBtn")) {
    $("modalCloseBtn").addEventListener("click", () => {
        hideModal();
    });
}

loadGame();
