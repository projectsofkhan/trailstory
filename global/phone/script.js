const panel = document.getElementById("controlPanel");
const bar = document.getElementById("statusBar");

let startY = 0;
let dragging = false;

bar.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
  dragging = true;
});

bar.addEventListener("touchmove", e => {
  if (!dragging) return;
  if (e.touches[0].clientY - startY > 60) {
    panel.classList.add("open");
    dragging = false;
  }
});

bar.addEventListener("touchend", () => dragging = false);

document.addEventListener("touchstart", e => {
  if (panel.classList.contains("open") &&
      !panel.contains(e.target) &&
      !bar.contains(e.target)) {
    panel.classList.remove("open");
  }
});