let callTimer;
let callStartTime;
let isMuted = false;
let isSpeakerOn = false;
let callDuration = 0;

// Initialize localStorage for call logs if not exists
function initializeCallLogs() {
    if (!localStorage.getItem('callLogs')) {
        localStorage.setItem('callLogs', JSON.stringify([]));
    }
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
 * Save call log to localStorage
 */
function saveCallLog(name, number, duration, type) {
    try {
        const callLogs = JSON.parse(localStorage.getItem('callLogs')) || [];
        
        const callLog = {
            id: Date.now(),
            name: name,
            number: number,
            duration: duration,
            type: type, // 'outgoing', 'incoming', 'missed'
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        callLogs.unshift(callLog); // Add to beginning of array
        
        // Keep only last 100 calls to prevent storage issues
        if (callLogs.length > 100) {
            callLogs.splice(100);
        }
        
        localStorage.setItem('callLogs', JSON.stringify(callLogs));
        console.log('Call log saved:', callLog);
        
        // Dispatch event for other pages to know a new call was logged
        window.dispatchEvent(new CustomEvent('callLogged', { detail: callLog }));
        
    } catch (error) {
        console.error('Error saving call log:', error);
    }
}

/**
 * Cancel call and redirect to phone app without history
 */
function cancelCall() {
    // Save as missed call
    saveCallLog('Mr. Ray', '+91 80 3505 9630', 0, 'missed');
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
    callDuration = 0;
    callTimer = setInterval(updateCallTimer, 1000);
}

/**
 * Update the call timer display
 */
function updateCallTimer() {
    const now = new Date();
    const diff = Math.floor((now - callStartTime) / 1000);
    callDuration = diff;
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
 * End the current call and save to call log
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

    // Save call log if call was answered (duration > 0)
    if (callDuration > 0) {
        saveCallLog('Mr. Ray', '+91 80 3505 9630', callDuration, 'outgoing');
    } else {
        saveCallLog('Mr. Ray', '+91 80 3505 9630', 0, 'missed');
    }

    // Replace current history entry with main phone app URL
    // This prevents going back to call page
    window.location.replace('https://projectsofkhan.github.io/Trail/apps/phone/index.html');
}

/**
 * Utility function to get all call logs
 */
function getAllCallLogs() {
    try {
        return JSON.parse(localStorage.getItem('callLogs')) || [];
    } catch (error) {
        console.error('Error reading call logs:', error);
        return [];
    }
}

/**
 * Utility function to clear all call logs
 */
function clearAllCallLogs() {
    localStorage.setItem('callLogs', JSON.stringify([]));
}

/**
 * Utility function to get call log by ID
 */
function getCallLogById(id) {
    const callLogs = getAllCallLogs();
    return callLogs.find(log => log.id === id);
}

/**
 * Utility function to get recent calls
 */
function getRecentCalls(limit = 10) {
    const callLogs = getAllCallLogs();
    return callLogs.slice(0, limit);
}

// Initialize when page loads
window.onload = function() {
    initializeCallLogs();
    updateTime();
    setInterval(updateTime, 60000);
};

// Export functions for use in other files if needed
if (typeof window !== 'undefined') {
    window.callManager = {
        saveCallLog,
        getAllCallLogs,
        clearAllCallLogs,
        getCallLogById,
        getRecentCalls
    };
}