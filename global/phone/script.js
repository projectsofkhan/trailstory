// Global phone functionality - pull-down panel, music, click sounds
(() => {
  const panel = document.getElementById("controlPanel");
  const bar = document.getElementById("statusBar");
  const music1 = document.getElementById("bgMusic1");
  const music2 = document.getElementById("bgMusic2");
  const musicText = document.getElementById("musicToggleText");
  const musicDot = document.getElementById("musicStatusIndicator");

  let startY = 0, dragging = false;
  let musicOn = false, currentMusic = null;

  // Play click sound
  function playClick() {
    try {
      const sound = new Audio('https://projectsofkhan.github.io/Trail/sounds/click.mp3');
      sound.volume = 0.3;
      sound.play();
    } catch(e){}
  }

  // Open/close panel
  function openPanel(){ panel?.classList.add("open"); }
  function closePanel(){ panel?.classList.remove("open"); }

  // Pull-down panel functionality
  function initPullDown() {
    if(!bar || !panel) return;
    const threshold = 60;

    // Touch
    bar.addEventListener("touchstart", e => { startY=e.touches[0].clientY; dragging=true; });
    bar.addEventListener("touchmove", e => {
      if(!dragging) return;
      if(e.touches[0].clientY-startY>threshold){ openPanel(); dragging=false; }
    });
    bar.addEventListener("touchend", ()=>dragging=false);

    // Mouse (desktop testing)
    bar.addEventListener("mousedown", e=>{ startY=e.clientY; dragging=true; });
    bar.addEventListener("mousemove", e=>{ if(dragging && e.clientY-startY>threshold){ openPanel(); dragging=false; }});
    bar.addEventListener("mouseup", ()=>dragging=false);

    // Close panel on outside click/tap
    document.addEventListener("click", e => {
      if(panel?.classList.contains("open") &&
         !panel.contains(e.target) && !bar.contains(e.target)) closePanel();
    });
  }

  // Music functions
  function updateMusicUI(){
    if(musicText) musicText.textContent = musicOn ? "Turn Off Music" : "Turn On Music";
    if(musicDot) musicDot.className = musicOn ? "status-indicator" : "status-indicator off";
  }

  function toggleMusic(){
    playClick();
    if(musicOn){ music1?.pause(); music2?.pause(); musicOn=false; currentMusic=null; }
    else playMusic1();
    updateMusicUI();
  }

  function playMusic1(){
    playClick();
    music2?.pause();
    if(music1){ music1.currentTime=0; music1.play().catch(()=>{}); }
    musicOn=true; currentMusic="music1"; updateMusicUI(); closePanel();
  }

  function playMusic2(){
    playClick();
    music1?.pause();
    if(music2){ music2.currentTime=0; music2.play().catch(()=>{}); }
    musicOn=true; currentMusic="music2"; updateMusicUI(); closePanel();
  }

  // Click sounds for interactive elements
  function initClickSounds(){
    document.addEventListener("click", e => {
      const t = e.target;
      if(t.closest(".music-btn, .app-icon, .status-bar, button, a, .close-panel")) playClick();
    });
  }

  // Initialize global scripts
  window.addEventListener("load", ()=>{
    initPullDown();
    initClickSounds();
    updateMusicUI();
    console.log("✅ Global mobile functionalities loaded");
  });

  // Expose music controls globally
  window.phoneControls = { toggleMusic, playMusic1, playMusic2 };
})();