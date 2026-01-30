let callTimer;
let callStartTime;
let isMuted = false;
let isSpeakerOn = false;

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
    const voiceAudio = document.getElementById('voiceAudio');
    const callStatus = document.getElementById('callStatus');
    
    // Start ringing after 1 second delay
    setTimeout(() => {
        ringtone.play().catch(e => console.log('Audio play failed:', e));
        callStatus.textContent = 'Ringing...';
    }, 1000);
    
    // Stop ringing and play voice after 4 seconds (1s delay + 3s ringing)
    setTimeout(() => {
        ringtone.pause();
        ringtone.currentTime = 0;
        
        // Play voice audio
        voiceAudio.play().catch(e => console.log('Voice audio play failed:', e));
        callStatus.textContent = 'Connected';
        callStatus.classList.remove('calling');
        
        // Start call timer
        startCallTimer();
        
        // Auto-end call 1 second after voice audio ends
        voiceAudio.onended = function() {
            setTimeout(() => {
                endCall();
            }, 1000);
        };
        
    }, 4000);
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
    const voiceAudio = document.getElementById('voiceAudio');
    
    ringtone.pause();
    ringtone.currentTime = 0;
    voiceAudio.pause();
    voiceAudio.currentTime = 0;
    
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