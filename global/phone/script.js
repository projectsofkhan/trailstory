const panel = document.getElementById("controlPanel");
const bar = document.getElementById("statusBar");

let startY = 0;
let pulling = false;

bar.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
  pulling = true;
});

bar.addEventListener("touchmove", e => {
  if (!pulling) return;
  if (e.touches[0].clientY - startY > 60) {
    panel.classList.add("open");
    pulling = false;
  }
});

bar.addEventListener("touchend", () => pulling = false);

document.addEventListener("touchstart", e => {
  if (
    panel.classList.contains("open") &&
    !panel.contains(e.target) &&
    !bar.contains(e.target)
  ) {
    panel.classList.remove("open");
  }
});