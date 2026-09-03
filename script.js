    // ==========================================
// EL PEQUEÑO SHADOW - MOTOR DE JUEGO (v2)
// ==========================================

const translations = {
    es: {
        title: "EL PEQUEÑO SHADOW",
        languageLabel: "Idioma / Language:",
        audioLabel: "Volumen de Audio:",
        brightnessLabel: "Brillo de Pantalla:",
        startBtn: "Iniciar el Viaje",
        day: "Día",
        health: "Vida",
        water: "Agua",
        inventory: "Inventario",
        fangs: "Colmillos",
        meat: "Carne",
        actions: "Acciones",
        hunt: "Cazar",
        drink: "Beber",
        rest: "Descansar",
        continue: "Continuar Viaje",
        gameOver: "Has caído en el camino... Fin del Viaje.",
        restart: "Reiniciar Aventura",
        zones: [
            "El Bosque Umbrío",
            "La Cañada Helada",
            "Las Colinas Aullantes",
            "El Río Congelado",
            "La Gran Cresta",
            "El Refugio de la Manada"
        ],
        events: [
            "Un viento helado azota los árboles. La sombra acecha en la oscuridad.",
            "Encuentras huellas frescas en la nieve. Alguien más anda cerca.",
            "El frío penetra en tus huesos, pero el calor de la manada te llama.",
            "Una tormenta se desata de repente. Debes buscar refugio rápido.",
            "El eco de un aullido lejano resuena entre las montañas nevadas."
        ]
    },
    en: {
        title: "LITTLE SHADOW",
        languageLabel: "Language / Idioma:",
        audioLabel: "Audio Volume:",
        brightnessLabel: "Screen Brightness:",
        startBtn: "Start Journey",
        day: "Day",
        health: "Health",
        water: "Water",
        inventory: "Inventory",
        fangs: "Fangs",
        meat: "Meat",
        actions: "Actions",
        hunt: "Hunt",
        drink: "Drink",
        rest: "Rest",
        continue: "Continue Journey",
        gameOver: "You have fallen on the path... End of Journey.",
        restart: "Restart Adventure",
        zones: [
            "The Shady Forest",
            "The Frozen Ravine",
            "The Howling Hills",
            "The Frozen River",
            "The Great Ridge",
            "The Pack Refuge"
        ],
        events: [
            "A freezing wind whips through the trees. Shadow lurks in the dark.",
            "You find fresh tracks in the snow. Someone else is nearby.",
            "The cold chills your bones, but the warmth of the pack calls you.",
            "A storm breaks out suddenly. You must find shelter quickly.",
            "The echo of a distant howl resonates among the snowy mountains."
        ]
    },
    it: {
        title: "IL PICCOLO SHADOW",
        languageLabel: "Lingua / Language:",
        audioLabel: "Volume Audio:",
        brightnessLabel: "Luminosità Schermo:",
        startBtn: "Inizia il Viaggio",
        day: "Giorno",
        health: "Salute",
        water: "Acqua",
        inventory: "Inventario",
        fangs: "Zanne",
        meat: "Carne",
        actions: "Azioni",
        hunt: "Caccia",
        drink: "Bevi",
        rest: "Riposa",
        continue: "Continua Viaggio",
        gameOver: "Sei caduto lungo il cammino... Fine del Viaggio.",
        restart: "Riavvia Avventura",
        zones: [
            "La Foresta Ombrosa",
            "La Ravina Ghiacciata",
            "Le Colline Urlanti",
            "Il Fiume Ghiacciato",
            "La Grande Cresta",
            "Il Rifugio del Branco"
        ],
        events: [
            "Un vento gelido sferza gli alberi. L'ombra si nasconde nel buio.",
            "Trovi impronte fresche nella neve. Qualcun altro è vicinissimo.",
            "Il freddo penetra nelle ossa, ma il calore del branco ti chiama.",
            "Una tempesta scoppia all'improvviso. Devi cercare riparo.",
            "L'eco di un ululato lontano risuona tra le montagne innevate."
        ]
    },
    fr: {
        title: "LE PETIT SHADOW",
        languageLabel: "Langue / Language:",
        audioLabel: "Volume Audio:",
        brightnessLabel: "Luminosité de l'Écran:",
        startBtn: "Commencer le Voyage",
        day: "Jour",
        health: "Santé",
        water: "Eau",
        inventory: "Inventaire",
        fangs: "Crocs",
        meat: "Viande",
        actions: "Actions",
        hunt: "Chasser",
        drink: "Boire",
        rest: "Se reposer",
        continue: "Continuer le Voyage",
        gameOver: "Vous êtes tombé sur le chemin... Fin du Voyage.",
        restart: "Recommencer l'Aventure",
        zones: [
            "La Forêt Ombragée",
            "Le Ravin Gelé",
            "Les Collines Hurlantes",
            "La Rivière Gelée",
            "La Grande Crête",
            "Le Refuge de la Meute"
        ],
        events: [
            "Un vent glacial fouette les arbres. L'ombre guette dans le noir.",
            "Vous trouvez des traces fraîches dans la neige. Quelqu'un est proche.",
            "Le froid pénètre vos os, mais la chaleur de la meute vous appelle.",
            "Une tempête éclate soudainement. Vous devez trouver un abri.",
            "L'écho d'un hurlement lointain résonne dans les montagnes enneigées."
        ]
    },
    ja: {
        title: "小さなシャドウ",
        languageLabel: "言語 / Language:",
        audioLabel: "音量 / Audio Volume:",
        brightnessLabel: "画面の明るさ / Brightness:",
        startBtn: "旅を始める",
        day: "日",
        health: "体力",
        water: "水分",
        inventory: "持ち物",
        fangs: "牙",
        meat: "肉",
        actions: "行動",
        hunt: "狩りをする",
        drink: "水を飲む",
        rest: "休む",
        continue: "旅を続ける",
        gameOver: "力尽きて倒れてしまった… 旅の終わり。",
        restart: "冒険をやり直す",
        zones: [
            "影の森",
            "凍てつく渓谷",
            "遠吠えの丘",
            "凍った川",
            "大連峰",
            "群れの隠れ家"
        ],
        events: [
            "凍てつく風が木々を揺らす。暗闇に影が潜んでいる。",
            "雪の上に新しい足跡を見つけた。誰かが近くにいる。",
            "寒さが骨身に染みるが、群れの温もりが君を呼んでいる。",
            "突然の吹雪。急いで身を隠す場所を探さなければならない。",
            "雪山に遠吠えのこだまが響き渡る。"
        ]
    },
    pt: {
        title: "O PEQUENO SHADOW",
        languageLabel: "Idioma / Language:",
        audioLabel: "Volume de Áudio:",
        brightnessLabel: "Brilho da Tela:",
        startBtn: "Iniciar a Viagem",
        day: "Dia",
        health: "Vida",
        water: "Água",
        inventory: "Inventário",
        fangs: "Presas",
        meat: "Carne",
        actions: "Ações",
        hunt: "Caçar",
        drink: "Beber",
        rest: "Descansar",
        continue: "Continuar Viagem",
        gameOver: "Você caiu pelo caminho... Fim da Viagem.",
        restart: "Reiniciar Aventura",
        zones: [
            "A Floresta Sombria",
            "O Desfiladeiro Gelado",
            "As Colinas Uivantes",
            "O Rio Congelado",
            "A Grande Crista",
            "O Refúgio da Alcateia"
        ],
        events: [
            "Um vento congelante açoita as árvores. A sombra espreita no escuro.",
            "Você encontra pegadas frescas na neve. Alguém mais está perto.",
            "O frio penetra em seus ossos, mas o calor da alcateia te chama.",
            "Uma tempestade desaba de repente. Você deve buscar abrigo rápido.",
            "O eco de um uivo distante ressoa entre as montanhas nevadas."
        ]
    }
};

