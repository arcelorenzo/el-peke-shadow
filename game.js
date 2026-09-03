const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estado completo del juego reflejando la historia y progresión
let gameState = {
    hp: 85,
    maxHp: 85,
    zone: 1, // Zonas de 1 a 6 (Bosques, ríos, rocas, nieve, jefes)
    inventory: "Vacío", // Reserva de colmillos / carne / agua
    score: 0,
    paused: false,
    furyMode: false,
    bossShield: false
};

// Carga de tus imágenes reales desde la carpeta del proyecto
const bgZone1 = new Image();
bgZone1.src = "23ab9479b2f555bda9af1f71329ef902"; // Fondo de montaña nocturna

const shadowSprite = new Image();
shadowSprite.src = "videoframe_640"; // Sprite del lobito Shadow

// Referencias UI
const hpVal = document.getElementById("hp-val");
const zoneVal = document.getElementById("zone-val");
const inventoryVal = document.getElementById("inventory-val");

// Control de botones de interfaz
document.getElementById("btn-pause").addEventListener("click", () => {
    gameState.paused = !gameState.paused;
    document.getElementById("btn-pause").innerText = gameState.paused ? "Reanudar" : "Pausa";
});

document.getElementById("btn-save").addEventListener("click", () => {
    localStorage.setItem("lobo_save", JSON.stringify(gameState));
    alert("¡Partida guardada con éxito en el almacenamiento local!");
});

// Cargar datos guardados previamente si existen
const savedData = localStorage.getItem("lobo_save");
if (savedData) {
    const parsed = JSON.parse(savedData);
    gameState.hp = parsed.hp;
    gameState.zone = parsed.zone;
    gameState.inventory = parsed.inventory;
    updateUI();
}

function updateUI() {
    hpVal.innerText = gameState.hp;
    zoneVal.innerText = gameState.zone;
    inventoryVal.innerText = gameState.inventory;
}

// Sistema de Audio 8-bit (Web Audio API)
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

// Objeto del Personaje (Shadow / Lobito)
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

// Control Avanzado por Teclado
const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    // Activar Furia con 'f' o 'F'
    if (e.key === 'f' || e.key === 'F') {
        gameState.furyMode = !gameState.furyMode;
    }

    if (gameState.paused) return;

    // Acciones de Combate y Sonido
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

// Bucle principal del motor del juego
function gameLoop() {
    if (!gameState.paused) {
        // 1. Limpiar pantalla
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. Dibujar Fondo Real de la Montaña (o respaldo si carga)
        if (bgZone1.complete && bgZone1.naturalWidth !== 0) {
            ctx.drawImage(bgZone1, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "#09192f";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 3. Suelo sutil
        ctx.fillStyle = "rgba(27, 42, 71, 0.6)";
        ctx.fillRect(0, 375, canvas.width, 75);

        // 4. Gestión de Movimiento Horizontal
        let currentSpeed = gameState.furyMode ? player.speed * 1.5 : player.speed;
        player.dx = 0;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) player.dx = currentSpeed;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.dx = -currentSpeed;

        // Agacharse
        if (keys['ArrowDown']) {
            player.isCrouched = true;
            player.height = 30;
            player.y = 350;
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

        // Física de salto
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
                updateUI();
            }
        }

        // 5. Renderizar a Shadow (Lobito con su imagen real)
        if (shadowSprite.complete && shadowSprite.naturalWidth !== 0) {
            ctx.drawImage(shadowSprite, player.x, player.y, player.width, player.height);
            // Destello rojo si está en modo furia
            if (gameState.furyMode) {
                ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
                ctx.fillRect(player.x, player.y, player.width, player.height);
            }
        } else {
            // Respaldo por si la imagen tarda en cargar
            ctx.fillStyle = gameState.furyMode ? "#ef4444" : "#111111";
            ctx.fillRect(player.x, player.y, player.width, player.height);
        }

        // Texto de ataque en pantalla
        if (player.actionText !== "") {
            ctx.fillStyle = "#facc15";
            ctx.font = "bold 13px 'Courier New'";
            ctx.fillText(player.actionText, player.x - 10, player.y - 12);
        }

        // 6. Información y Estado en Pantalla
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Courier New'";
        ctx.fillText(`Zona ${gameState.zone}: Aventura del Lobito`, 15, 25);
        ctx.fillText(`Furia (F): ${gameState.furyMode ? "ACTIVADA" : "INACTIVA"}`, 15, 42);
        
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Controles: Flechas=Mover/Salto/Agachar | Z=Zarpazo X=Mordisco C=Embestida Espacio=Coletazo", 15, 435);
    }
    requestAnimationFrame(gameLoop);
}

// Iniciar motor
updateUI();
gameLoop();
