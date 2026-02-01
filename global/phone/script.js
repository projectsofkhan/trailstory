// global/script.js

(() => {
  const panel = document.getElementById("controlPanel");
  const bar = document.getElementById("statusBar");
  const music1 = document.getElementById("bgMusic1");
  const music2 = document.getElementById("bgMusic2");
  const musicText = document.getElementById("musicToggleText");
  const musicDot = document.getElementById("musicStatusIndicator");

  let startY = 0, dragging = false;
  let musicOn = false, currentMusic = null;

  function playClick() {
    const click = new Audio("https://projectsofkhan.github.io/Trail/sounds/click.mp3");
    click.volume = 0.3;
    click.play().catch(() => {});
  }

  function openPanel() {
    panel?.classList.add("open");
  }

  function closePanel() {
    panel?.classList.remove("open");
  }

  function initPullDown() {
    if (!bar || !panel) return;

    bar.addEventListener("touchstart", e => {
      startY = e.touches[0].clientY;
      dragging = true;
    });

    bar.addEventListener("touchmove", e => {
      if (!dragging) return;
      if (e.touches[0].clientY - startY > 70) {
        openPanel();
        dragging = false;
      }
    });

    bar.addEventListener("touchend", () => dragging = false);

    document.addEventListener("click", e => {
      if (panel?.classList.contains("open")) {
        if (!panel.contains(e.target) && !bar.contains(e.target)) closePanel();
      }
    });
  }

  function updateMusicUI() {
    if (musicText) musicText.textContent = musicOn ? "Turn off music" : "Turn on music";
    if (musicDot) musicDot.className = musicOn ? "status-indicator" : "status-indicator off";
  }

  function toggleMusic() {
    playClick();
    if (musicOn) {
      music1?.pause(); music2?.pause();
      musicOn = false; currentMusic = null;
    } else {
      playMusic1();
    }
    updateMusicUI();
  }

  function playMusic1() {
    playClick();
    music2?.pause();
    if (music1) { music1.currentTime = 0; music1.play().catch(() => {}); }
    musicOn = true; currentMusic = "m1";
    updateMusicUI(); closePanel();
  }

  function playMusic2() {
    playClick();
    music1?.pause();
    if (music2) { music2.currentTime = 0; music2.play().catch(() => {}); }
    musicOn = true; currentMusic = "m2";
    updateMusicUI(); closePanel();
  }

  document.addEventListener("click", e => {
    const tgt = e.target;
    if (tgt.closest(".music-btn")) playClick();
  });

  window.addEventListener("load", () => {
    initPullDown();
    updateMusicUI();
  });

  window.phoneControls = { toggleMusic, playMusic1, playMusic2 };
})();