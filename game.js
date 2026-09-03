// --- JUEGO PRINCIPAL: SHADOW EL LOBO (game.js con Animación de 89 Frames) ---

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estado global del juego
let gameState = {
    hp: 85,
    maxHp: 85,
    zone: 1,
    inventory: "Vacío",
    paused: false,
    furyMode: false,
    daysToSnow: 9
};

// Carga de Fondo
const bgZone1 = new Image();
bgZone1.src = "fondo_montana_zona1.png"; 

// --- CARGA AUTOMÁTICA DE LOS 89 FRAMES DE SHADOW ---
const shadowFrames = [];
const totalFrames = 89;

for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    // ⚠️ ATENCIÓN: Si tus archivos se llaman diferente (ej: shadow_1.png o videoframe_640_1.png),
    // modifica esta línea para que coincida exactamente con cómo los guardaste.
    img.src = `videoframe_640 (${i}).png`; 
    shadowFrames.push(img);
}

// Control de animación de los frames
let currentFrameIndex = 0;
let frameCounter = 0;

// Elementos de la Interfaz
const hpVal = document.getElementById("hp-val");
const zoneVal = document.getElementById("zone-val");
const inventoryVal = document.getElementById("inventory-val");

function updateUI() {
    hpVal.innerText = Math.round(gameState.hp);
    zoneVal.innerText = gameState.zone;
    inventoryVal.innerText = gameState.inventory;
}

// Botones de control externo (UI)
document.getElementById("btn-pause").addEventListener("click", () => {
    gameState.paused = !gameState.paused;
    document.getElementById("btn-pause").innerText = gameState.paused ? "Reanudar" : "Pausa";
});

document.getElementById("btn-save").addEventListener("click", () => {
    localStorage.setItem("lobo_save", JSON.stringify(gameState));
    alert("¡Partida guardada con éxito!");
});

// Cargar partida guardada si existe
const savedData = localStorage.getItem("lobo_save");
if (savedData) {
    const parsed = JSON.parse(savedData);
    gameState.hp = parsed.hp;
    gameState.zone = parsed.zone;
    gameState.inventory = parsed.inventory;
    updateUI();
}

// --- SISTEMA DE AUDIO 8-BIT ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(frequency, type, duration) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// --- ENTIDADES Y JUGADOR ---
let player = {
    x: 100,
    y: 320,
    width: 45,
    height: 45,
    speed: 4,
    dx: 0,
    dy: 0,
    isJumping: false,
    isCrouched: false,
    actionText: ""
};

let eagle = { x: 500, y: 80, width: 60, height: 30, speed: 1.5, active: true };
let bear = { x: 600, y: 290, width: 65, height: 50, present: true };

