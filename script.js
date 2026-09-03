const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let lastTime = 0;
const FPS = 60;
const frameInterval = 1000 / FPS;

// GESTIÓN DE ESCENAS: "MENU", "OPTIONS", "GAMEPLAY"
let currentScene = "MENU"; 

// VARIABLES DE CONFIGURACIÓN DEL MENÚ DE OPCIONES
let difficulty = "NORMAL"; 
let radarEnabled = true;   
let currentOptionIndex = 0; 
const TOTAL_OPTIONS = 3;    

// CONFIGURACIÓN DEL MAPA
const TILE_SIZE = 16;
const MAP_COLS = 32;
const MAP_ROWS = 15;
const WORLD_WIDTH = MAP_COLS * TILE_SIZE;
const WORLD_HEIGHT = MAP_ROWS * TILE_SIZE;

const hugeMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,0,1,1,1,0,1,0,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const tileColors = { 0: "#141010", 1: "#4a3b32", 2: "#00ffcc" };

const player = { x: 20, y: 20, w: 10, h: 10, speed: 2, isAlive: true };
const camera = { x: 0, y: 0, width: canvas.width, height: canvas.height };
const TORCH_RADIUS = 45;
let blinkTimer = 0;

const enemies = [
    { x: 120, y: 20,  w: 10, h: 10, vx: 1.5, vy: 0,   color: "#ff3333" },
    { x: 300, y: 80,  w: 10, h: 10, vx: -1.5, vy: 0,  color: "#ff3333" },
    { x: 240, y: 176, w: 10, h: 10, vx: 0,   vy: 1.5, color: "#ff3333" },
    { x: 420, y: 208, w: 10, h: 10, vx: 1.2, vy: 0,   color: "#ff3333" }
];

const keys = {};
window.addEventListener("keydown", e => {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.code)) {
        e.preventDefault();
    }
    keys[e.code] = true;

    // --- CONTROLES EN EL MENÚ PRINCIPAL ---
    if (currentScene === "MENU") {
        if (e.code === "Enter") {
            currentScene = "GAMEPLAY";
        } else if (e.code === "ArrowDown" || e.code === "ArrowUp") {
            currentScene = "OPTIONS";
            currentOptionIndex = 0;
        }
    }
    // --- CONTROLES EN EL MENÚ DE OPCIONES ---
    else if (currentScene === "OPTIONS") {
        if (e.code === "ArrowDown") {
            currentOptionIndex = (currentOptionIndex + 1) % TOTAL_OPTIONS;
        }
        if (e.code === "ArrowUp") {
            currentOptionIndex = (currentOptionIndex - 1 + TOTAL_OPTIONS) % TOTAL_OPTIONS;
        }

        if (currentOptionIndex === 0) { 
            if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
                if (difficulty === "NORMAL") difficulty = e.code === "ArrowRight" ? "DIFÍCIL" : "FÁCIL";
                else if (difficulty === "FÁCIL") difficulty = e.code === "ArrowRight" ? "NORMAL" : "DIFÍCIL";
                else if (difficulty === "DIFÍCIL") difficulty = e.code === "ArrowRight" ? "FÁCIL" : "NORMAL";
            }
        } else if (currentOptionIndex === 1) { 
            if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
                radarEnabled = !radarEnabled;
            }
        } else if (currentOptionIndex === 2) { 
            if (e.code === "Enter") {
                currentScene = "MENU";
            }
        }
    }
    // --- CONTROLES DE GAME OVER ---
    else if (currentScene === "GAMEPLAY" && !player.isAlive && e.code === "Enter") {
        restartGame();
    }
});
window.addEventListener("keyup", e => { keys[e.code] = false; });

function checkCollision(nextX, nextY, width, height) {
    let left = Math.floor(nextX / TILE_SIZE);
    let right = Math.floor((nextX + width - 1) / TILE_SIZE);
    let top = Math.floor(nextY / TILE_SIZE);
    let bottom = Math.floor((nextY + height - 1) / TILE_SIZE);

    if (left < 0 || right >= MAP_COLS || top < 0 || bottom >= MAP_ROWS) return true;
    return hugeMap[top][left] === 1 || hugeMap[top][right] === 1 || 
           hugeMap[bottom][left] === 1 || hugeMap[bottom][right] === 1;
}

function restartGame() {
    player.x = 20; player.y = 20; player.isAlive = true;
    currentScene = "GAMEPLAY";
    enemies[0].x = 120; enemies[0].vx = 1.5;
    enemies[1].x = 300; enemies[1].vx = -1.5;
    enemies[2].y = 176; enemies[2].vy = 1.5;
    enemies[3].x = 420; enemies[3].vx = 1.2;
}

function update() {
    blinkTimer = (blinkTimer + 1) % 30;

    if (currentScene === "GAMEPLAY" && player.isAlive) {
        let currentSpeed = player.speed;
        if (difficulty === "FÁCIL") currentSpeed = 2.5;
        if (difficulty === "DIFÍCIL") currentSpeed = 1.5;

        let nextX = player.x; let nextY = player.y;
        if (keys["ArrowLeft"])  nextX -= currentSpeed;
        if (keys["ArrowRight"]) nextX += currentSpeed;
        if (keys["ArrowUp"])    nextY -= currentSpeed;
        if (keys["ArrowDown"])  nextY += currentSpeed;

        if (!checkCollision(nextX, player.y, player.w, player.h)) player.x = nextX;
        if (!checkCollision(player.x, nextY, player.w, player.h)) player.y = nextY;

        enemies.forEach(enemy => {
            let enNextX = enemy.x + enemy.vx;
            let enNextY = enemy.y + enemy.vy;

            if (checkCollision(enNextX, enNextY, enemy.w, enemy.h)) {
                enemy.vx = -enemy.vx;
                enemy.vy = -enemy.vy;
            } else {
                enemy.x = enNextX;
                enemy.y = enNextY;
            }

            if (player.x < enemy.x + enemy.w && player.x + player.w > enemy.x &&
                player.y < enemy.y + enemy.h && player.y + player.h > enemy.y) {
                player.isAlive = false;
            }
        });

        camera.x = (player.x + player.w / 2) - camera.width / 2;
        camera.y = (player.y + player.h / 2) - camera.height / 2;
        camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH - camera.width));
        camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT - camera.height));
    }
}

