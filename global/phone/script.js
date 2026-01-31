const controlPanel = document.getElementById("controlPanel");
const statusBar = document.getElementById("statusBar");

let startY = 0;
let pulling = false;

function openPanel() { controlPanel.classList.add("open"); }
function closePanel() { controlPanel.classList.remove("open"); }

statusBar.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
  pulling = true;
});

statusBar.addEventListener("touchmove", e => {
  if (!pulling) return;
  if (e.touches[0].clientY - startY > 45) {
    openPanel();
    pulling = false;
  }
});

statusBar.addEventListener("touchend", () => pulling = false);

document.addEventListener("click", e => {
  if (controlPanel.classList.contains("open") &&
      !controlPanel.contains(e.target) &&
      !statusBar.contains(e.target)) {
    closePanel();
  }
});