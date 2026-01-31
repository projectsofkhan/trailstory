const panel = document.getElementById("controlPanel");
const statusBar = document.getElementById("statusBar");

let startY = 0;
let dragging = false;

function openControlPanel() {
  panel.classList.add("open");
}

function closeControlPanel() {
  panel.classList.remove("open");
}

statusBar.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
  dragging = true;
});

statusBar.addEventListener("touchmove", e => {
  if (!dragging) return;
  if (e.touches[0].clientY - startY > 60) {
    openControlPanel();
    dragging = false;
  }
});

statusBar.addEventListener("touchend", () => dragging = false);

document.addEventListener("click", e => {
  if (panel.classList.contains("open") &&
      !panel.contains(e.target) &&
      !statusBar.contains(e.target)) {
    closeControlPanel();
  }
});