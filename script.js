const appGrid = document.getElementById("appGrid");
const timeEl = document.getElementById("current-time");
const clickSound = document.getElementById("clickSound");

const apps = [
  { name: "Messages", icon: "💬", color: "#579AD9", file: "apps/messages/index.html" },
  { name: "Phone", icon: "📞", color: "#6BBF6B", file: "apps/phone/index.html" },
  { name: "Gallery", icon: "🌄", color: "#6A618F", file: "apps/gallery/index.html" },
  { name: "Instashan", icon: "📸", color: "#9B5BBE", file: "apps/instashan/index.html" },
  { name: "Diary", icon: "📖", color: "#A08E77", file: "apps/diary/index.html" },
  { name: "Browser", icon: "🌐", color: "#5D6B9C", file: "apps/browser/index.html" },
  { name: "Tasks", icon: "📋", color: "#FF6B6B", file: "apps/task/index.html" },
  { name: "Settings", icon: "⚙️", color: "#555", file: "apps/settings/index.html" }
];

function loadApps() {
  appGrid.innerHTML = "";
  apps.forEach(app => {
    const a = document.createElement("a");
    a.className = "app-icon";
    a.href = app.file;
    a.target = "_blank";
    a.innerHTML = `
      <div class="app-icon-body" style="background:${app.color}">${app.icon}</div>
      <div class="app-icon-label">${app.name}</div>
    `;
    appGrid.appendChild(a);
  });
}

function updateTime() {
  const d = new Date();
  timeEl.textContent = d.getHours() + ":" + d.getMinutes().toString().padStart(2,"0");
}

function toggleMusic() {
  const bg = document.getElementById("bgMusic1");
  if (!bg) return;
  if (bg.paused) bg.play(); else bg.pause();
}

function playMusicOne() { toggleMusic(); }
function playMusicTwo() { toggleMusic(); }

/* CLICK SOUND */
document.addEventListener("click", e => {
  const target = e.target.closest("a, button, .app-icon, .music-btn, .status-bar");
  if (target && clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(()=>{});
  }
});

window.onload = () => {
  loadApps();
  updateTime();
  setInterval(updateTime, 60000);
};