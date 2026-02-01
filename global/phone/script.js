// Global Mobile Script - fully fixed
(() => {
    const appGrid = document.getElementById('appGrid');
    const currentTimeElement = document.getElementById('current-time');
    const controlPanel = document.getElementById('controlPanel');
    const statusBar = document.getElementById('statusBar');
    const musicToggleText = document.getElementById('musicToggleText');
    const musicStatusIndicator = document.getElementById('musicStatusIndicator');

    const apps = [
        { id: 'messages', name: 'Messages', icon: '💬', color: '#579AD9', file: 'apps/messages/index.html' },
        { id: 'phone', name: 'Phone', icon: '📞', color: '#6BBF6B', file: 'apps/phone/index.html' },
        { id: 'gallery', name: 'Gallery', icon: '🌄', color: '#6A618F', file: 'apps/gallery/index.html' },
        { id: 'pixabowl', name: 'Instashan', icon: 'https://projectsofkhan.github.io/pythontodoapp/instashan.jpg', color: '#9B5BBE', file: 'apps/instashan/index.html' },
        { id: 'diary', name: 'Diary', icon: '📖', color: '#A08E77', file: 'apps/diary/index.html' },
        { id: 'browser', name: 'Browser', icon: '🌐', color: '#5D6B9C', file: 'apps/browser/index.html' },
        { id: 'taskmanager', name: 'Tasks', icon: '📋', color: '#FF6B6B', file: 'apps/task/index.html' },
        { id: 'settings', name: 'Settings', icon: '⚙️', color: '#555555', file: 'apps/settings/index.html' }
    ];

    let musicOn = false;
    let currentMusic = null;
    let bgMusic1 = null;
    let bgMusic2 = null;

    function playClick() {
        const sound = new Audio('https://projectsofkhan.github.io/Trail/sounds/click.mp3');
        sound.volume = 0.3;
        sound.play().catch(()=>{});
    }

    function updateMusicUI() {
        if (musicToggleText) musicToggleText.textContent = musicOn ? 'Turn Off Music' : 'Turn On Music';
        if (musicStatusIndicator) musicStatusIndicator.className = musicOn ? 'status-indicator' : 'status-indicator off';
    }

    function playMusicOne() {
        playClick();
        if (bgMusic2) bgMusic2.pause();
        if (bgMusic1) { bgMusic1.currentTime = 0; bgMusic1.play().catch(()=>{}); musicOn = true; currentMusic='music1'; }
        updateMusicUI();
        closeControlPanel();
    }

    function playMusicTwo() {
        playClick();
        if (bgMusic1) bgMusic1.pause();
        if (bgMusic2) { bgMusic2.currentTime = 0; bgMusic2.play().catch(()=>{}); musicOn = true; currentMusic='music2'; }
        updateMusicUI();
        closeControlPanel();
    }

    function toggleMusic() {
        if (musicOn) {
            if (bgMusic1) bgMusic1.pause();
            if (bgMusic2) bgMusic2.pause();
            musicOn=false; currentMusic=null;
        } else playMusicOne();
        updateMusicUI();
        playClick();
        closeControlPanel();
    }

    function openControlPanel() { controlPanel?.classList.add('open'); playClick(); }
    function closeControlPanel() { controlPanel?.classList.remove('open'); playClick(); }

    function initializePullDown() {
        if(!statusBar || !controlPanel) return;
        let startY = 0, dragging=false;
        const threshold = 50;

        statusBar.addEventListener('touchstart', e => { startY = e.touches[0].clientY; dragging=true; e.preventDefault(); });
        statusBar.addEventListener('touchmove', e => { if(dragging && e.touches[0].clientY - startY > threshold) { openControlPanel(); dragging=false; } });
        statusBar.addEventListener('touchend', ()=>dragging=false);

        statusBar.addEventListener('mousedown', e=>{ startY=e.clientY; dragging=true; });
        statusBar.addEventListener('mousemove', e=>{ if(dragging && e.clientY - startY > threshold) { openControlPanel(); dragging=false; } });
        statusBar.addEventListener('mouseup', ()=>dragging=false);

        document.addEventListener('click', e => {
            if(controlPanel.classList.contains('open') && !controlPanel.contains(e.target) && !statusBar.contains(e.target)) closeControlPanel();
        });
    }

    function setupClickSounds() {
        document.addEventListener('click', e=>{
            const t=e.target;
            if(t.closest('.app-icon, .music-control-btn, .status-bar, button, a, .close-panel')) playClick();
        });
    }

    function initializeMusic() {
        bgMusic1 = document.getElementById('bgMusic1');
        bgMusic2 = document.getElementById('bgMusic2');
        [bgMusic1, bgMusic2].forEach(m=>{ if(m){ m.volume=0.3; m.preload='auto'; } });
        updateMusicUI();
    }

    function updateTime() {
        const now = new Date();
        if(currentTimeElement) currentTimeElement.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    }

    function initializeAppGrid() {
        if (!appGrid) return;
        apps.forEach(app => {
            const link = document.createElement('a');
            link.className='app-icon';
            link.href = app.file;
            link.target="_blank";
            const isImage = app.icon.startsWith('http') || app.icon.endsWith('.jpg') || app.icon.endsWith('.png');
            const iconHTML = isImage ? `<img src="${app.icon}" alt="${app.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">` :
                                       `<div style="font-size:28px; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">${app.icon}</div>`;
            link.innerHTML = `<div class="app-icon-body" style="background-color:${app.color}; padding:0; overflow:hidden;">${iconHTML}</div>
                              <div class="app-icon-label">${app.name}</div>`;
            appGrid.appendChild(link);
        });
    }

    window.onload = function() {
        initializeAppGrid();
        updateTime();
        initializeMusic();
        initializePullDown();
        setupClickSounds();
        setInterval(updateTime, 60000);
    };

    window.phoneControls = { toggleMusic, playMusicOne, playMusicTwo };
})();