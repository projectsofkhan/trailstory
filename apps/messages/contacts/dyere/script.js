let currentStep = 0;
let messages = [];
let isProcessing = false;
let dyereBlocked = false;

// Questions and their fixed answers for Dyere chat
const questions = [
    "Hello Dyere, I'm investigating Eric Petrove's disappearance.",
    "Do you know if anything unusual happened to him recently?",
    "Did something happen in his last days at school?",
    "About what? Tell me about this argument.",
    "I found his phone crushed on the roadside. His family asked me to investigate."
];

// Dyere's responses that lead to blocking
const answers = [
    "Hello sir!",
    "He stopped coming to school last week. I don't know what happened.",
    "We had an argument, yes.",
    "Wait, first tell me how you got his phone? Why are you using it?",
    "That's suspicious. How do I know you're telling the truth? I think you should talk to the police instead."
];
document.addEventListener('DOMContentLoaded', function() {
    const currentTimeElement = document.getElementById('current-time');
    const chatMessages = document.getElementById('chatMessages');
    const choiceButton = document.getElementById('choiceBtn');

    // Status elements
    const contactStatus = document.querySelector('.contact-status');
    const contactName = document.querySelector('.contact-name');

    // Create audio elements for sounds
    const sentSound = new Audio('sent.mp3');
    const receiveSound = new Audio('recieve.mp3');
    // Alternative softer sound:
const blockSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3');
blockSound.volume = 0.3;

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

        // Also add to messages array for tracking
        messages.push({
            id: messages.length + 1,
            content: text,
            time: time,
            type: type
        });

        // Play sound based on message type
        if (type === 'sent') {
            playSound(sentSound);
        } else if (type === 'received') {
            playSound(receiveSound);
        }
    }

    // Update the choice button
    function updateChoiceButton() {
        if (dyereBlocked) {
            choiceButton.textContent = "Blocked by Dyere";
            choiceButton.disabled = true;
            return;
        }

        if (currentStep < questions.length) {
            choiceButton.textContent = questions[currentStep];
            choiceButton.disabled = false;
        } else {
            choiceButton.textContent = "Conversation Ended";
            choiceButton.disabled = true;
        }
    }

    // Handle blocking sequence
    function triggerBlock() {
        dyereBlocked = true;

        // Play block sound
        playSound(blockSound);

        // Update status
        if (contactStatus) {
            contactStatus.textContent = "Blocked";
            contactStatus.style.color = "#e74c3c";
        }

        if (contactName) {
            contactName.innerHTML = "Dyere <span style='color:#e74c3c; font-size:12px; margin-left:5px;'>● Blocked</span>";
        }

        // Update button
        updateChoiceButton();

        // Show blocked notification
        setTimeout(() => {
            addMessage("You can no longer message this contact.", 'system');
        }, 1500);

        // Complete the task
        setTimeout(() => {
            completeDyereTask();
        }, 2000);
    }

    // ========== TASK COMPLETION FUNCTION FOR DYERE ==========
    function completeDyereTask() {
        // Play task completion sound
        const taskSound = new Audio('https://projectsofkhan.github.io/Trail/apps/task/task.mp3');
        taskSound.volume = 0.6;
        taskSound.play().catch(e => {
            console.log('Task sound error:', e);
        });

        // ✅ COMPLETE IN BOTH SYSTEMS
        // 1. Complete in TaskProgress system (for Messages app)
        if (window.TaskProgress && typeof TaskProgress.completeTask === 'function') {
            console.log('🎯 Completing task_3 in TaskProgress system');
            TaskProgress.completeTask('task_3');
        }

        // 2. Complete in gameTasks system (for Task Manager app)
        const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
        progress['investigate_dyere'] = true; // This is the key for Task Manager
        localStorage.setItem('taskProgress', JSON.stringify(progress));

        // 3. Save extended progress for Messages app
        const extendedProgress = JSON.parse(localStorage.getItem('extendedProgress') || '{}');
        extendedProgress.chat_dyere = true;
        extendedProgress.dyere_blocked_you = true;
        extendedProgress.clue_dyere_hiding = true;
        localStorage.setItem('extendedProgress', JSON.stringify(extendedProgress));

        console.log('✅ Task "investigate_dyere" completed for Task Manager!');
        console.log('🕵️ Clue gained: Dyere blocked you - he is definitely hiding something!');

        // Show completion popup
        showTaskCompletePopup();

        // Notify Task Manager app
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: 'TASK_COMPLETED',
                    taskId: 'investigate_dyere' // Use the correct task ID for Task Manager
                }, '*');
                console.log('📱 Task Manager notified about investigate_dyere completion');
            } catch (error) {
                console.log('⚠️ Could not notify Task Manager');
            }
        }
    }

    // Show task completion popup
    function showTaskCompletePopup() {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        popup.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #E1306C, #fd1d1d);
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
                <div style="font-size: 3rem; margin-bottom: 15px;">🚫</div>
                <h3 style="margin: 0 0 10px 0; font-size: 1.4rem; font-weight: 600;">Task Completed!</h3>
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; margin: 15px 0;">
                    <div style="font-size: 1.1rem; font-weight: 500; margin-bottom: 5px;">Investigate Dyere</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">Dyere blocked you - suspicious behavior!</div>
                </div>
                <div style="display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; margin: 15px 0;">
                    <div style="font-size: 1.8rem; margin-right: 10px;">🔍</div>
                    <div style="text-align: left;">
                        <div style="font-size: 0.9rem; font-weight: 500;">Clue Discovered!</div>
                        <div style="font-size: 0.8rem; opacity: 0.9;">Dyere is hiding something about Eric</div>
                    </div>
                </div>
                <button id="close-popup-btn" style="
                    background: white;
                    color: #E1306C;
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

        // Add event listener to the popup button
        setTimeout(() => {
            const closeBtn = document.getElementById('close-popup-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    popup.remove();
                });
            }
        }, 100);

        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 8000);
    }

    // Handle choice selection
    function selectChoice() {
        if (isProcessing || dyereBlocked || currentStep >= questions.length) return;

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

            // Check if this is the blocking message (last question)
            if (currentStep === questions.length) {
                // Trigger block after last message
                setTimeout(triggerBlock, 1000);
            }

            // Re-enable button for next question if not blocked
            setTimeout(() => {
                if (!dyereBlocked) {
                    updateChoiceButton();
                    isProcessing = false;
                }
            }, 1000);

        }, 1500);
    }

    // Initialize chat
    function initChat() {
        console.log("💬 Starting Dyere investigation chat");

        // Check if task is already completed
        if (window.TaskProgress && TaskProgress.isTaskCompleted('investigate_dyere')) {
            dyereBlocked = true;
            if (contactStatus) {
                contactStatus.textContent = "Blocked";
                contactStatus.style.color = "#e74c3c";
            }
        }

        updateChoiceButton();
        // Welcome message removed - chat starts empty
    }

    // Event listeners
    choiceButton.addEventListener('click', selectChoice);

    // Start everything
    updateTime();
    initChat();
    setInterval(updateTime, 60000);

    // Make functions available globally
    window.selectChoice = selectChoice;
});