let currentLang = 'es';
let audioVol = 0.5;
let screenBrightness = 1.0;

let gameState = {
    day: 1,
    health: 100,
    water: 100,
    fangs: 3,
    meat: 1,
    zoneIndex: 0
};

// SINTETIZADOR DE AUDIO 8-BIT
let audioCtx = null;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (audioVol <= 0) return;
    initAudio();
    if (!audioCtx) return;

    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    let now = audioCtx.currentTime;
    gain.gain.setValueAtTime(audioVol * 0.15, now);

    if (type === 'start') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
    } else if (type === 'action') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(300, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
}

// ACTUALIZAR TEXTOS DE LA INTERFAZ SEGÚN IDIOMA
function updateTexts() {
    const t = translations[currentLang];
    
    // Si estamos en el menú
    const titleEl = document.querySelector('h1, .title, .menu-title');
    if (titleEl) titleEl.innerText = t.title;

    const langLabel = document.querySelector('label[for="language-select"], .lang-label');
    if (langLabel) langLabel.innerText = t.languageLabel;

    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.innerText = t.startBtn;
}

// CAMBIO DE IDIOMA
document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('language-select');
    const audioSlider = document.getElementById('audio-slider');
    const brightnessSlider = document.getElementById('brightness-slider');
    const startBtn = document.getElementById('start-btn');

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            currentLang = e.target.value;
            updateTexts();
        });
    }

    if (audioSlider) {
        audioSlider.addEventListener('input', (e) => {
            audioVol = parseFloat(e.target.value);
        });
    }

    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', (e) => {
            screenBrightness = parseFloat(e.target.value);
            document.body.style.filter = `brightness(${screenBrightness})`;
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            playSound('start');
            startGame();
        });
    }
});

