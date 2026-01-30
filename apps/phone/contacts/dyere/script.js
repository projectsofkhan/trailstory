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

    // Complete Task 4 before redirecting
    completeTask4();
}

/**
 * Complete Task 4: Call To Dyere with POPUP
 */
function completeTask4() {
    console.log('✅ Task 4: Call To Dyere completed');
    
    // Play soft completion sound
    const taskSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    taskSound.volume = 0.3;
    taskSound.play().catch(e => console.log('Task sound error:', e));

    // Save task completion
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    progress['task4_call_dyere'] = true;
    localStorage.setItem('taskProgress', JSON.stringify(progress));

    // Save extended progress
    const extendedProgress = JSON.parse(localStorage.getItem('extendedProgress') || '{}');
    extendedProgress.call_dyere = true;
    extendedProgress.clue_garage_location = true;
    extendedProgress.unlock_next_location = true;
    localStorage.setItem('extendedProgress', JSON.stringify(extendedProgress));

    // Notify Task Manager
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
            type: 'TASK_COMPLETED',
            taskId: 'task4_call_dyere'
        }, '*');
    }

    // Show completion popup
    showTaskCompletePopup();

    // Redirect to phone app after popup
    setTimeout(() => {
        window.location.replace('https://projectsofkhan.github.io/Trail/apps/phone/index.html');
    }, 4000);
}

/**
 * Show Task 4 completion popup
 */
function showTaskCompletePopup() {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    popup.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #4A90E2, #357ABD);
            color: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            max-width: 280px;
            margin: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease;
            border: 2px solid #333;
        ">
            <div style="font-size: 3rem; margin-bottom: 15px;">📞</div>
            <h3 style="margin: 0 0 10px 0; font-size: 1.4rem; font-weight: 600;">Call Completed!</h3>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 12px; margin: 15px 0;">
                <div style="font-size: 1.1rem; font-weight: 500; margin-bottom: 5px;">Task 4: Call To Dyere</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">Phone call investigation complete</div>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.15); padding: 12px; border-radius: 10px; margin: 15px 0;">
                <div style="font-size: 1.8rem; margin-right: 10px;">🔍</div>
                <div style="text-align: left;">
                    <div style="font-size: 0.9rem; font-weight: 500;">Clue Discovered!</div>
                    <div style="font-size: 0.8rem; opacity: 0.9;">Eric's last known location: Auto Garage</div>
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: white;
                color: #4A90E2;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                margin-top: 10px;
                transition: all 0.2s ease;
            ">Continue Investigation</button>
        </div>
        
        <style>
            @keyframes fadeIn { 
                from { opacity: 0; } 
                to { opacity: 1; } 
            }
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px) scale(0.9);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        </style>
    `;

    document.body.appendChild(popup);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 5000);
}

// Initialize when page loads
window.onload = function() {
    updateTime();
    setInterval(updateTime, 60000);
};