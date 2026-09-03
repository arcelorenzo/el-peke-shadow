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
    y: 330,
    width: 30,
    height: 50,
    speed: 4,
    dx: 0
};

// Controles de movimiento
window.addEventListener("keydown", (e) => {
    if (gameState.paused) return;
    if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
    if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
    if (e.key === " " || e.key === "ArrowUp") {
        // Acción de ataque o salto / morder
        playSound(300, 'square', 0.15);
    }
});

window.addEventListener("keyup", (e) => {
    if ((e.key === "ArrowRight" || e.key === "d") && player.dx > 0) player.dx = 0;
    if ((e.key === "ArrowLeft" || e.key === "a") && player.dx < 0) player.dx = 0;
});

// Bucle principal del motor del juego
function gameLoop() {
    if (!gameState.paused) {
        // Limpiar pantalla
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fondo atmosférico según la zona actual (Bosques, ríos, rocas, nieve)
        if (gameState.zone <= 2) {
            ctx.fillStyle = "#09192f"; // Bosque nocturno
        } else if (gameState.zone <= 4) {
            ctx.fillStyle = "#112233"; // Ríos y rocas
        } else {
            ctx.fillStyle = "#1e293b"; // Paisaje invernal profundo
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar suelo del mapa diverso
        ctx.fillStyle = "#1b2a47";
        ctx.fillRect(0, 380, canvas.width, 70);

        // Actualizar posición del jugador
        player.x += player.dx;
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

        // Renderizar al personaje (temporalmente en bloque de color hasta cargar spritesheets)
        ctx.fillStyle = gameState.furyMode ? "#ef4444" : "#58a6ff"; // Rojo si está en furia, celeste normal
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Información en pantalla de la aventura
        ctx.fillStyle = "#8b949e";
        ctx.font = "12px 'Courier New'";
        ctx.fillText(`Mapa Activo - Zona ${gameState.zone}: Bosques, Ríos, Rocas y Bichos`, 20, 30);
        ctx.fillText(`Modo Furia: ${gameState.furyMode ? "Activado" : "Inactivo"} | Escudo: ${gameState.bossShield ? "Activo" : "Ninguno"}`, 20, 50);
    }
    requestAnimationFrame(gameLoop);
}

// Iniciar motor
updateUI();
gameLoop();
