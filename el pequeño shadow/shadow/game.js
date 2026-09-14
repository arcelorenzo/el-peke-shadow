// ============================================================
// SHADOW: EL PEQUEÑO LOBO
// game.js — versión limpia basada en la animación de 89 frames
// ============================================================

"use strict";

// -------------------------
// 1. CANVAS Y CONFIGURACIÓN
// -------------------------

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

const CONFIG = {
    maxZones: 4,
    totalShadowFrames: 89,
    groundY: 375,
    playerWidth: 45,
    playerHeight: 45,
    playerCrouchHeight: 30,
    playerSpeed: 4,
    furyMultiplier: 1.5,
    jumpVelocity: -8,
    gravity: 0.4,
    animationEveryTicks: 5,
    saveKey: "lobo_save"
};

// -------------------------
// 2. ESTADO DEL JUEGO
// -------------------------

const DEFAULT_GAME_STATE = {
    hp: 85,
    maxHp: 85,
    zone: 1,
    inventory: "Vacío",
    paused: false,
    furyMode: false,
    daysToSnow: 9
};

let gameState = { ...DEFAULT_GAME_STATE };

// -------------------------
// 3. RECURSOS
// -------------------------

const bgZone1 = new Image();
bgZone1.src = "fondo_montana_zona1.png";

const shadowFrames = [];

for (let i = 1; i <= CONFIG.totalShadowFrames; i++) {
    const img = new Image();
    img.src = `videoframe_640 (${i}).png`;
    shadowFrames.push(img);
}

// -------------------------
// 4. JUGADOR Y ENTIDADES
// -------------------------

const player = {
    x: 100,
    y: CONFIG.groundY - CONFIG.playerHeight,
    width: CONFIG.playerWidth,
    height: CONFIG.playerHeight,
    speed: CONFIG.playerSpeed,
    dx: 0,
    dy: 0,
    isJumping: false,
    isCrouched: false,
    actionText: ""
};

const eagle = {
    x: 500,
    y: 80,
    width: 60,
    height: 30,
    speed: 0.8,
    active: true
};

const bear = {
    x: 580,
    y: 290,
    width: 65,
    height: 50,
    present: true
};

const keys = {};

// -------------------------
// 5. ANIMACIÓN
// -------------------------

let currentFrameIndex = 0;
let frameCounter = 0;

function updateShadowAnimation() {
    if (player.dx === 0) {
        return;
    }

    frameCounter++;

    if (frameCounter >= CONFIG.animationEveryTicks) {
        frameCounter = 0;
        currentFrameIndex =
            (currentFrameIndex + 1) % shadowFrames.length;
    }
}

// -------------------------
// 6. UI
// -------------------------

const hpVal = document.getElementById("hp-val");
const maxHpVal = document.getElementById("max-hp-val");
const zoneVal = document.getElementById("zone-val");
const snowVal = document.getElementById("snow-val");
const inventoryVal = document.getElementById("inventory-val");
const status = document.getElementById("status");
const pauseButton = document.getElementById("btn-pause");

function updateUI() {
    hpVal.textContent = Math.round(gameState.hp);
    maxHpVal.textContent = Math.round(gameState.maxHp);
    zoneVal.textContent = gameState.zone;
    snowVal.textContent = gameState.daysToSnow;
    inventoryVal.textContent = gameState.inventory;
    pauseButton.textContent = gameState.paused ? "Reanudar" : "Pausa";
}

function showStatus(text, duration = 600) {
    status.textContent = text;

    if (duration > 0) {
        window.setTimeout(() => {
            if (status.textContent === text) {
                status.textContent = "";
            }
        }, duration);
    }
}

// -------------------------
// 7. AUDIO 8-BIT
// -------------------------

let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }

    return audioCtx;
}

