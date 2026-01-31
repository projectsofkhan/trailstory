const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

const click = new Audio(
  "https://projectsofkhan.github.io/Trail/sounds/click.mp3"
);
click.volume = 0.4;

document.addEventListener("click", e => {
  if (e.target.closest("button") || e.target.closest(".app-icon")) {
    click.currentTime = 0;
    click.play().catch(()=>{});
  }
});

let musicOn = false;
function toggleMusic() {
  musicOn = !musicOn;
  if (musicOn) {
    bgMusic.play();
    musicBtn.classList.add("on");
  } else {
    bgMusic.pause();
    musicBtn.classList.remove("on");
  }
}

/* TIME */
const timeEl = document.getElementById("current-time");
function updateTime(){
  const d = new Date();
  timeEl.textContent =
    d.getHours() + ":" + d.getMinutes().toString().padStart(2,"0");
}
updateTime();
setInterval(updateTime,60000);