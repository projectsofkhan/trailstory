// DOM Elements
const appGrid = document.getElementById('appGrid');
const currentTimeElement = document.getElementById('current-time');
const controlPanel = document.getElementById('controlPanel');
const statusBar = document.getElementById('statusBar');
const musicToggleText = document.getElementById('musicToggleText');
const musicStatusIndicator = document.getElementById('musicStatusIndicator');

// App data
const apps = [
    { id: 'messages', name: 'Messages', icon: '💬', color: '#579AD9', file: 'apps/messages/index.html' },
    { id: 'phone', name: 'Phone', icon: '📞', color: '#6BBF6B', file: 'apps/phone/index.html' },
    { id: 'gallery', name: 'Gallery', icon: '🌄', color: '#6A618F', file: 'apps/gallery/index.html' },
    { 
        id: 'pixabowl', 
        name: 'Instashan', 
        icon: 'https://projectsofkhan.github.io/pythontodoapp/instashan.jpg', 
        color: '#9B5BBE', 
        file: 'apps/instashan/index.html' 
    },
    { id: 'diary', name: 'Diary', icon: '📖', color: '#A08E77', file: 'apps/diary/index.html' },
    { id: 'browser', name: 'Browser', icon: '🌐', color: '#5D6B9C', file: 'apps/browser/index.html' },
    { id: 'taskmanager', name: 'Tasks', icon: '📋', color: '#FF6B6B', file: 'apps/task/index.html' },
    { id: 'settings', name: 'Settings', icon: '⚙️', color: '#555555', file: 'apps/settings/index.html' }
];

// Music state
let musicOn = false;
let currentMusic = null;
let bgMusic1 = null;
let bgMusic2 = null;

/**
 * Play click sound function
 */
function playClickSound() {
    const sound = new Audio('https://projectsofkhan.github.io/Trail/sounds/click.mp3');
    sound.volume = 0.3;
    sound.play().catch(e => console.log('Sound error:', e));
}

/**
 * Setup click sounds for all interactive elements
 */
function setupClickSounds() {
    document.addEventListener('click', function(event) {
        const target = event.target;
        const isClickable = (
            target.tagName === 'BUTTON' ||
            target.tagName === 'A' ||
            target.closest('.app-icon') ||
            target.closest('.music-control-btn') ||
            target.closest('.status-bar') ||
            target.closest('.close-panel') ||
            target.hasAttribute('onclick') ||
            target.classList.contains('clickable') ||
            (target.parentElement && target.parentElement.classList.contains('clickable'))
        );

        if (isClickable) {
            playClickSound();
        }
    });
}

/**
 * Initialize music system
 */
function initializeMusic() {
    bgMusic1 = document.getElementById('bgMusic1');
    bgMusic2 = document.getElementById('bgMusic2');

    if (bgMusic1) {
        bgMusic1.volume = 0.3;
        bgMusic1.preload = 'auto';
    }
    if (bgMusic2) {
        bgMusic2.volume = 0.3;
        bgMusic2.preload = 'auto';
    }

    updateMusicUI();
}

/**
 * Update music control UI
 */
function updateMusicUI() {
    if (musicToggleText) {
        musicToggleText.textContent = musicOn ? 'Turn Off Music' : 'Turn On Music';
    }
    if (musicStatusIndicator) {
        musicStatusIndicator.className = musicOn ? 'status-indicator' : 'status-indicator off';
    }
}

/**
 * Toggle music on/off
 */
function toggleMusic() {
    playClickSound();
    
    if (musicOn) {
        // Turn off music
        musicOn = false;
        currentMusic = null;
        if (bgMusic1) bgMusic1.pause();
        if (bgMusic2) bgMusic2.pause();
    } else {
        // Turn on music (default to Music One)
        playMusicOne();
    }
    updateMusicUI();
    closeControlPanel();
}

/**
 * Play Music One
 */
