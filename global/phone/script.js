const panel = document.getElementById("controlPanel");
const bar = document.getElementById("statusBar");

let startY = 0;
let active = false;

bar.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
  active = true;
});

bar.addEventListener("touchmove", e => {
  if (!active) return;
  if (e.touches[0].clientY - startY > 45) {
    panel.classList.add("open");
    active = false;
  }
});

bar.addEventListener("touchend", () => active = false);

document.addEventListener("touchstart", e => {
  if (panel.classList.contains("open") && !panel.contains(e.target) && !bar.contains(e.target)) {
    panel.classList.remove("open");
  }
});