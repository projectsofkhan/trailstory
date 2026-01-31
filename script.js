// ===== DOM =====
const appGrid = document.getElementById("appGrid");
const timeEl = document.getElementById("current-time");
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

// ===== CLICK SOUND (ROOT PATH) =====
const clickSound = new Audio("click.mp3");
clickSound.volume = 0.4;

document.addEventListener("click", e => {
  if (
    e.target.closest("button") ||
    e.target.closest(".app-icon") ||
    e.target.closest(".status-bar")
  ) {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }
});

// ===== MUSIC =====
let musicOn = false;

function toggleMusic() {
  musicOn = !musicOn;

  if (musicOn) {
    bgMusic.play().catch(() => {});
    musicBtn.classList.add("on");
  } else {
    bgMusic.pause();
    musicBtn.classList.remove("on");
  }
}

// ===== TIME =====
function updateTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  timeEl.textContent = `${h}:${m}`;
}

updateTime();
setInterval(updateTime, 60000);

// ===== APPS =====
const apps = [
  { name: "Messages", icon: "💬", color: "#579AD9", file: "apps/messages/index.html" },
  { name: "Phone", icon: "📞", color: "#6BBF6B", file: "apps/phone/index.html" },
  { name: "Gallery", icon: "🌄", color: "#6A618F", file: "apps/gallery/index.html" },
  { name: "Instashan", icon: "📸", color: "#9B5BBE", file: "apps/instashan/index.html" },
  { name: "Diary", icon: "📖", color: "#A08E77", file: "apps/diary/index.html" },
  { name: "Browser", icon: "🌐", color: "#5D6B9C", file: "apps/browser/index.html" },
  { name: "Tasks", icon: "📋", color: "#FF6B6B", file: "apps/task/index.html" },
  { name: "Settings", icon: "⚙️", color: "#555555", file: "apps/settings/index.html" }
];

// ===== RENDER APPS =====
apps.forEach(app => {
  const a = document.createElement("a");
  a.className = "app-icon";
  a.href = app.file;

  a.innerHTML = `
    <div class="app-icon-body" style="background:${app.color}">
      ${app.icon}
    </div>
    <div class="app-icon-label">${app.name}</div>
  `;

  appGrid.appendChild(a);
});

console.log("✅ Root script loaded");