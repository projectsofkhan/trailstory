// Global phone JS - Home screen like behavior
(() => {
  const controlPanel = document.getElementById('controlPanel');
  const statusBar = document.getElementById('statusBar');
  const music1 = document.getElementById('bgMusic1');
  const music2 = document.getElementById('bgMusic2');
  const musicText = document.getElementById('musicToggleText');
  const musicDot = document.getElementById('musicStatusIndicator');

  let dragging = false;
  let startY = 0;
  let musicOn = false;
  let currentMusic = null;

  function playClick() {
    const audio = new Audio('https://projectsofkhan.github.io/Trail/sounds/click.mp3');
    audio.volume = 0.3;
    audio.play().catch(()=>{});
  }

  function openPanel(){ controlPanel?.classList.add('open'); }
  function closePanel(){ controlPanel?.classList.remove('open'); }

  function updateMusicUI(){
    if(musicText) musicText.textContent = musicOn ? 'Turn Off Music' : 'Turn On Music';
    if(musicDot) musicDot.className = musicOn ? 'status-indicator' : 'status-indicator off';
  }

  function playMusic1(){
    playClick();
    if(music2) music2.pause();
    if(music1){ music1.currentTime = 0; music1.play().catch(()=>{}); }
    musicOn=true; currentMusic='music1';
    updateMusicUI(); closePanel();
  }

  function playMusic2(){
    playClick();
    if(music1) music1.pause();
    if(music2){ music2.currentTime=0; music2.play().catch(()=>{}); }
    musicOn=true; currentMusic='music2';
    updateMusicUI(); closePanel();
  }

  function toggleMusic(){
    playClick();
    if(musicOn){
      if(music1) music1.pause();
      if(music2) music2.pause();
      musicOn=false; currentMusic=null;
    } else playMusic1();
    updateMusicUI();
  }

  // Pull-down panel
  function initPullDown(){
    if(!statusBar || !controlPanel) return;

    const threshold = 55;
    statusBar.addEventListener('touchstart', e => { startY=e.touches[0].clientY; dragging=true; });
    statusBar.addEventListener('touchmove', e => {
      if(!dragging) return;
      if(e.touches[0].clientY - startY > threshold) { openPanel(); dragging=false; }
    });
    statusBar.addEventListener('touchend', ()=>dragging=false);

    // Mouse support
    statusBar.addEventListener('mousedown', e=>{ startY=e.clientY; dragging=true; });
    statusBar.addEventListener('mousemove', e=>{ if(dragging && e.clientY-startY>threshold){ openPanel(); dragging=false; } });
    statusBar.addEventListener('mouseup', ()=>dragging=false);

    document.addEventListener('click', e => {
      if(controlPanel.classList.contains('open') && !controlPanel.contains(e.target) && !statusBar.contains(e.target)){
        closePanel();
      }
    });
  }

  // Click sounds for all interactions
  function initClickSounds(){
    document.addEventListener('click', e=>{
      const t = e.target;
      if(t.closest('.app-icon, .music-control-btn, .status-bar, button, a, .close-panel')) playClick();
    });
  }

  // Initialize everything on load
  window.addEventListener('load', ()=>{
    initPullDown();
    initClickSounds();
    updateMusicUI();
    console.log('✅ Global phone scripts loaded - pull-down, music, click sounds all functional');
  });

  window.phoneControls = { toggleMusic, playMusic1, playMusic2 };
})();