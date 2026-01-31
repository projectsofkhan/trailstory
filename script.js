const appGrid = document.getElementById("appGrid");
const timeEl = document.getElementById("current-time");

const apps = [
  { name: "Messages", icon: "💬", file: "apps/messages/index.html" },
  { name: "Phone", icon: "📞", file: "apps/phone/index.html" },
  { name: "Gallery", icon: "🌄", file: "apps/gallery/index.html" },
  { name: "Instashan", icon: "📸", file: "apps/instashan/index.html" },
  { name: "Tasks", icon: "📋", file: "apps/task/index.html" },
  { name: "Diary", icon: "📖", file: "apps/diary/index.html" },
  { name: "Browser", icon: "🌐", file: "apps/browser/index.html" },
  { name: "Settings", icon: "⚙️", file: "apps/settings/index.html" }
];

function loadApps() {
  apps.forEach(app => {
    const a = document.createElement("a");
    a.className = "app-icon";
    a.href = app.file;
    a.innerHTML = `
      <div class="app-icon-body">${app.icon}</div>
      <div class="app-icon-label">${app.name}</div>
    `;
    appGrid.appendChild(a);
  });
}

function updateTime() {
  const d = new Date();
  timeEl.textContent =
    d.getHours() + ":" + d.getMinutes().toString().padStart(2, "0");
}

window.onload = () => {
  loadApps();
  updateTime();
  setInterval(updateTime, 60000);
};