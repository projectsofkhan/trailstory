// DOM Elements
const panel = document.getElementById("controlPanel");
const bar = document.getElementById("statusBar");
const musicToggleText = document.getElementById("musicToggleText");
const musicStatusIndicator = document.getElementById("musicStatusIndicator");
let startY = 0, drag = false;

// Music Elements
let musicOn = false;
let currentMusic = null;
let bgMusic1 = document.getElementById("bgMusic1");
let bgMusic2 = document.getElementById("bgMusic2");

if(bgMusic1) { bgMusic1.volume = 0.3; bgMusic1.preload = 'auto'; }
if(bgMusic2) { bgMusic2.volume = 0.3; bgMusic2.preload = 'auto'; }

// Click sound
function playClickSound() {
  const sound = new Audio('https://projectsofkhan.github.io/Trail/sounds/click.mp3');
  sound.volume = 0.3;
  sound.play().catch(e => console.log(e));
}

// Panel drag down
bar.addEventListener("touchstart", e => { startY = e.touches[0].clientY; drag = true; });
bar.addEventListener("touchmove", e => {
  if(!drag) return;
  if(e.touches[0].clientY - startY > 55) { panel.classList.add("open"); drag = false; }
});
bar.addEventListener("touchend", () => drag = false);

// Click outside to close panel
document.addEventListener("touchstart", e => {
  if(panel.classList.contains("open") &&
     !panel.contains(e.target) &&
     !bar.contains(e.target)) {
    panel.classList.remove("open");
  }
});

// Music control
function updateMusicUI() {
  if(musicToggleText) musicToggleText.textContent = musicOn ? "Turn Off Music" : "Turn On Music";
  if(musicStatusIndicator) musicStatusIndicator.className = musicOn ? "status-indicator" : "status-indicator off";
}

function toggleMusic() {
  playClickSound();
  if(musicOn) {
    musicOn = false; currentMusic = null;
    if(bgMusic1) bgMusic1.pause();
    if(bgMusic2) bgMusic2.pause();
  } else playMusicOne();
  updateMusicUI(); panel.classList.remove("open");
}

function playMusicOne() {
  playClickSound();
  if(bgMusic1) {
    if(bgMusic2) bgMusic2.pause();
    bgMusic1.currentTime = 0; bgMusic1.play().catch(()=>{});
    musicOn = true; currentMusic = 'music1';
  }
  updateMusicUI(); panel.classList.remove("open");
}

function playMusicTwo() {
  playClickSound();
  if(bgMusic2) {
    if(bgMusic1) bgMusic1.pause();
    bgMusic2.currentTime = 0; bgMusic2.play().catch(()=>{});
    musicOn = true; currentMusic = 'music2';
  }
  updateMusicUI(); panel.classList.remove("open");
}

// Setup click sounds for panel buttons
document.addEventListener("click", e => {
  const target = e.target;
  if(target.closest(".music-control-btn") || target.closest(".close-panel") || target.closest(".status-bar")) {
    playClickSound();
  }
});

// Pull-down panel (desktop + mobile)
function initializePullDown() {
  let isDragging = false;
  bar.addEventListener("mousedown", e => { startY = e.clientY; isDragging = true; });
  bar.addEventListener("mousemove", e => {
    if(!isDragging) return;
    if(e.clientY - startY > 60) { panel.classList.add("open"); isDragging = false; }
  });
  bar.addEventListener("mouseup", () => isDragging = false);

  bar.addEventListener("touchstart", e => { startY = e.touches[0].clientY; isDragging = true; });
  bar.addEventListener("touchmove", e => {
    if(!isDragging) return;
    if(e.touches[0].clientY - startY > 60) { panel.classList.add("open"); isDragging = false; }
  });
  bar.addEventListener("touchend", () => isDragging = false);

  document.addEventListener("click", e => {
    if(panel.classList.contains("open") && !panel.contains(e.target) && !bar.contains(e.target)) {
      panel.classList.remove("open");
    }
  });
}

// Init
window.onload = () => {
  initializePullDown();
  console.log("✅ Phone panel + music fully functional");
};