function playSound(frequency, type = "square", duration = 0.1) {
    const audio = getAudioContext();

    if (!audio) {
        return;
    }

    if (audio.state === "suspended") {
        audio.resume().catch(() => {});
    }

    const oscillator = audio.createOscillator();
    const gainNode = audio.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(
        frequency,
        audio.currentTime
    );

    gainNode.gain.setValueAtTime(0.1, audio.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audio.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(audio.destination);

    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
}

// -------------------------
// 8. GUARDADO / CARGA
// -------------------------

function saveGame() {
    const saveData = {
        hp: gameState.hp,
        maxHp: gameState.maxHp,
        zone: gameState.zone,
        inventory: gameState.inventory,
        furyMode: gameState.furyMode,
        daysToSnow: gameState.daysToSnow
    };

    localStorage.setItem(CONFIG.saveKey, JSON.stringify(saveData));
    showStatus("¡Partida guardada!", 1200);
}

function loadGame() {
    const savedData = localStorage.getItem(CONFIG.saveKey);

    if (!savedData) {
        return;
    }

    try {
        const parsed = JSON.parse(savedData);

        gameState.hp = Number.isFinite(parsed.hp)
            ? parsed.hp
            : DEFAULT_GAME_STATE.hp;

        gameState.maxHp = Number.isFinite(parsed.maxHp)
            ? parsed.maxHp
            : DEFAULT_GAME_STATE.maxHp;

        gameState.zone = Number.isFinite(parsed.zone)
            ? Math.min(Math.max(parsed.zone, 1), CONFIG.maxZones)
            : DEFAULT_GAME_STATE.zone;

        gameState.inventory =
            typeof parsed.inventory === "string"
                ? parsed.inventory
                : DEFAULT_GAME_STATE.inventory;

        gameState.furyMode =
            typeof parsed.furyMode === "boolean"
                ? parsed.furyMode
                : DEFAULT_GAME_STATE.furyMode;

        gameState.daysToSnow = Number.isFinite(parsed.daysToSnow)
            ? Math.max(parsed.daysToSnow, 1)
            : DEFAULT_GAME_STATE.daysToSnow;

        updateUI();
        showStatus("Partida cargada.", 1200);
    } catch (error) {
        console.warn("No se pudo cargar la partida:", error);
        localStorage.removeItem(CONFIG.saveKey);
    }
}

// -------------------------
// 9. CONTROLES
// -------------------------

window.addEventListener("keydown", (event) => {
    const key = event.key;

    // Evita desplazamiento de la página con teclas del juego.
    if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "]
            .includes(key)
    ) {
        event.preventDefault();
    }

    keys[key] = true;

    // Furia
    if (key === "f" || key === "F") {
        gameState.furyMode = !gameState.furyMode;

        playSound(
            gameState.furyMode ? 150 : 300,
            "square",
            0.12
        );

        showStatus(
            gameState.furyMode
                ? "🔥 ¡MODO FURIA ACTIVADO!"
                : "Furia desactivada.",
            700
        );
        return;
    }

    // Pausa
    if (key === "Escape") {
        togglePause();
        return;
    }

    if (gameState.paused) {
        return;
    }

    // Ataques
    if (key === "z" || key === "Z") {
        useAction("¡Zarpazos Rápidos! (Z)", 400, "square", 0.1, 600);
    }

    if (key === "x" || key === "X") {
        useAction("¡Mordisco Feroz! (X)", 250, "sawtooth", 0.15, 600);
    }

    if (key === "c" || key === "C") {
        useAction("¡Embestida / Bloqueo! (C)", 500, "triangle", 0.12, 600);
    }

    if (event.code === "Space") {
        useAction("¡Coletazo Cargado! (Espacio)", 180, "square", 0.2, 800);
    }
});

window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

function useAction(text, frequency, type, duration, clearAfter) {
    player.actionText = text;
    playSound(frequency, type, duration);
    showStatus(text, clearAfter);

    window.setTimeout(() => {
        if (player.actionText === text) {
            player.actionText = "";
        }
    }, clearAfter);
}

document.getElementById("btn-pause").addEventListener("click", togglePause);
document.getElementById("btn-save").addEventListener("click", saveGame);

function togglePause() {
    gameState.paused = !gameState.paused;
    updateUI();

    if (gameState.paused) {
        showStatus("Juego en pausa.", 0);
    } else {
        status.textContent = "";
    }
}

// -------------------------
// 10. MOVIMIENTO
// -------------------------

function updateMovement() {
    const currentSpeed =
        gameState.furyMode
            ? player.speed * CONFIG.furyMultiplier
            : player.speed;

    player.dx = 0;

    if (keys.ArrowRight || keys.d || keys.D) {
        player.dx = currentSpeed;
    }

    if (keys.ArrowLeft || keys.a || keys.A) {
        player.dx = -currentSpeed;
    }

    const wantsCrouch =
        keys.ArrowDown || keys.s || keys.S;

    if (wantsCrouch && !player.isJumping) {
        player.isCrouched = true;
        player.height = CONFIG.playerCrouchHeight;
        player.y = CONFIG.groundY - player.height;
    } else {
        player.isCrouched = false;

        if (!player.isJumping) {
            player.height = CONFIG.playerHeight;
            player.y = CONFIG.groundY - player.height;
        }
    }

    const wantsJump =
        keys.ArrowUp || keys.w || keys.W;

    if (
        wantsJump &&
        !player.isJumping &&
        !player.isCrouched
    ) {
        player.isJumping = true;
        player.dy = CONFIG.jumpVelocity;
        playSound(600, "square", 0.1);
    }

    if (player.isJumping) {
        player.y += player.dy;
        player.dy += CONFIG.gravity;

        if (player.y >= CONFIG.groundY - player.height) {
            player.y = CONFIG.groundY - player.height;
            player.isJumping = false;
            player.dy = 0;
        }
    }

    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x > canvas.width - player.width) {
        changeZone();
    }
}

