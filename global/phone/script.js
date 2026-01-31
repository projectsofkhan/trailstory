const panel = document.getElementById("controlPanel");
const statusBar = document.getElementById("statusBar");

let startY = 0;
let pulling = false;

function openPanel() {
  panel.classList.add("open");
}

function closePanel() {
  panel.classList.remove("open");
}

statusBar.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
  pulling = true;
});

statusBar.addEventListener("touchmove", e => {
  if (!pulling) return;
  if (e.touches[0].clientY - startY > 60) {
    openPanel();
    pulling = false;
  }
});

statusBar.addEventListener("touchend", () => pulling = false);

document.addEventListener("click", e => {
  if (panel.classList.contains("open") &&
      !panel.contains(e.target) &&
      !statusBar.contains(e.target)) {
    closePanel();
  }
});

console.log("📱 Shutter active");