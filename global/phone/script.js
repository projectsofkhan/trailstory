// Global phone functionality - working pull-down like home screen
(() => {
    const controlPanel = document.getElementById('controlPanel');
    const statusBar = document.getElementById('statusBar');
    const music1 = document.getElementById('bgMusic1');
    const music2 = document.getElementById('bgMusic2');
    const musicToggleText = document.getElementById('musicToggleText');
    const musicStatusIndicator = document.getElementById('musicStatusIndicator');

    let startY = 0;
    let dragging = false;
    let musicOn = false;
    let currentMusic = null;

    // Play click sound
    function playClick() {
        const click = new Audio('https://projectsofkhan.github.io/Trail/sounds/click.mp3');
        click.volume = 0.3;
        click.play().catch(() => {});
    }

    // Open / Close panel
    function openPanel() { controlPanel?.classList.add('open'); }
    function closePanel() { controlPanel?.classList.remove('open'); }

    function updateMusicUI() {
        if (musicToggleText) musicToggleText.textContent = musicOn ? 'Turn Off Music' : 'Turn On Music';
        if (musicStatusIndicator) musicStatusIndicator.className = musicOn ? 'status-indicator' : 'status-indicator off';
    }

    function playMusic1() {
        playClick();
        if (music2) music2.pause();
        if (music1) { music1.currentTime = 0; music1.play().catch(() => {}); musicOn = true; currentMusic = 'music1'; }
        updateMusicUI(); closePanel();
    }

    function playMusic2() {
        playClick();
        if (music1) music1.pause();
        if (music2) { music2.currentTime = 0; music2.play().catch(() => {}); musicOn = true; currentMusic = 'music2'; }
        updateMusicUI(); closePanel();
    }

    function toggleMusic() {
        playClick();
        if (musicOn) {
            if (music1) music1.pause();
            if (music2) music2.pause();
            musicOn = false; currentMusic = null;
        } else {
            playMusic1();
        }
        updateMusicUI(); closePanel();
    }

    // Pull-down panel behavior (works exactly like home screen)
    function initPullDown() {
        if (!statusBar || !controlPanel) return;

        const threshold = 50;

        statusBar.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
            dragging = true;
        });

        statusBar.addEventListener('touchmove', e => {
            if (!dragging) return;
            const diff = e.touches[0].clientY - startY;
            if (diff > threshold) {
                openPanel();
                dragging = false;
            }
        });

        statusBar.addEventListener('touchend', () => { dragging = false; });

        // Also support mouse drag (desktop testing)
        statusBar.addEventListener('mousedown', e => { startY = e.clientY; dragging = true; });
        statusBar.addEventListener('mousemove', e => {
            if (!dragging) return;
            const diff = e.clientY - startY;
            if (diff > threshold) { openPanel(); dragging = false; }
        });
        statusBar.addEventListener('mouseup', () => { dragging = false; });

        // Close panel if clicking outside
        document.addEventListener('click', e => {
            if (controlPanel.classList.contains('open') &&
                !controlPanel.contains(e.target) &&
                !statusBar.contains(e.target)) closePanel();
        });
    }

    // Click sounds
    function setupClickSounds() {
        document.addEventListener('click', e => {
            const t = e.target;
            if (t.closest('.app-icon, .music-control-btn, .status-bar, button, a, .close-panel')) playClick();
        });
    }

    // Initialize global mobile scripts
    window.addEventListener('load', () => {
        initPullDown();
        setupClickSounds();
        updateMusicUI();
        console.log('✅ Global mobile scripts loaded (pull-down working)');
    });

    // Expose music controls
    window.phoneControls = { toggleMusic, playMusic1, playMusic2 };
})();