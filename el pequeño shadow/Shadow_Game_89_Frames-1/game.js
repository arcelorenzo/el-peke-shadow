// Shadow — juego base preparado para animaciones pixel-art.
// 89 frames de referencia: idle, caminar, correr, furia, ataque, salto y caída.
// Si colocas una hoja de sprites llamada "shadow_89_frames.png" junto a estos
// archivos, el motor intentará usarla; si no existe, utiliza un Shadow dibujado
// con formas pixeladas como respaldo.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const gameState = {
  zone: 1,
  paused: false,
  furyMode: false,
  hp: 100,
  daysToSnow: 9,
  level: 1,
  xp: 0
};

const player = {
  x: 110, y: 405, width: 70, height: 52,
  speed: 230, vx: 0, injured: true,
  direction: 1, animation: "idle",
  frame: 0, frameTimer: 0
};

const eagle = { x: 720, y: 105, width: 110, height: 58, speed: 65, active: true };
const bear = { x: 720, y: 395, width: 95, height: 70, active: false };
const fox = { x: 760, y: 398, width: 90, height: 58, active: false };

const bg = new Image();
bg.src = "fondo_montana_zona1.png";
const spriteSheet = new Image();
spriteSheet.src = "shadow_89_frames.png";
let spriteReady = false;
spriteSheet.onload = () => spriteReady = true;

const zones = {
  1: { title:"Faldas de la Montaña", sky:"#08172b", ground:"#10263b", accent:"#7da6d8" },
  2: { title:"El Lago y el Maestro", sky:"#12304b", ground:"#173c40", accent:"#8bc9d1" },
  3: { title:"Bosque Denso", sky:"#12291d", ground:"#17351f", accent:"#8fb36a" },
  4: { title:"Valle Verde", sky:"#24402b", ground:"#29452a", accent:"#d4bd67" }
};

const keys = new Set();
window.addEventListener("keydown", e => {
  if (["ArrowLeft","ArrowRight","a","d","A","D","f","F","Escape"].includes(e.key)) e.preventDefault();

  if (e.key === "Escape") {
    gameState.paused = !gameState.paused;
    document.getElementById("pausePanel").classList.toggle("hidden", !gameState.paused);
    return;
  }
  if (e.key.toLowerCase() === "f" && !e.repeat && !gameState.paused) {
    gameState.furyMode = !gameState.furyMode;
  }
  keys.add(e.key.toLowerCase());
});
window.addEventListener("keyup", e => keys.delete(e.key.toLowerCase()));

document.getElementById("restartBtn").addEventListener("click", resetZone);

function resetZone(){
  player.x = 110;
  player.vx = 0;
  player.frame = 0;
  gameState.paused = false;
  document.getElementById("pausePanel").classList.add("hidden");
}

function update(dt){
  if (gameState.paused) return;

  let input = 0;
  if (keys.has("a") || keys.has("arrowleft")) input -= 1;
  if (keys.has("d") || keys.has("arrowright")) input += 1;

  const injuryPenalty = player.injured ? 0.70 : 1;
  const furyBoost = gameState.furyMode ? 1.50 : 1;
  player.vx = input * player.speed * injuryPenalty * furyBoost;
  player.x += player.vx * dt;

  if (input !== 0) {
    player.direction = input > 0 ? 1 : -1;
    player.animation = gameState.furyMode ? "fury" : (Math.abs(player.vx) > 260 ? "run" : "walk");
  } else {
    player.animation = gameState.furyMode ? "fury" : "idle";
  }

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  player.frameTimer += dt;
  if (player.frameTimer > 0.10) {
    player.frameTimer = 0;
    player.frame++;
  }

  updateEnemies(dt);

  if (player.x >= canvas.width - player.width - 2) {
    if (gameState.zone < 4) {
      gameState.zone++;
      player.x = 8;
      gameState.daysToSnow = Math.max(1, gameState.daysToSnow - 1);
      player.injured = false;
      gameState.level = Math.min(4, gameState.level + 1);
      gameState.xp = 0;
    } else {
      player.x = canvas.width - player.width - 4;
    }
  }

  updateUI();
}

function updateEnemies(dt){
  eagle.active = gameState.zone === 1;
  bear.active = gameState.zone === 2;
  fox.active = gameState.zone === 4;

  if (eagle.active) {
    eagle.x -= eagle.speed * dt;
    if (eagle.x < -140) eagle.x = canvas.width + 60;
  }
  if (bear.active) {
    bear.x += Math.sin(performance.now()/700) * 0.25;
  }
  if (fox.active) {
    fox.x += Math.sin(performance.now()/500) * 0.6;
  }
}

function updateUI(){
  document.getElementById("zone").textContent = gameState.zone;
  document.getElementById("level").textContent = gameState.level;
  document.getElementById("hp").textContent = gameState.hp;
  document.getElementById("xp").textContent = `${gameState.xp} / 100`;
  document.getElementById("snowDays").textContent = `${gameState.daysToSnow}d`;
  const fury = document.getElementById("furyText");
  fury.textContent = `Furia: ${gameState.furyMode ? "ON" : "OFF"}`;
  fury.style.color = gameState.furyMode ? "#ff655c" : "";
}