// --- CONTROLES ---
const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (e.key === 'f' || e.key === 'F') {
        gameState.furyMode = !gameState.furyMode;
    }

    if (e.key === 'Escape') {
        gameState.paused = !gameState.paused;
        document.getElementById("btn-pause").innerText = gameState.paused ? "Reanudar" : "Pausa";
    }

    if (gameState.paused) return;

    if (e.key === "z" || e.key === "Z") {
        player.actionText = "¡Zarpazos Rápidos! (Z)";
        playSound(400, 'square', 0.1);
        setTimeout(() => player.actionText = "", 600);
    }
    if (e.key === "x" || e.key === "X") {
        player.actionText = "¡Mordisco Feroz! (X)";
        playSound(250, 'sawtooth', 0.15);
        setTimeout(() => player.actionText = "", 600);
    }
    if (e.key === "c" || e.key === "C") {
        player.actionText = "¡Embestida / Bloqueo! (C)";
        playSound(500, 'triangle', 0.12);
        setTimeout(() => player.actionText = "", 600);
    }
    if (e.code === "Space") {
        player.actionText = "¡Coletazo Cargado! (Espacio)";
        playSound(180, 'square', 0.2);
        setTimeout(() => player.actionText = "", 800);
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// --- BUCLE PRINCIPAL ---
function gameLoop() {
    if (!gameState.paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fondo
        if (bgZone1.complete && bgZone1.naturalWidth !== 0) {
            ctx.drawImage(bgZone1, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = gameState.furyMode ? "#2a0808" : "#0d1b2a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Suelo
        ctx.fillStyle = "rgba(43, 24, 16, 0.7)";
        ctx.fillRect(0, 375, canvas.width, 75);

        // Movimiento
        let currentSpeed = gameState.furyMode ? player.speed * 1.5 : player.speed;
        player.dx = 0;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) player.dx = currentSpeed;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.dx = -currentSpeed;

        // Animación de los frames (avanza cada 5 ticks si se está moviendo)
        if (player.dx !== 0) {
            frameCounter++;
            if (frameCounter % 5 === 0) {
                currentFrameIndex = (currentFrameIndex + 1) % shadowFrames.length;
            }
        }

        // Agacharse
        if (keys['ArrowDown'] || keys['s'] || keys['S']) {
            player.isCrouched = true;
            player.height = 30;
            player.y = 345;
        } else {
            player.isCrouched = false;
            player.height = 45;
            player.y = 330;
        }

        // Salto
        if ((keys['ArrowUp'] || keys['w'] || keys['W']) && !player.isJumping && !player.isCrouched) {
            player.isJumping = true;
            player.dy = -8;
            playSound(600, 'sine', 0.1);
        }

        if (player.isJumping) {
            player.y += player.dy;
            player.dy += 0.4;
            if (player.y >= 330) {
                player.y = 330;
                player.isJumping = false;
                player.dy = 0;
            }
        }

        player.x += player.dx;
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) {
            player.x = 0;
            if (gameState.zone < 6) {
                gameState.zone++;
                if (gameState.daysToSnow > 1) gameState.daysToSnow--;
                updateUI();
            }
        }

        // Enemigos según zona
        if (gameState.zone === 1 && eagle.active) {
            ctx.fillStyle = "#3d2314";
            ctx.fillRect(eagle.x, eagle.y, eagle.width, eagle.height);
            eagle.x -= 0.8;
            if (eagle.x < -70) eagle.x = canvas.width + 50;
        }

        if (gameState.zone === 2 && bear.present) {
            ctx.fillStyle = "#4a3525";
            ctx.fillRect(580, 290, 65, 50);
            ctx.fillStyle = "#ffd166";
            ctx.fillRect(610, 275, 12, 12);
        }

        // --- RENDERIZAR EL FRAME ACTUAL DE SHADOW ---
        const activeSprite = shadowFrames[currentFrameIndex];
        if (activeSprite && activeSprite.complete && activeSprite.naturalWidth !== 0) {
            ctx.drawImage(activeSprite, player.x, player.y, player.width, player.height);
            if (gameState.furyMode) {
                ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
                ctx.fillRect(player.x, player.y, player.width, player.height);
            }
        } else {
            // Respaldo por si algún frame no cargó bien
            ctx.fillStyle = gameState.furyMode ? "#ef4444" : "#111111";
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }

        // Texto de acciones
        if (player.actionText !== "") {
            ctx.fillStyle = "#facc15";
            ctx.font = "bold 13px 'Courier New'";
            ctx.fillText(player.actionText, player.x - 10, player.y - 12);
        }

        // HUD flotante
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Courier New'";
        ctx.fillText(`Furia (F): ${gameState.furyMode ? "ACTIVADA" : "INACTIVA"} | Nieve en: ${gameState.daysToSnow}d`, 15, 25);
    } else {
        // Pantalla de pausa
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 26px 'Courier New'";
        ctx.fillText("PAUSA", 350, 180);
        
        ctx.font = "16px 'Courier New'";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText("Presiona [ Esc ] para Reanudar", 260, 230);
    }
    requestAnimationFrame(gameLoop);
}

// Inicio
updateUI();
gameLoop();
