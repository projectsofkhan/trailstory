let currentStep = 0;
let messages = [];
let isProcessing = false;

// Questions and answers for Eric's Dad investigation
const questions = [
    "Hello Mr. Petrove, I'm a detective investigating Eric's disappearance",
    "Ricky??",
    "I know this is difficult, but I need to ask about Eric's recent behavior",
    "What about his freinds and School.",
    "Did he say anything unusual or leave any clues?",
    "Thank you for your time. I'll find your son"
];

// Dad's responses
const answers = [
    "...Ricky? My boy... I haven't slept since he disappeared.",
    "Yes, it was his nickname",
    "He talks a little bit to us, he is a little bit depressed.",
    "he stopped talking about his friends, also he didn't went school for last some days.",
    "Two days before he vanished. He hugged me tight... like he knew.",
    "Please... bring him home. He's a good boy."
];

document.addEventListener('DOMContentLoaded', function() {
    const currentTimeElement = document.getElementById('current-time');
    const chatMessages = document.getElementById('chatMessages');
    const choiceButton = document.getElementById('choiceBtn');
    const contactStatus = document.getElementById('contactStatus');

    // Create audio elements for sounds
    const sentSound = new Audio('sent.mp3');
    const receiveSound = new Audio('recieve.mp3');

    // Update time
    function updateTime() {
        if (currentTimeElement) {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            currentTimeElement.textContent = `${hours}:${minutes}`;
        }
    }

    // Play sound
    function playSound(sound) {
        sound.currentTime = 0;
        sound.volume = 0.4;
        sound.play().catch(e => {
            console.log('Audio play failed:', e);
        });
    }

    // Add message to chat
    function addMessage(text, type) {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${time}</div>
        `;

        // Add to chat
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);

        // Store message
        messages.push({
            id: messages.length + 1,
            content: text,
            time: time,
            type: type
        });

        // Play sound
        if (type === 'sent') {
            playSound(sentSound);
        } else if (type === 'received') {
            playSound(receiveSound);
        }
    }

    // Update choice button
    function updateChoiceButton() {
        if (currentStep < questions.length) {
            choiceButton.textContent = questions[currentStep];
            choiceButton.disabled = false;
        } else {
            choiceButton.textContent = "Conversation Ended";
            choiceButton.disabled = true;

            // Complete the task when conversation ends
            setTimeout(() => {
                completeDadChat();
            }, 2000);
        }
    }

    // ========== TASK 5 COMPLETION FUNCTION ==========
    function completeDadChat() {
        // ✅ PLAY TASK COMPLETION SOUND
        const taskSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
        taskSound.volume = 0.3;
        taskSound.play().catch(e => {
            console.log('Task sound error:', e);
        });

        // ✅ Complete in TaskProgress system
        if (window.TaskProgress && typeof TaskProgress.completeTask === 'function') {
            console.log('🎯 Completing task5_talk_dad in TaskProgress system');
            TaskProgress.completeTask('task5_talk_dad');
        }

        // ✅ Save to localStorage for Task Manager
        const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
        progress['task5_talk_dad'] = true;
        localStorage.setItem('taskProgress', JSON.stringify(progress));

        // ✅ Save extended progress
        const extendedProgress = JSON.parse(localStorage.getItem('extendedProgress') || '{}');
        extendedProgress.chat_dad = true;
        extendedProgress.clue_laptop = true;
        extendedProgress.clue_garage_fight = true;
        localStorage.setItem('extendedProgress', JSON.stringify(extendedProgress));

        console.log('✅ Task 5 completed: Talk to Eric\'s Dad');
        console.log('🔓 Clues gained: Laptop clue + Garage fight clue');

        // ✅ Show completion popup
        showTaskCompletePopup();

        // ✅ Notify Task Manager
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: 'TASK_COMPLETED',
                    taskId: 'task5_talk_dad'
                }, '*');
                console.log('📱 Task Manager notified about task5_talk_dad');
            } catch (error) {
                console.log('⚠️ Could not notify Task Manager');
            }
        }

        // ✅ Trigger storage event
        localStorage.setItem('taskProgressUpdate', Date.now());
    }

    // ✅ Show task completion popup
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
                background: linear-gradient(135deg, #128C7E, #25D366);
                color: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                max-width: 280px;
                margin: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                animation: slideUp 0.5s ease;
                border: 2px solid #0a6b5e;
            ">
                <div style="font-size: 3rem; margin-bottom: 15px;">🎉</div>
                <h3 style="margin: 0 0 10px 0; font-size: 1.4rem; font-weight: 600;">Task Completed!</h3>
                <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 12px; margin: 15px 0;">
                    <div style="font-size: 1.1rem; font-weight: 500; margin-bottom: 5px;">Talk to Eric's Dad</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">Investigation complete</div>
                </div>
                <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.15); padding: 12px; border-radius: 10px; margin: 15px 0;">
                    <div style="font-size: 1.8rem; margin-right: 10px;">💻</div>
                    <div style="text-align: left;">
                        <div style="font-size: 0.9rem; font-weight: 500;">Critical Clue Found!</div>
                        <div style="font-size: 0.8rem; opacity: 0.9;">Eric's laptop has important evidence</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.15); padding: 12px; border-radius: 10px; margin: 15px 0;">
                    <div style="font-size: 1.8rem; margin-right: 10px;">🏢</div>
                    <div style="text-align: left;">
                        <div style="font-size: 0.9rem; font-weight: 500;">Fight Location</div>
                        <div style="font-size: 0.8rem; opacity: 0.9;">Eric fought with Dyere at the garage</div>
                    </div>
                </div>
                <button onclick="closePopup()" style="
                    background: white;
                    color: #128C7E;
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

        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 8000);
    }

    // Close popup
    function closePopup() {
    // Find popup by checking multiple style patterns
    const popup = document.querySelector('div[style*="position: fixed"][style*="top: 0"][style*="left: 0"]');
    if (popup) {
        popup.remove();
        console.log("✅ Popup closed");
    } else {
        // Alternative search method
        const allDivs = document.querySelectorAll('div');
        for (let div of allDivs) {
            const style = div.getAttribute('style');
            if (style && 
                style.includes('position: fixed') && 
                style.includes('top: 0') && 
                style.includes('left: 0') &&
                style.includes('width: 100%') &&
                style.includes('height: 100%')) {
                div.remove();
                console.log("✅ Popup closed (alternative method)");
                break;
            }
        }
    }
}

// Handle choice selection
function selectChoice() {
    if (isProcessing || currentStep >= questions.length) return;

    isProcessing = true;
    const question = questions[currentStep];
    choiceButton.disabled = true;

    // Add user's message
    addMessage(question, 'sent');

    // Simulate typing delay, then add response
    setTimeout(() => {
        const answer = answers[currentStep];
        addMessage(answer, 'received');

        currentStep++;

        // Update typing status
        if (contactStatus && currentStep < questions.length) {
            contactStatus.textContent = "Typing...";
            setTimeout(() => {
                contactStatus.textContent = "Online";
            }, 1500);
        }
            // Re-enable button for next question
            setTimeout(() => {
                updateChoiceButton();
                isProcessing = false;
            }, 1000);

        }, 1500);
    }

    // Initialize chat - NO WELCOME MESSAGE
    function initChat() {
        console.log("🕵️ Starting investigation chat with Eric's Dad");
        updateChoiceButton();
        // No welcome message - starts with detective's first question
    }

    // Event listeners
    choiceButton.addEventListener('click', selectChoice);

    // Start everything
    updateTime();
    initChat();
    setInterval(updateTime, 60000);

    // Make functions available globally
    window.selectChoice = selectChoice;
    window.closePopup = closePopup;
});