function playMusicOne() {
    playClickSound();
    
    if (bgMusic1) {
        if (bgMusic2) bgMusic2.pause();
        bgMusic1.currentTime = 0;
        bgMusic1.play().catch(e => {
            console.log('Music play failed, waiting for user interaction');
            // Auto-play will work after user interaction
            document.addEventListener('click', function enableMusic() {
                bgMusic1.play();
                document.removeEventListener('click', enableMusic);
            }, { once: true });
        });
        musicOn = true;
        currentMusic = 'music1';
    }
    updateMusicUI();
    closeControlPanel();
}

/**
 * Play Music Two
 */
function playMusicTwo() {
    playClickSound();
    
    if (bgMusic2) {
        if (bgMusic1) bgMusic1.pause();
        bgMusic2.currentTime = 0;
        bgMusic2.play().catch(e => {
            console.log('Music play failed, waiting for user interaction');
            document.addEventListener('click', function enableMusic() {
                bgMusic2.play();
                document.removeEventListener('click', enableMusic);
            }, { once: true });
        });
        musicOn = true;
        currentMusic = 'music2';
    }
    updateMusicUI();
    closeControlPanel();
}

/**
 * Open control panel
 */
function openControlPanel() {
    playClickSound();
    controlPanel.classList.add('open');
}

/**
 * Close control panel
 */
function closeControlPanel() {
    playClickSound();
    controlPanel.classList.remove('open');
}

/**
 * Initialize pull-down functionality
 */
function initializePullDown() {
    let startY = 0;
    let isDragging = false;

    statusBar.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isDragging = true;
        e.preventDefault();
    });

    statusBar.addEventListener('touchmove', function(e) {
        if (!isDragging) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        // Only trigger if pulling down (positive diff) and significant movement
        if (diff > 60) {
            openControlPanel();
            isDragging = false;
        }
    });

    statusBar.addEventListener('touchend', function() {
        isDragging = false;
    });

    // Also support mouse for testing
    statusBar.addEventListener('mousedown', function(e) {
        startY = e.clientY;
        isDragging = true;
    });

    statusBar.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        const currentY = e.clientY;
        const diff = currentY - startY;

        if (diff > 60) {
            openControlPanel();
            isDragging = false;
        }
    });

    statusBar.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (controlPanel.classList.contains('open') && 
            !controlPanel.contains(e.target) && 
            !statusBar.contains(e.target)) {
            closeControlPanel();
        }
    });
}

/**
 * Updates the current time display
 */
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    if (currentTimeElement) {
        currentTimeElement.textContent = `${hours}:${minutes}`;
    }
}

/**
 * Initializes the home screen grid
 */
function initializeAppGrid() {
    if (!appGrid) return;

    apps.forEach(app => {
        const iconLink = document.createElement('a');
        iconLink.className = 'app-icon';
        iconLink.href = app.file;
        iconLink.target = "_blank";

        // Check if the icon is an image URL or emoji
        const isImageIcon = app.icon.includes('http') || app.icon.includes('.jpg') || app.icon.includes('.png');
        
        let iconHTML = '';
        
        if (isImageIcon) {
            // Use img tag for image icons
            iconHTML = `
                <img src="${app.icon}" 
                     alt="${app.name}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"
                     onerror="this.style.display='none'; this.parentElement.innerHTML='📷'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center';">
            `;
        } else {
            // Use emoji for regular icons
            iconHTML = `
                <div style="font-size: 28px; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                    ${app.icon}
                </div>
            `;
        }

        iconLink.innerHTML = `
            <div class="app-icon-body" style="background-color: ${app.color}; padding: 0; overflow: hidden;">
                ${iconHTML}
            </div>
            <div class="app-icon-label">${app.name}</div>
        `;
        appGrid.appendChild(iconLink);
    });
}

// Initialize everything
window.onload = function() {
    initializeAppGrid();
    updateTime();
    initializeMusic();
    initializePullDown();
    setupClickSounds(); // 🆕 Setup click sounds for all interactions

    setInterval(updateTime, 60000);

    console.log('🏠 Home Screen Ready!');
    console.log('✅ Click sounds enabled for all interactions');
    console.log('✅ Music system initialized');
    console.log('✅ Pull-down controls working');
};