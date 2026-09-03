const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estado del juego
let gameState = {
    hp: 85,
    maxHp: 85,
    zone: 1,
    inventory: "Vacío",
    paused: false
};

// Referencias UI
const hpVal = document.getElementById("hp-val");
const zoneVal = document.getElementById("zone-val");
const inventoryVal = document.getElementById("inventory-val");

document.getElementById("btn-pause").addEventListener("click", () => {
    gameState.paused = !gameState.paused;
    document.getElementById("btn-pause").innerText = gameState.paused ? "Reanudar" : "Pausa";
});

document.getElementById("btn-save").addEventListener("click", () => {
    localStorage.setItem("lobo_save", JSON.stringify(gameState));
    alert("¡Partida guardada con éxito!");
});

// Cargar datos si existen
const savedData = localStorage.getItem("lobo_save");
if (savedData) {
    const parsed = JSON.parse(savedData);
    gameState.hp = parsed.hp;
    gameState.zone = parsed.zone;
    gameState.inventory = parsed.inventory;
    hpVal.innerText = gameState.hp;
    zoneVal.innerText = gameState.zone;
    inventoryVal.innerText = gameState.inventory;
}

// Bucle principal de renderizado (Mockup base para conectar imágenes luego)
function gameLoop() {
    if (!gameState.paused) {
        // Limpiar pantalla
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fondo temporal estilo pixel art nocturno
        ctx.fillStyle = "#09192f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Suelo del mapa diverso
        ctx.fillStyle = "#1b2a47";
        ctx.fillRect(0, 380, canvas.width, 70);

        // Dibujar indicador visual del personaje / entorno
        ctx.fillStyle = "#58a6ff";
        ctx.fillRect(100, 330, 30, 50); // Posición del lobo de prueba
        
        ctx.fillStyle = "#8b949e";
        ctx.font = "12px 'Courier New'";
        ctx.fillText("Zona de Bosques, Ríos y Rocas (Listo para sprites)", 20, 30);
    }
    requestAnimationFrame(gameLoop);
}

// Iniciar bucle
gameLoop();