function changeZone() {
    player.x = 0;

    if (gameState.zone >= CONFIG.maxZones) {
        showStatus("❄️ Has llegado a la Zona Final.", 1000);
        return;
    }

    gameState.zone++;
    gameState.daysToSnow = Math.max(
        1,
        gameState.daysToSnow - 1
    );

    // Reinicia posiciones de entidades para la nueva zona.
    eagle.x = 500;

    updateUI();

    playSound(700, "square", 0.15);
    showStatus(`¡Zona ${gameState.zone}!`, 1200);
}

// -------------------------
// 11. DIBUJO DEL FONDO
// -------------------------

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (
        bgZone1.complete &&
        bgZone1.naturalWidth !== 0
    ) {
        ctx.drawImage(
            bgZone1,
            0,
            0,
            canvas.width,
            canvas.height
        );
    } else {
        ctx.fillStyle =
            gameState.furyMode
                ? "#2a0808"
                : "#0d1b2a";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // Suelo
    ctx.fillStyle = "rgba(43, 24, 16, 0.7)";
    ctx.fillRect(
        0,
        CONFIG.groundY,
        canvas.width,
        canvas.height - CONFIG.groundY
    );
}

// -------------------------
// 12. ENEMIGOS / ENTIDADES
// -------------------------

function drawEagle() {
    if (gameState.zone !== 1 || !eagle.active) {
        return;
    }

    // Placeholder hasta tener sprite real del águila.
    ctx.fillStyle = "#3d2314";
    ctx.fillRect(
        eagle.x,
        eagle.y,
        eagle.width,
        eagle.height
    );

    // Alas simples pixeladas.
    ctx.fillStyle = "#24150d";
    ctx.fillRect(
        eagle.x + 10,
        eagle.y - 8,
        18,
        8
    );
    ctx.fillRect(
        eagle.x + 35,
        eagle.y - 5,
        18,
        8
    );

    eagle.x -= eagle.speed;

    if (eagle.x < -70) {
        eagle.x = canvas.width + 50;
    }
}

function drawBear() {
    if (gameState.zone !== 2 || !bear.present) {
        return;
    }

    // Placeholder hasta tener sprite real del oso.
    ctx.fillStyle = "#4a3525";
    ctx.fillRect(
        bear.x,
        bear.y,
        bear.width,
        bear.height
    );

    // Ojos.
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(
        bear.x + 18,
        bear.y - 15,
        8,
        8
    );
    ctx.fillRect(
        bear.x + 39,
        bear.y - 15,
        8,
        8
    );
}

// -------------------------
// 13. DIBUJAR SHADOW
// -------------------------

function drawShadow() {
    const activeSprite =
        shadowFrames[currentFrameIndex];

    if (
        activeSprite &&
        activeSprite.complete &&
        activeSprite.naturalWidth !== 0
    ) {
        ctx.drawImage(
            activeSprite,
            player.x,
            player.y,
            player.width,
            player.height
        );

        if (gameState.furyMode) {
            ctx.fillStyle =
                "rgba(239, 68, 68, 0.35)";

            ctx.fillRect(
                player.x,
                player.y,
                player.width,
                player.height
            );
        }

        return;
    }

    // Respaldo si todavía no cargó el frame.
    ctx.fillStyle =
        gameState.furyMode
            ? "#ef4444"
            : "#111111";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
}

// -------------------------
// 14. HUD DEL CANVAS
// -------------------------

function drawCanvasHUD() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "11px 'Courier New'";

    const furyText =
        gameState.furyMode
            ? "ACTIVADA"
            : "INACTIVA";

    ctx.fillText(
        `Furia (F): ${furyText} | Nieve en: ${gameState.daysToSnow}d`,
        15,
        25
    );

    if (player.actionText !== "") {
        ctx.fillStyle = "#facc15";
        ctx.font = "bold 13px 'Courier New'";

        ctx.fillText(
            player.actionText,
            Math.max(5, player.x - 10),
            Math.max(45, player.y - 12)
        );
    }
}

// -------------------------
// 15. PANTALLA DE PAUSA
// -------------------------

function drawPauseScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 26px 'Courier New'";
    ctx.textAlign = "center";

    ctx.fillText(
        "PAUSA — EL PEQUEÑO SHADOW",
        canvas.width / 2,
        180
    );

    ctx.font = "16px 'Courier New'";
    ctx.fillStyle = "#cbd5e1";

    ctx.fillText(
        "Presiona [ Esc ] para Reanudar",
        canvas.width / 2,
        230
    );

    ctx.textAlign = "left";
}

// -------------------------
// 16. BUCLE PRINCIPAL
// -------------------------

function gameLoop() {
    if (!gameState.paused) {
        updateMovement();
        updateShadowAnimation();

        drawBackground();
        drawEagle();
        drawBear();
        drawShadow();
        drawCanvasHUD();

        updateUI();
    } else {
        drawPauseScreen();
    }

    requestAnimationFrame(gameLoop);
}

// -------------------------
// 17. INICIO
// -------------------------

loadGame();
updateUI();
gameLoop();