// INICIAR EL JUEGO (CAMBIO DE PANTALLA)
function startGame() {
    const t = translations[currentLang];
    const app = document.body; // O tu contenedor principal

    app.innerHTML = `
        <div style="max-width: 600px; margin: 40px auto; background: #111; border: 2px solid #444; padding: 20px; border-radius: 8px; font-family: monospace; color: #eee; box-shadow: 0 0 20px rgba(0,0,0,0.8);">
            <h2 id="zone-title" style="color: #ffaa00; text-align: center;">${t.zones[gameState.zoneIndex]}</h2>
            <p id="day-counter" style="text-align: center; font-weight: bold;">${t.day}: ${gameState.day} / 9</p>
            
            <div style="background: #222; padding: 15px; margin: 15px 0; border-radius: 5px;">
                <p>❤️ ${t.health}: <span id="val-health">${gameState.health}</span>%</p>
                <p>💧 ${t.water}: <span id="val-water">${gameState.water}</span>%</p>
                <p>🦷 ${t.fangs}: <span id="val-fangs">${gameState.fangs}</span> | 🥩 ${t.meat}: <span id="val-meat">${gameState.meat}</span></p>
            </div>

            <div id="event-box" style="background: #1a1a1a; border-left: 4px solid #ffaa00; padding: 12px; margin-bottom: 20px; font-style: italic;">
                ${t.events[Math.floor(Math.random() * t.events.length)]}
            </div>

            <h3 style="border-bottom: 1px solid #444; padding-bottom: 5px;">${t.actions}</h3>
            <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                <button onclick="doAction('hunt')" style="flex: 1; padding: 10px; background: #333; color: white; border: 1px solid #666; cursor: pointer; border-radius: 4px;">🐾 ${t.hunt}</button>
                <button onclick="doAction('drink')" style="flex: 1; padding: 10px; background: #333; color: white; border: 1px solid #666; cursor: pointer; border-radius: 4px;">💧 ${t.drink}</button>
                <button onclick="doAction('rest')" style="flex: 1; padding: 10px; background: #333; color: white; border: 1px solid #666; cursor: pointer; border-radius: 4px;">💤 ${t.rest}</button>
            </div>
        </div>
    `;
}

// ACCIONES DE SUPERVIVENCIA
function doAction(actionType) {
    playSound('action');
    const t = translations[currentLang];
    
    if (actionType === 'hunt') {
        gameState.meat += 1;
        gameState.water = Math.max(0, gameState.water - 10);
    } else if (actionType === 'drink') {
        gameState.water = Math.min(100, gameState.water + 30);
    } else if (actionType === 'rest') {
        gameState.health = Math.min(100, gameState.health + 15);
        gameState.water = Math.max(0, gameState.water - 5);
    }

    gameState.day += 1;
    if (gameState.day > 9 || gameState.zoneIndex >= t.zones.length - 1) {
        gameState.zoneIndex = Math.min(5, gameState.zoneIndex + 1);
    }

    // Actualizar valores en pantalla si existen
    const hEl = document.getElementById('val-health');
    const wEl = document.getElementById('val-water');
    const fEl = document.getElementById('val-fangs');
    const mEl = document.getElementById('val-meat');
    const dayEl = document.getElementById('day-counter');
    const zoneEl = document.getElementById('zone-title');
    const eventEl = document.getElementById('event-box');

    if (hEl) hEl.innerText = gameState.health;
    if (wEl) wEl.innerText = gameState.water;
    if (fEl) fEl.innerText = gameState.fangs;
    if (mEl) mEl.innerText = gameState.meat;
    if (dayEl) dayEl.innerText = `${t.day}: ${gameState.day} / 9`;
    if (zoneEl) zoneEl.innerText = t.zones[gameState.zoneIndex];
    if (eventEl) eventEl.innerText = t.events[Math.floor(Math.random() * t.events.length)];

    if (gameState.health <= 0 || gameState.water <= 0) {
        alert(t.gameOver);
        location.reload();
    }
}
