let musicOn = false;
let soundEffectsOn = true;
let currentMusic = null;
let bgMusic1 = null;
let bgMusic2 = null;

/**
 * Back Button - Closes app tab and returns to home
 */
function initializeBackButton() {
    // Get the back button
    const backButton = document.querySelector('.back-button');
    
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            closeAppAndReturnHome();
        });
    }
    
    // Also support Android back button
    window.addEventListener('popstate', function() {
        closeAppAndReturnHome();
    });

    // Support browser back button
    window.onkeydown = function(e) {
        if (e.key === 'Escape') {
            closeAppAndReturnHome();
        }
    };
}

/**
 * Close app tab and focus home screen
 */
function closeAppAndReturnHome() {
    console.log('🔙 Closing Settings and returning to home...');
    
    // Try to focus the home tab first
    if (window.opener && !window.opener.closed) {
        try {
            window.opener.focus();
            console.log('✅ Home tab focused');
        } catch (error) {
            console.log('⚠️ Could not focus home tab');
        }
    }
    
    // Close this app tab
    setTimeout(() => {
        window.close();
    }, 50);
}

/**
 * AUTO-REDIRECT SYSTEM - When user closes Settings, return to Home
 */
function initializeAutoRedirect() {
    window.addEventListener('beforeunload', function() {
        console.log('🔄 Settings closing - attempting to redirect home...');

        if (window.opener && !window.opener.closed) {
            try {
                // Try to redirect home tab back to home screen
                window.opener.location.href = window.location.origin + '/Trail/';
                console.log('✅ Success: Home tab redirected!');
            } catch (error) {
                console.log('⚠️ Could not redirect home tab:', error.message);
                // Fallback: just focus the home tab
                try {
                    window.opener.focus();
                    console.log('✅ Home tab focused instead');
                } catch (focusError) {
                    console.log('❌ Could not focus home tab');
                }
            }
        }
    });
}

/**
 * Initializes background music
 */
function initializeMusic() {
    bgMusic1 = document.getElementById('bgMusic1');
    bgMusic2 = document.getElementById('bgMusic2');

    if (bgMusic1) {
        bgMusic1.volume = 0.05;
    }
    if (bgMusic2) {
        bgMusic2.volume = 0.05;
    }

    // Update button status to show "Off"
    const musicStatus = document.getElementById('musicStatus');
    if (musicStatus) {
        musicStatus.textContent = 'Off';
        musicStatus.style.color = '#FF6B6B';
    }
}

/**
 * Shows music selection overlay
 */
function showMusicSelection() {
    const musicSelectionOverlay = document.getElementById('musicSelectionOverlay');
    if (musicSelectionOverlay) {
        musicSelectionOverlay.style.display = 'flex';
    }
}

/**
 * Closes music selection overlay
 */
function closeMusicSelection() {
    const musicSelectionOverlay = document.getElementById('musicSelectionOverlay');
    if (musicSelectionOverlay) {
        musicSelectionOverlay.style.display = 'none';
    }
}

/**
 * Turns off music completely
 */
function turnOffMusic() {
    musicOn = false;
    currentMusic = null;

    // Stop all music
    if (bgMusic1) {
        bgMusic1.pause();
        bgMusic1.currentTime = 0;
    }
    if (bgMusic2) {
        bgMusic2.pause();
        bgMusic2.currentTime = 0;
    }

    // Update UI
    const musicStatus = document.getElementById('musicStatus');
    if (musicStatus) {
        musicStatus.textContent = 'Off';
        musicStatus.style.color = '#FF6B6B';
    }

    // Close the selection overlay
    closeMusicSelection();
}

/**
 * Selects and plays the chosen music
 */
function selectMusic(musicType) {
    // Stop any currently playing music
    if (bgMusic1) bgMusic1.pause();
    if (bgMusic2) bgMusic2.pause();

    let selectedMusic = null;

    if (musicType === 'music1') {
        selectedMusic = bgMusic1;
        currentMusic = 'music1';
    } else if (musicType === 'music2') {
        selectedMusic = bgMusic2;
        currentMusic = 'music2';
    }

    if (selectedMusic) {
        // Turn music ON
        musicOn = true;
        selectedMusic.currentTime = 0;

        selectedMusic.play().catch(error => {
            console.log('Failed to play music:', error);
            document.addEventListener('click', function startMusic() {
                selectedMusic.play().catch(e => console.log('Still failed to play music'));
                document.removeEventListener('click', startMusic);
            }, { once: true });
        });

        // Update UI
        const musicStatus = document.getElementById('musicStatus');
        if (musicStatus) {
            musicStatus.textContent = 'On';
            musicStatus.style.color = '#4CAF50';
        }
    }

    // Close the selection overlay
    closeMusicSelection();
}

/**
 * Toggles music on/off
 */
function toggleMusic() {
    if (!musicOn) {
        // If music is off, show selection
        showMusicSelection();
        return;
    }

    // If music is on, turn it off
    turnOffMusic();
}

/**
 * Updates the current time display
 */
function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

/**
 * Shows Try Pro overlay with delayed cancel button
 */
function showTryPro() {
    const tryProOverlay = document.getElementById('tryProOverlay');
    const closeButton = document.querySelector('.close-try-pro');

    if (tryProOverlay && closeButton) {
        tryProOverlay.style.display = 'flex';

        // Hide close button initially
        closeButton.classList.remove('show');

        // Show close button after 1 second with animation
        setTimeout(() => {
            closeButton.classList.add('show');
        }, 1000);
    }
}

/**
 * Closes Try Pro overlay
 */
function closeTryPro() {
    const tryProOverlay = document.getElementById('tryProOverlay');
    if (tryProOverlay) {
        tryProOverlay.style.display = 'none';
    }
}

/**
 * Toggles sound effects on/off
 */
function toggleSoundEffects() {
    soundEffectsOn = !soundEffectsOn;
    const soundStatus = document.getElementById('soundStatus');
    if (soundStatus) {
        soundStatus.textContent = soundEffectsOn ? 'On' : 'Off';
        soundStatus.style.color = soundEffectsOn ? '#4CAF50' : '#FF6B6B';
    }
}

/**
 * Mail Us function
 */
function mailUs() {
    window.location.href = 'mailto:zeeshan40u@gmail.com';
}

/**
 * Show Help/Support
 */
function showHelp() {
    window.location.href = 'mailto:khan40u@gmail.com';
}

/**
 * Open BlitzRacer
 */
function openBlitzRacer() {
    window.open('https://blitzracer.github.io/Cargame/', '_blank');
}

/**
 * Open ZeeAi
 */
function openZeeAi() {
    window.open('https://projectsofkhan.github.io/zeeAi/', '_blank');
}

// Initialize when page loads
window.onload = function() {
    updateTime();
    setInterval(updateTime, 60000);
    initializeMusic();
    initializeBackButton();    // 🆕 Back button navigation
    initializeAutoRedirect();  // 🆕 Auto-redirect system

    console.log('⚙️ Settings App Ready - Back button closes tab!');
};