function drawPixelWolf(x,y,w,h,dir=1,fury=false){
  ctx.save();
  ctx.translate(x + (dir < 0 ? w : 0), y);
  ctx.scale(dir,1);
  if (fury) {
    ctx.fillStyle="#7d211c";
    ctx.fillRect(-6,h*0.2,w+12,h*0.65);
  }
  ctx.fillStyle="#0a0c12";
  ctx.fillRect(w*.18,h*.35,w*.62,h*.36);
  ctx.fillRect(w*.32,h*.18,w*.25,h*.22);
  ctx.fillRect(w*.05,h*.43,w*.20,h*.18);
  ctx.fillRect(w*.68,h*.26,w*.22,h*.20);
  ctx.fillRect(w*.72,h*.46,w*.10,h*.10);
  ctx.fillRect(w*.23,h*.68,w*.10,h*.25);
  ctx.fillRect(w*.62,h*.68,w*.10,h*.25);
  ctx.fillRect(w*.06,h*.18,w*.10,h*.22);
  ctx.fillRect(w*.18,h*.08,w*.12,h*.18);
  ctx.fillStyle="#e6b94e";
  ctx.fillRect(w*.73,h*.31,Math.max(5,w*.07),Math.max(5,h*.08));
  if (fury) {
    ctx.fillStyle="#ff4b25";
    ctx.fillRect(w*.72,h*.29,Math.max(7,w*.09),Math.max(7,h*.11));
  }
  ctx.restore();
}

function drawEagle(){
  ctx.save();
  ctx.translate(eagle.x,eagle.y);
  ctx.fillStyle="#1b1410";
  ctx.fillRect(20,25,70,18);
  ctx.fillRect(0,18,35,10);
  ctx.fillRect(70,18,40,10);
  ctx.fillStyle="#eee";
  ctx.fillRect(18,22,18,12);
  ctx.fillStyle="#d39b38";
  ctx.fillRect(12,28,8,5);
  ctx.restore();
}

function drawBear(){
  ctx.fillStyle="#704324";
  ctx.fillRect(bear.x+18,bear.y+18,58,42);
  ctx.fillRect(bear.x+10,bear.y+5,28,28);
  ctx.fillRect(bear.x+62,bear.y+10,22,25);
  ctx.fillStyle="#b87b46";
  ctx.fillRect(bear.x+18,bear.y+12,10,10);
}

function drawFox(){
  ctx.fillStyle="#c96e20";
  ctx.fillRect(fox.x+18,fox.y+20,55,27);
  ctx.fillRect(fox.x+5,fox.y+15,25,25);
  ctx.fillRect(fox.x+68,fox.y+5,18,42);
  ctx.fillStyle="#f3c789";
  ctx.fillRect(fox.x+8,fox.y+25,18,8);
  ctx.fillRect(fox.x+70,fox.y+6,15,10);
}

function drawBackground(){
  const z = zones[gameState.zone];
  if (bg.complete && bg.naturalWidth && gameState.zone === 1) {
    ctx.drawImage(bg,0,0,canvas.width,canvas.height);
  } else {
    ctx.fillStyle=z.sky;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Luna / cielo
    ctx.fillStyle=gameState.furyMode ? "#e35a46" : "#d8e6f7";
    ctx.fillRect(760,55,34,34);

    // Montañas pixeladas
    ctx.fillStyle="#1b2d43";
    for(let i=0;i<8;i++){
      const px=i*145-50;
      ctx.beginPath();
      ctx.moveTo(px,330); ctx.lineTo(px+75,150-(i%2)*35); ctx.lineTo(px+160,330);
      ctx.fill();
    }

    // Árboles
    ctx.fillStyle="#0c1b25";
    for(let x=0;x<canvas.width;x+=55){
      ctx.fillRect(x,265,10,105);
      ctx.beginPath();
      ctx.moveTo(x-22,315);ctx.lineTo(x+5,225);ctx.lineTo(x+32,315);ctx.fill();
    }
  }

  if(gameState.furyMode){
    ctx.fillStyle="rgba(110,0,0,.28)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  ctx.fillStyle=z.ground;
  ctx.fillRect(0,445,canvas.width,95);
  ctx.fillStyle="#243d55";
  ctx.fillRect(0,445,canvas.width,7);

  ctx.fillStyle="#dce9f6";
  ctx.font="16px Courier New";
  ctx.fillText(`Huyendo del Águila · Zona ${gameState.zone}: ${z.title}`,18,27);
}

function draw(){
  drawBackground();

  if (eagle.active) drawEagle();
  if (bear.active) drawBear();
  if (fox.active) drawFox();

  // El motor queda preparado para una hoja de sprites real.
  // La hoja generada de 89 frames puede incorporarse después como asset.
  drawPixelWolf(player.x,player.y,player.width,player.height,player.direction,gameState.furyMode);

  ctx.fillStyle="#07101b";
  ctx.fillRect(12,495,210,30);
  ctx.fillStyle="#dbe6f4";
  ctx.font="14px Courier New";
  ctx.fillText("A / D = Mover   F = Furia",22,515);

  ctx.fillStyle="#07101b";
  ctx.fillRect(canvas.width-125,495,113,30);
  ctx.fillStyle="#dbe6f4";
  ctx.fillText("ESC = Pausa",canvas.width-114,515);
}

let last = performance.now();
function loop(now){
  const dt = Math.min((now-last)/1000,0.05);
  last=now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

updateUI();
requestAnimationFrame(loop);