function draw() {
    ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ================= MAIN MENU =================
    if (currentScene === "MENU") {
        ctx.fillStyle = "#00ffcc"; ctx.font = "8px 'Press Start 2P'"; ctx.textAlign = "center";
        ctx.fillText("8-BIT MASTER ENGINE", canvas.width / 2, 100);
        if (blinkTimer < 15) {
            ctx.fillStyle = "#ffffff";
            ctx.fillText("PRESIONA [ENTER] JUGAR", canvas.width / 2, 140);
        }
        ctx.fillStyle = "#70708a"; ctx.font = "6px 'Press Start 2P'";
        ctx.fillText("PRESIONA [↓] PARA AJUSTES", canvas.width / 2, 170);
    } 
    // ================= OPTIONS MENU =================
    else if (currentScene === "OPTIONS") {
        ctx.textAlign = "left";
        ctx.fillStyle = "#00ffcc"; ctx.font = "8px 'Press Start 2P'";
        ctx.fillText("AJUSTES DE JUEGO", 25, 50);

        ctx.fillStyle = "#ffffff"; ctx.font = "7px 'Press Start 2P'";
        ctx.fillText(`DIFICULTAD: < ${difficulty} >`, 45, 100);
        ctx.fillText(`VER RADAR:  < ${radarEnabled ? "SÍ" : "NO"} >`, 45, 130);
        ctx.fillText("VOLVER AL MENÚ", 45, 160);

        ctx.fillStyle = "#ffff00";
        let cursorY = 100 + (currentOptionIndex * 30);
        if (blinkTimer < 20) {
            ctx.fillText(">", 25, cursorY);
        }
    }
    // ================= GAMEPLAY =================
    else if (currentScene === "GAMEPLAY") {
        ctx.save();
        ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));
        
        for (let r = 0; r < MAP_ROWS; r++) {
            for (let c = 0; c < MAP_COLS; c++) {
                ctx.fillStyle = tileColors[hugeMap[r][c]];
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }

        enemies.forEach(enemy => {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
        });

        if (player.isAlive) {
            ctx.fillStyle = "#ffcc00";
            ctx.fillRect(player.x, player.y, player.w, player.h);
        }
        ctx.restore();

        if (player.isAlive) {
            const mask = document.createElement("canvas"); mask.width = canvas.width; mask.height = canvas.height;
            const mCtx = mask.getContext("2d");
            mCtx.fillStyle = "#020205"; mCtx.fillRect(0, 0, canvas.width, canvas.height);
            mCtx.globalCompositeOperation = "destination-out";

            let pScreenX = Math.floor(player.x + player.w/2 - camera.x);
            let pScreenY = Math.floor(player.y + player.h/2 - camera.y);
            let grad = mCtx.createRadialGradient(pScreenX, pScreenY, TORCH_RADIUS*0.1, pScreenX, pScreenY, TORCH_RADIUS);
            grad.addColorStop(0, "rgba(0,0,0,1)"); grad.addColorStop(1, "rgba(0,0,0,0)");
            mCtx.fillStyle = grad; mCtx.beginPath(); mCtx.arc(pScreenX, pScreenY, TORCH_RADIUS, 0, Math.PI*2); mCtx.fill();
            ctx.drawImage(mask, 0, 0);
        }

        // Si el radar está activado en las opciones, se dibuja
        if (radarEnabled) {
            const M_TILE = 2; const mX = canvas.width - (MAP_COLS * M_TILE) - 10; const mY = 10;
            ctx.fillStyle = "rgba(0, 0, 0, 0.85)"; ctx.fillRect(mX - 2, mY - 2, (MAP_COLS * M_TILE) + 4, (MAP_ROWS * M_TILE) + 4);
            for (let r = 0; r < MAP_ROWS; r++) {
                for (let c = 0; c < MAP_COLS; c++) {
                    if (hugeMap[r][c] === 1) {
                        ctx.fillStyle = "#44352a"; ctx.fillRect(mX + c * M_TILE, mY + r * M_TILE, M_TILE, M_TILE);
                    }
                }
            }
            if (blinkTimer < 15 && player.isAlive) {
                let pX = mX + Math.floor((player.x / WORLD_WIDTH) * (MAP_COLS * M_TILE));
                let pY = mY + Math.floor((player.y / WORLD_HEIGHT) * (MAP_ROWS * M_TILE));
                ctx.fillStyle = "#ff0000"; ctx.fillRect(pX, pY, M_TILE, M_TILE);
            }
        }

        if (!player.isAlive) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ff0033"; ctx.font = "8px 'Press Start 2P'"; ctx.textAlign = "center";
            ctx.fillText("¡TE ATRAPÓ EL FANTASMA!", canvas.width / 2, 100);
            if (blinkTimer < 15) {
                ctx.fillStyle = "#ffffff";
                ctx.fillText("PRESIONA [ENTER] PARA REINTENTAR", canvas.width / 2, 140);
            }
        }
    }
}

function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);
    const deltaTime = currentTime - lastTime;
    if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);
        update(); draw();
    }
}
requestAnimationFrame(gameLoop);
