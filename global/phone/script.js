const panel = document.getElementById("controlPanel");
const statusBar = document.getElementById("statusBar");

let startY = 0;
let active = false;

function openPanel() {
  panel.classList.add("open");
}

function closePanel() {
  panel.classList.remove("open");
}

statusBar.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
  active = true;
});

statusBar.addEventListener("touchmove", e => {
  if (!active) return;
  if (e.touches[0].clientY - startY > 60) {
    openPanel();
    active = false;
  }
});

statusBar.addEventListener("touchend", () => active = false);

document.addEventListener("click", e => {
  if (panel.classList.contains("open") &&
      !panel.contains(e.target) &&
      !statusBar.contains(e.target)) {
    closePanel();
  }
});