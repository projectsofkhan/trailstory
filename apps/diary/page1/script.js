// Check if page is already unlocked
function isPageUnlocked() {
    return localStorage.getItem('diary_page1_unlocked') === 'true';
}

// Save page as unlocked
function unlockPage() {
    localStorage.setItem('diary_page1_unlocked', 'true');
    console.log('✅ Page 1 unlocked');
}

// MARK TASK 7 AS COMPLETED
function markTask7Completed() {
    // Update localStorage for TaskProgress
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    progress['task7_complete_diary'] = true;
    localStorage.setItem('taskProgress', JSON.stringify(progress));
    
    // Set task7_completed flag
    localStorage.setItem('task7_completed', 'true');
    
    // Notify TaskProgress system if available
    if (window.TaskProgress) {
        window.TaskProgress.completeTask('task7_complete_diary');
    }
    
    // Notify Task Manager
    if (window.opener && !window.opener.closed) {
        try {
            window.opener.postMessage({
                type: 'TASK_COMPLETED',
                taskId: 'task7_complete_diary'
            }, '*');
            console.log('✅ Task 7 completion sent to Task Manager');
        } catch (e) {
            console.log('⚠️ Could not notify Task Manager');
        }
    }
    
    // Show completion popup
    showTask7CompletionPopup();
    
    console.log('✅ Task 7 marked as completed!');
}

// Show Task 7 completion popup
function showTask7CompletionPopup() {
    const popup = document.getElementById('taskCompletionPopup');
    if (popup) {
        popup.style.display = 'flex';
        setTimeout(() => {
            closeTaskPopup();
        }, 5000);
    }
}

function closeTaskPopup() {
    const popup = document.getElementById('taskCompletionPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Go back to diary main page
function goBackToDiary() {
    window.location.href = '../index.html'; // Updated path for your structure
}

// Check answers
function checkAnswers() {
    const blank1 = document.getElementById('blank1');
    const blank2 = document.getElementById('blank2');
    const message = document.getElementById('message');
    const unlockBtn = document.getElementById('unlock-btn');
    
    const answer1 = blank1.value.trim().toLowerCase();
    const answer2 = blank2.value.trim().toLowerCase();
    
    // Clear previous messages
    message.textContent = '';
    message.className = 'message-display';
    blank1.classList.remove('correct', 'incorrect', 'shake');
    blank2.classList.remove('correct', 'incorrect', 'shake');
    
    // Check if both blanks are filled
    if (!answer1 || !answer2) {
        message.textContent = 'Please fill in both blanks.';
        message.classList.add('error-message');
        return;
    }
    
    // Check answers
    const correct1 = answer1 === 'shadow';
    const correct2 = answer2 === 'shadow';
    
    // Apply visual feedback
    if (correct1) {
        blank1.classList.add('correct');
    } else {
        blank1.classList.add('incorrect', 'shake');
    }
    
    if (correct2) {
        blank2.classList.add('correct');
    } else {
        blank2.classList.add('incorrect', 'shake');
    }
    
    if (!correct1 || !correct2) {
        message.textContent = 'Not quite right. Try again.';
        message.classList.add('error-message');
        return;
    }
    
    // Correct answer!
    message.textContent = 'Correct! Page unlocked.';
    message.classList.add('success-message');
    unlockBtn.disabled = true;
    unlockBtn.textContent = '✓ Unlocked';
    
    // Save to localStorage
    unlockPage();
    
    // MARK TASK 7 AS COMPLETED
    markTask7Completed();
    
    // Show hidden content after delay
    setTimeout(() => {
        document.getElementById('riddle-section').style.display = 'none';
        document.getElementById('hidden-content').style.display = 'block';
        document.getElementById('hidden-content').style.animation = 'fadeIn 0.8s ease';
    }, 1500);
}

// Ad functionality - UPDATED PATHS FOR YOUR STRUCTURE
function showAd() {
    const overlay = document.getElementById('adOverlay');
    const image = document.getElementById('adImage');
    const timer = document.getElementById('adTimer');
    const hintBtn = document.getElementById('seeHintBtn');
    const text = document.getElementById('adText');

    if (!overlay || !image || !timer || !hintBtn || !text) return;

    const randomAd = Math.random() < 0.5 ? 'ad1.jpg' : 'ad2.jpg';
    
    // ✅ UPDATED: Correct paths for your file structure
    image.src = randomAd === 'ad1.jpg' 
        ? '../ad1.jpg'  // Goes up one level from page1/ to diary/
        : '../ad2.jpg'; // Goes up one level from page1/ to diary/

    if (randomAd === 'ad1.jpg') {
        text.textContent = 'Play BlitzRacer Now';
        image.onclick = () => {
            window.open('https://blitzracer.github.io/Cargame/', '_blank');
            closeAd();
        };
    } else {
        text.textContent = 'ZeeAi Text To Speech App';
        image.onclick = () => {
            window.open('https://projectsofkhan.github.io/zeeAi/', '_blank');
            closeAd();
        };
    }

    overlay.style.display = 'flex';
    hintBtn.style.display = 'none';
    text.style.display = 'block';

    let seconds = 3;
    const countdown = setInterval(() => {
        seconds--;
        timer.textContent = `Ad ends in ${seconds}s`;
        if (seconds <= 0) {
            clearInterval(countdown);
            timer.textContent = 'Ad completed!';
            setTimeout(() => {
                hintBtn.style.display = 'block';
                timer.style.display = 'none';
            }, 500);
        }
    }, 1000);
}

function showHint() {
    const message = document.getElementById('message');
    message.textContent = `Hint: Check Out Eric's 11th Post on Instashan`;
    message.classList.add('success-message');
    closeAd();
}

function closeAd() {
    const overlay = document.getElementById('adOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        checkAnswers();
        event.preventDefault();
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    const currentTimeElement = document.getElementById('current-time');
    
    // Update time
    function updateTime() {
        if (currentTimeElement) {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            currentTimeElement.textContent = `${hours}:${minutes}`;
        }
    }
    
    updateTime();
    setInterval(updateTime, 60000);
    
    // Check if page is already unlocked
    if (isPageUnlocked()) {
        document.getElementById('riddle-section').style.display = 'none';
        document.getElementById('hidden-content').style.display = 'block';
        document.getElementById('unlock-btn').textContent = '✓ Already Unlocked';
        document.getElementById('unlock-btn').disabled = true;
        
        // Also mark Task 7 as completed if not already
        const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
        if (!progress['task7_complete_diary']) {
            markTask7Completed();
        }
    }
    
    // Add keyboard event listeners
    document.getElementById('blank1').addEventListener('keypress', handleKeyPress);
    document.getElementById('blank2').addEventListener('keypress', handleKeyPress);
    
    // Auto-focus first input
    setTimeout(() => {
        document.getElementById('blank1').focus();
    }, 100);
    
    console.log('📖 Diary Page 1 Ready with Task 7 functionality');
});