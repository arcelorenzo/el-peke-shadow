// ==========================================
// EL PEQUEÑO SHADOW - MOTOR DE JUEGO (ESTILO 8-BIT)
// ==========================================

const translations = {
    es: {
        title: "EL PEQUEÑO SHADOW",
        start: "🐾 Iniciar el Viaje",
        vol: "🔊 Volumen de Audio:",
        bri: "☀️ Brillo de Pantalla:",
        day: "Día",
        level: "Nivel",
        mouth: "Colmillos"
    },
    en: {
        title: "THE LITTLE SHADOW",
        start: "🐾 Start Journey",
        vol: "🔊 Audio Volume:",
        bri: "☀️ Screen Brightness:",
        day: "Day",
        level: "Level",
        mouth: "Mouth"
    },
    it: {
        title: "IL PICCOLO SHADOW",
        start: "🐾 Inizia Viaggio",
        vol: "🔊 Volume Audio:",
        bri: "☀️ Luminosità Schermo:",
        day: "Giorno",
        level: "Livello",
        mouth: "Bocca"
    },
    fr: {
        title: "LE PETIT SHADOW",
        start: "🐾 Commencer",
        vol: "🔊 Volume Audio:",
        bri: "☀️ Luminosité Écran:",
        day: "Jour",
        level: "Niveau",
        mouth: "Bouche"
    },
    jp: {
        title: "小さなシャドウ",
        start: "🐾 旅を始める",
        vol: "🔊 オーディオ音量:",
        bri: "☀️ 画面の明るさ:",
        day: "日",
        level: "レベル",
        mouth: "口"
    },
    pt: {
        title: "O PEQUENO SHADOW",
        start: "🐾 Iniciar Jornada",
        vol: "🔊 Volume de Áudio:",
        bri: "☀️ Brilho da Tela:",
        day: "Dia",
        level: "Nível",
        mouth: "Boca"
    }
};

let currentLang = 'es';
let gameData = {
    day: 9,
    level: 1,
    hp: 25,
    maxHp: 25,
    mouth: "🍖🍖"
};

function changeLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    const mainTitle = document.getElementById("main-title");
    const btnStart = document.getElementById("btn-start");
    const lblVol = document.getElementById("lbl-volume");
    const lblBri = document.getElementById("lbl-brightness");
    const txtDay = document.getElementById("txt-day");
    const txtLevel = document.getElementById("txt-level");
    const txtMouth = document.getElementById("txt-mouth");
    
    if (mainTitle) mainTitle.textContent = t.title;
    if (btnStart) btnStart.textContent = t.start;
    if (lblVol) lblVol.textContent = t.vol;
    if (lblBri) lblBri.textContent = t.bri;
    if (txtDay) txtDay.textContent = t.day;
    if (txtLevel) txtLevel.textContent = t.level;
    if (txtMouth) txtMouth.textContent = t.mouth;
}

function changeBrightness(val) {
    const body = document.getElementById("game-body");
    if (body) body.style.filter = `brightness(${val})`;
}

// Sintetizador Web Audio API de 8-bits (Chip RP2A03 simulado)
let audioCtx = null;

function playSound(type) {
    const volumeSlider = document.getElementById("volume-slider");
    const volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.5;
    if (volume === 0) return;
    
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    let now = audioCtx.currentTime;

    gainNode.gain.setValueAtTime(volume * 0.2, now);

    if (type === 'slash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.15);
    } else if (type === 'bite') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
    } else if (type === 'heal') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.setValueAtTime(500, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
    }
    osc.start(now);
    osc.stop(now + 0.3);
}

function startAdventure() {
    playSound('bite');
    const optionsScreen = document.getElementById("options-screen");
    const gameContainer = document.getElementById("game-container");
    
    if (optionsScreen) optionsScreen.classList.add("hidden");
    if (gameContainer) gameContainer.classList.remove("hidden");
}

function togglePause() {
    playSound('slash');
    alert("⏸️ Juego en Pausa. ¡Tómate un respiro, Lobichua!");
}

function saveGame() {
    playSound('heal');
    localStorage.setItem('pequenoShadowSave', JSON.stringify(gameData));
    alert("💾 ¡Progreso guardado con éxito en la memoria del sistema!");
}

function useMouthReserve() {
    playSound('heal');
    if (gameData.hp < gameData.maxHp) {
        gameData.hp = Math.min(gameData.maxHp, gameData.hp + 5);
        document.getElementById("ui-hp").textContent = gameData.hp;
        alert("🥩 Has consumido carne de tu reserva. ¡+5 HP recuperados!");
    } else {
        alert("❤️ ¡Ya tienes la vida al máximo!");
    }
}

function handleGameAction() {
    playSound('slash');
    gameData.day += 1;
    document.getElementById("ui-day").textContent = gameData.day;
    document.getElementById("screen-title").textContent = `Día ${gameData.day} — El Camino en la Sombra`;
    document.getElementById("dialogue-text").textContent = "Avanzas sigilosamente entre la maleza helada. El peligro acecha, pero tu instinto de supervivencia te guía hacia adelante.";
}

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("btn-start");
    if (startBtn) {
        startBtn.addEventListener("click", startAdventure);
    }
});
