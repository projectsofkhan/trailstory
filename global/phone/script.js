// Global Mobile Functionality Script

// DOM Elements
const panel = document.getElementById("controlPanel");
const bar = document.getElementById("statusBar");
const music1 = document.getElementById("bgMusic1");
const music2 = document.getElementById("bgMusic2");
const musicToggleText = document.getElementById("musicToggleText");
const musicStatusIndicator = document.getElementById("musicStatusIndicator");

let startY = 0, drag = false;
let musicOn = false;
let currentMusic = null;

// Play click sound
function playClickSound() {
    const sound = new Audio('https://projectsofkhan.github.io/Trail/sounds/click.mp3');
    sound.volume = 0.3;
    sound.play().catch(() => {});
}

// Pull-down control panel (touch/mouse)
function initializePullDown() {
    if (!bar || !panel) return;

    // Touch events
    bar.addEventListener("touchstart", e => { startY = e.touches[0].clientY; drag = true; });
    bar.addEventListener("touchmove", e => {
        if (!drag) return;
        if (e.touches[0].clientY - startY > 55) { panel.classList.add("open"); drag = false; }
    });
    bar.addEventListener("touchend", () => drag = false);

    // Mouse support for testing
    bar.addEventListener("mousedown", e => { startY = e.clientY; drag = true; });
    bar.addEventListener("mousemove", e => { if (drag && e.clientY - startY > 55) { panel.classList.add("open"); drag = false; } });
    bar.addEventListener("mouseup", () => drag = false);

    // Click outside to close
    document.addEventListener("click", e => {
        if (panel.classList.contains("open") &&
            !panel.contains(e.target) &&
            !bar.contains(e.target)) panel.classList.remove("open");
    });
}

// Music controls
function updateMusicUI() {
    if (musicToggleText) musicToggleText.textContent = musicOn ? "Turn Off Music" : "Turn On Music";
    if (musicStatusIndicator) musicStatusIndicator.className = musicOn ? "status-indicator" : "status-indicator off";
}

function toggleMusic() {
    playClickSound();
    if (musicOn) {
        musicOn = false; currentMusic = null;
        music1?.pause(); music2?.pause();
    } else playMusic1();
    updateMusicUI();
}

function playMusic1() {
    playClickSound();
    music2?.pause();
    if (music1) { music1.currentTime = 0; music1.play().catch(() => {}); }
    musicOn = true; currentMusic = "music1";
    updateMusicUI(); panel?.classList.remove("open");
}

function playMusic2() {
    playClickSound();
    music1?.pause();
    if (music2) { music2.currentTime = 0; music2.play().catch(() => {}); }
    musicOn = true; currentMusic = "music2";
    updateMusicUI(); panel?.classList.remove("open");
}

// Click sounds for all interactive elements
function setupClickSounds() {
    document.addEventListener("click", e => {
        const t = e.target;
        if (t.tagName === 'BUTTON' || t.tagName === 'A' ||
            t.closest('.app-icon') || t.closest('.music-control-btn') ||
            t.closest('.status-bar') || t.closest('.close-panel') ||
            t.hasAttribute('onclick') || t.classList.contains('clickable') ||
            (t.parentElement && t.parentElement.classList.contains('clickable'))) {
            playClickSound();
        }
    });
}

// Initialize global mobile scripts
window.addEventListener("load", () => {
    initializePullDown();
    setupClickSounds();
    console.log("✅ Global mobile functionalities ready");
});