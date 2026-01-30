let callTimer;
let callStartTime;
let isMuted = false;
let isSpeakerOn = false;
let voice1Played = false;
let voice2Played = false;

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
 * Cancel call and redirect to phone app without history
 */
function cancelCall() {
    window.location.replace('https://projectsofkhan.github.io/Trail/apps/phone/index.html');
}

/**
 * Start the call process
 */
function startCall() {
    const confirmationScreen = document.getElementById('callConfirmation');
    const activeCallScreen = document.getElementById('activeCall');
    const callStatus = document.getElementById('callStatus');

    // Switch to active call screen
    confirmationScreen.style.display = 'none';
    activeCallScreen.style.display = 'flex';

    // Add calling animation
    callStatus.classList.add('calling');

    // Start call sequence with sounds
    startCallSequence();
}

/**
 * Handle the call sequence with sounds
 */
function startCallSequence() {
    const ringtone = document.getElementById('ringtone');
    const voice1Audio = document.getElementById('voice1Audio');
    const callStatus = document.getElementById('callStatus');
    const voiceActionSection = document.getElementById('voiceActionSection');

    // Start ringing after 1 second delay
    setTimeout(() => {
        ringtone.play().catch(e => console.log('Ring audio play failed:', e));
        callStatus.textContent = 'Ringing...';
    }, 1000);

    // Stop ringing and play voice1 after 4 seconds (1s delay + 3s ringing)
    setTimeout(() => {
        ringtone.pause();
        ringtone.currentTime = 0;

        if (!voice1Played) {
            playVoice1();
        }

    }, 4000);
}

/**
 * Play voice1 audio and show action button
 */
function playVoice1() {
    console.log("Playing voice1...");
    voice1Played = true;
    
    const voice1Audio = document.getElementById('voice1Audio');
    const callStatus = document.getElementById('callStatus');
    const voiceActionSection = document.getElementById('voiceActionSection');

    voice1Audio.volume = 0.7;
    
    voice1Audio.play().then(() => {
        console.log("Voice1 playing...");
        callStatus.textContent = 'Connected';
        callStatus.classList.remove('calling');

        // Start call timer
        startCallTimer();

        // When voice1 ends, show the action button
        voice1Audio.onended = function() {
            console.log("Voice1 ended - showing action button");
            voiceActionSection.style.display = 'block';
        };

    }).catch(e => {
        console.log("Voice1 error:", e);
        // If voice1 fails, still show action button and start timer
        callStatus.textContent = 'Connected';
        callStatus.classList.remove('calling');
        startCallTimer();
        voiceActionSection.style.display = 'block';
    });
}

/**
 * Trigger voice2 when action button is clicked
 */
function triggerVoice2() {
    if (voice2Played) return; // Prevent multiple clicks
    
    console.log("Triggering voice2...");
    voice2Played = true;
    
    const voice2Audio = document.getElementById('voice2Audio');
    const voiceActionSection = document.getElementById('voiceActionSection');
    const actionButton = voiceActionSection.querySelector('.action-button');

    // Disable button during delay
    actionButton.style.opacity = '0.6';
    actionButton.style.pointerEvents = 'none';

    // Wait 1 second delay, then play voice2
    setTimeout(() => {
        voice2Audio.volume = 0.7;
        
        voice2Audio.play().then(() => {
            console.log("Voice2 playing...");
            
            // When voice2 ends, auto-end call after 1 second
            voice2Audio.onended = function() {
                setTimeout(() => {
                    endCall();
                }, 1000);
            };

        }).catch(e => {
            console.log("Voice2 error:", e);
            // If voice2 fails, still end call after delay
            setTimeout(() => {
                endCall();
            }, 2000);
        });

    }, 1000); // 1 second delay
}

/**
 * Start the call timer
 */
function startCallTimer() {
    callStartTime = new Date();
    callTimer = setInterval(updateCallTimer, 1000);
}

/**
 * Update the call timer display
 */
function updateCallTimer() {
    const now = new Date();
    const diff = Math.floor((now - callStartTime) / 1000);
    const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
    const seconds = (diff % 60).toString().padStart(2, '0');

    document.getElementById('callTimer').textContent = `${minutes}:${seconds}`;
}

/**
 * Toggle mute during call
 */
function toggleMute() {
    isMuted = !isMuted;
    const muteButton = document.getElementById('muteButton');
    const muteIcon = muteButton.querySelector('.control-icon');

    if (isMuted) {
        muteIcon.textContent = '🎤';
        muteButton.classList.add('active');
    } else {
        muteIcon.textContent = '🔇';
        muteButton.classList.remove('active');
    }
}

/**
 * Toggle speaker during call
 */
function toggleSpeaker() {
    isSpeakerOn = !isSpeakerOn;
    const speakerButton = document.getElementById('speakerButton');

    if (isSpeakerOn) {
        speakerButton.classList.add('active');
    } else {
        speakerButton.classList.remove('active');
    }
}

/**
 * End the current call and replace history to prevent back button
 */
function endCall() {
    // Stop all audio
    const ringtone = document.getElementById('ringtone');
    const voice1Audio = document.getElementById('voice1Audio');
    const voice2Audio = document.getElementById('voice2Audio');

    ringtone.pause();
    ringtone.currentTime = 0;
    voice1Audio.pause();
    voice1Audio.currentTime = 0;
    voice2Audio.pause();
    voice2Audio.currentTime = 0;

    // Stop timer
    if (callTimer) {
        clearInterval(callTimer);
    }

    // Replace current history entry with main phone app URL
    // This prevents going back to call page
    window.location.replace('https://projectsofkhan.github.io/Trail/apps/phone/index.html');
}

// Initialize when page loads
window.onload = function() {
    updateTime();
    setInterval(updateTime, 60000);
};