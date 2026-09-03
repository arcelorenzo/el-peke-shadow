// Estado global del juego
const gameState = {
    day: 9,
    level: 1,
    hp: 25,
    maxHp: 25,
    stage: 1,
    mouthSlots: ["🍖", "🍖"], // Colmillos con carne de reserva
    skills: ["Zarpazos rápidos"]
};

// Diccionario de Traducciones
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

function changeLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    document.getElementById("main-title").textContent = t.title;
    document.getElementById("btn-start").textContent = t.start;
    document.getElementById("lbl-volume").textContent = t.vol;
    document.getElementById("lbl-brightness").textContent = t.bri;
    document.getElementById("txt-day").textContent = t.day;
    document.getElementById("txt-level").textContent = t.level;
    document.getElementById("txt-mouth").textContent = t.mouth;
}

function changeBrightness(val) {
    document.getElementById("game-body").style.filter = `brightness(${val})`;
}

// Sintetizador Web Audio API de 8-bits
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const volume = parseFloat(document.getElementById("volume-slider").value);
    if (volume === 0) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
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

function updateUI() {
    document.getElementById("ui-day").textContent = gameState.day;
    document.getElementById("ui-level").textContent = gameState.level;
    document.getElementById("ui-hp").textContent = gameState.hp;
    document.getElementById("ui-max-hp").textContent = gameState.maxHp;
    document.getElementById("ui-mouth").textContent = gameState.mouthSlots.length > 0 ? gameState.mouthSlots.join(" ") : "❌";
}

function useMouthReserve() {
    if (gameState.mouthSlots.length > 0) {
        gameState.mouthSlots.pop();
        gameState.hp = Math.min(gameState.maxHp, gameState.hp + 5);
        playSound('heal');
        updateUI();
    } else {
        alert("¡Colmillos vacíos! Necesitas avanzar o cazar para rellenar la reserva de carne.");
    }
}

function startAdventure() {
    document.getElementById("options-screen").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    updateUI();
}

function togglePause() {
    alert("Juego en Pausa. Los peligros del bosque esperan...");
}

function saveGame() {
    localStorage.setItem("shadow_save", JSON.stringify(gameState));
    alert("¡Partida guardada con éxito en el navegador!");
    playSound('heal');
}

// Máquina de estados: Historia y Zonas
function handleGameAction() {
    const titleElem = document.getElementById("screen-title");
    const dialogueElem = document.getElementById("dialogue-text");
    const btnPrimary = document.getElementById("btn-primary");

    if (gameState.stage === 1) {
        playSound('slash');
        gameState.stage = 2;
        gameState.day = 8;
        titleElem.textContent = "Día 8 — El Lago y la Sed";
        dialogueElem.textContent = "Te ocultas de la sombra del águila y duermes en un tronco. Al despertar, caminas hasta un lago a beber agua y recuperar movilidad.";
        gameState.maxHp = 30;
        gameState.hp = 30;
        btnPrimary.innerHTML = "🐾 Imitar al Oso y Atacar con Mordida Feroz";
        updateUI();
    } else if (gameState.stage === 2) {
        playSound('bite');
        gameState.level = 4;
        gameState.skills.push("Mordida feroz");
        gameState.stage = 3;
        titleElem.textContent = "Batalla — Mapaches del Bosque";
        dialogueElem.textContent = "Comiste el salmón y subiste a Nivel 4. Los mapaches hostiles atacan, pero los vences usando tu nueva Mordida Feroz y zarpazos rápidos.";
        btnPrimary.innerHTML = "🐾 Avanzar al Bosque Verde (Zorros)";
        updateUI();
    } else if (gameState.stage === 3) {
        playSound('slash');
        gameState.level = 9;
        gameState.maxHp = 40;
        gameState.hp = 40;
        gameState.skills.push("Embestida");
        gameState.stage = 4;
        titleElem.textContent = "Día 7 — El Zorro Ágil";
        dialogueElem.textContent = "Un zorro veloz ataca con movilidad. Copias su movimiento, lo embistes para bloquear su golpe y abres paso al pantano.";
        btnPrimary.innerHTML = "🐾 Entrar al Pantano de Serpientes";
        updateUI();
    } else if (gameState.stage === 4) {
        playSound('bite');
        gameState.level = 15;
        gameState.maxHp = 50;
        gameState.hp = 50;
        gameState.skills.push("Coletazo defensivo");
        gameState.stage = 5;
        titleElem.textContent = "Territorio Rival y la Manada Hostil";
        dialogueElem.textContent = "Superaste las serpientes con tu coletazo defensivo y derrotaste al lobo alfa rival (subiendo a 65 HP). El invierno se acerca.";
        btnPrimary.innerHTML = "🐾 Enfrentar Montaña y Praderas (Jaguares y Osos)";
        updateUI();
    } else if (gameState.stage === 5) {
        playSound('slash');
        gameState.level = 40;
        gameState.maxHp = 85;
        gameState.hp = 85;
        gameState.stage = 6;
        titleElem.textContent = "El Umbral del Invierno — El Gran Oso (Nivel 95)";
        dialogueElem.textContent = "Cazas depredadores usando carne de reserva en tus colmillos. Estás frente al Gran Oso con cicatrices. Posee barra violeta y fase de furia.";
        btnPrimary.innerHTML = "🐾 Desatar Ataque Total (Colmillos y Habilidades)";
        btnPrimary.onclick = finalBossFight;
        updateUI();
    }
}

function finalBossFight() {
    playSound('bite');
    document.getElementById("screen-title").textContent = "👑 ¡Victoria Épica - El Pequeño Shadow!";
    document.getElementById("dialogue-text").innerHTML = `
        Desvías los brutales zarpazos del Gran Oso, rompes su barra de escudo violeta y resistes su estado de furia.<br><br>
        <em>Cinemática final:</em> El oso cae exhausto. El Lobichua, transformado en un cazador imponente cubierto de cicatrices, arrastra la gran presa de regreso a la manada.<br><br>
        Bajo la gran nevada, tus padres se acercan en silencio, te lamen la cabeza y te otorgan el título definitivo: <b>El Pequeño Shadow</b>. ¡Has vuelto a casa!
    `;
    document.getElementById("action-panel").innerHTML = `
        <a href="https://arcelorenzo.github.io/html-css-pracctica/" target="_blank" class="paw-button" style="text-align:center; text-decoration:none;">🐾 Visitar Portafolio del Creador</a>
        <button class="paw-button" onclick="location.reload()">🐾 Reiniciar Leyenda</button>
    `;
    gameState.mouthSlots = [];
    updateUI();
}
