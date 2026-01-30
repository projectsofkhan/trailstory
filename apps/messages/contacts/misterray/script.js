// Chat functionality
let currentStep = 0;
let messages = [];
let isProcessing = false;

// Questions and their fixed answers
const questions = [
    "Hello!",
    "Sir, I am Detective, working on Eric Petrove's case, Can you help me?",
    "Thanks sir, I need some information about his friends.",
    "Sir who's Ahmet",
    "Yes, sir do you know more about him",
    "Thanks a lot sir"
];

// Answer mapping
const answerMap = {
    "Hello!": "Hello?",
    "Sir, I am Detective, working on Eric Petrove's case, Can you help me?": 
        "Oh, thanks I'm glad that someone is here to find him. Yes I will be happy to help you.",
    "Thanks sir, I need some information about his friends": 
        "His friends are Sahil, Dyere and Ahmet.",
    "Sir who's Ahmet": 
        "Ahmet was his friend. His family belongs to a very rich family. His family shifted him to South Korea for study.",
    "Yes, sir do you know more about him": 
        "No sorry, I don't know much about him. It's my first year at the school.",
    "Thanks a lot sir": 
        "Welcome Mr. Feel free to ask anything, but now I have some work so we'll talk later."
};

// ========== BACK BUTTON FUNCTION ==========
function closeAppAndReturnHome() {
    console.log('🔙 Closing Mr. Ray chat and returning to messages...');

    // Redirect directly to messages home
    window.location.href = 'https://projectsofkhan.github.io/Trail/apps/messages/index.html';
}

// ========== TASK COMPLETION FUNCTION ==========
function completeMrRayChat() {
    // Play task completion sound
    const taskSound = new Audio('https://projectsofkhan.github.io/Trail/apps/task/task.mp3');
    taskSound.volume = 0.6;
    taskSound.play().catch(e => {
        console.log('Task sound error:', e);
    });

    const popup = document.createElement('div');
    popup.id = 'taskCompletePopup';
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
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
            position: relative;
        ">
            <div style="font-size: 3rem; margin-bottom: 15px;">🎉</div>
            <h3 style="margin: 0 0 10px 0; font-size: 1.4rem; font-weight: 600;">Task Completed!</h3>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 12px; margin: 15px 0;">
                <div style="font-size: 1.1rem; font-weight: 500; margin-bottom: 5px;">Chat with Mr. Ray</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">Completed Successfully</div>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.15); padding: 12px; border-radius: 10px; margin: 15px 0;">
                <div style="font-size: 1.8rem; margin-right: 10px;">🔓</div>
                <div style="text-align: left;">
                    <div style="font-size: 0.9rem; font-weight: 500;">New Contact Unlocked!</div>
                    <div style="font-size: 0.8rem; opacity: 0.9;">Sahil is now available</div>
                </div>
            </div>
            <button onclick="closeTaskPopup()" style="
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
            ">Continue</button>
            
            <!-- Close button in top right corner -->
            <button onclick="closeTaskPopup()" style="
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            ">×</button>
        </div>
        
        <style>
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
        </style>
    `;

    document.body.appendChild(popup);

    // Save progress to localStorage
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    progress['chat_mr_ray'] = true;
    localStorage.setItem('taskProgress', JSON.stringify(progress));

    console.log('✅ Mr. Ray chat completed - Sahil unlocked!');
    // Auto-remove after 8 seconds
    setTimeout(() => {
        closeTaskPopup();
    }, 8000);
}

function closeTaskPopup() {
    const popup = document.getElementById('taskCompletePopup');
    if (popup) {
        popup.remove();
    }
}

// ========== CHAT FUNCTIONS ==========
function getAnswer(question) {
    return answerMap[question] || "His friends are Sahil, Dyere and Ahmet.";
}

function updateTime() {
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        currentTimeElement.textContent = `${hours}:${minutes}`;
    }
}

function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-time">${timeString}</div>
    `;

    chatMessages.appendChild(messageDiv);

    // Fixed scrolling
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 50);

    // Store message
    messages.push({ 
        id: messages.length + 1, 
        content: text, 
        time: timeString, 
        type 
    });

    // Play sound
    const sentSound = new Audio('sent.mp3');
    const receiveSound = new Audio('recieve.mp3');
    
    if (type === 'sent') {
        sentSound.currentTime = 0;
        sentSound.play().catch(e => console.log('Audio play failed:', e));
    } else if (type === 'received') {
        receiveSound.currentTime = 0;
        receiveSound.play().catch(e => console.log('Audio play failed:', e));
    }
}

function updateChoiceButton() {
    const choiceButton = document.getElementById('choiceBtn');
    if (!choiceButton) return;

    if (currentStep < questions.length) {
        choiceButton.textContent = questions[currentStep];
        choiceButton.disabled = false;
    } else {
        choiceButton.textContent = "Chat Completed";
        choiceButton.disabled = true;
    }
}

function selectChoice() {
    if (isProcessing || currentStep >= questions.length) return;

    const choiceButton = document.getElementById('choiceBtn');
    if (!choiceButton) return;

    isProcessing = true;
    const question = questions[currentStep];
    choiceButton.disabled = true;

    // Add user's message
    addMessage(question, 'sent');

    // Simulate typing delay, then add response
    setTimeout(() => {
        const answer = getAnswer(question);
        addMessage(answer, 'received');

        currentStep++;

        // Check if chat is completed
        if (currentStep >= questions.length) {
            setTimeout(completeMrRayChat, 1500);
        }

        // Re-enable button for next question
        setTimeout(() => {
            updateChoiceButton();
            isProcessing = false;
        }, 1000);

    }, 1500);
}

function initChat() {
    console.log("💬 Chat with Mr. Ray initialized");
    updateChoiceButton();
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    const choiceButton = document.getElementById('choiceBtn');
    const chatMessages = document.getElementById('chatMessages');

    // Check if required elements exist
    if (!choiceButton || !chatMessages) {
        console.error('❌ Required elements not found!');
        return;
    }

    // Event listeners
    choiceButton.addEventListener('click', selectChoice);

    // Initialize
    updateTime();
    initChat();
    setInterval(updateTime, 60000);
});

// ========== EXPORT FUNCTIONS TO GLOBAL SCOPE ==========
window.selectChoice = selectChoice;
window.completeMrRayChat = completeMrRayChat;
window.closeTaskPopup = closeTaskPopup;
window.closeAppAndReturnHome = closeAppAndReturnHome;

// ========== LOCALSTORAGE UTILITY FUNCTIONS ==========
// Check if Mr. Ray chat is already completed
function isMrRayChatCompleted() {
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    return progress['chat_mr_ray'] === true;
}

// Get all task progress
function getAllTaskProgress() {
    return JSON.parse(localStorage.getItem('taskProgress') || '{}');
}

// Clear all progress (for testing/reset)
function clearAllProgress() {
    localStorage.removeItem('taskProgress');
    console.log('🗑️ All progress cleared');
}

// Check if Sahil is unlocked
function isSahilUnlocked() {
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    return progress['chat_mr_ray'] === true;
}

// Export localStorage functions
window.chatUtils = {
    isMrRayChatCompleted,
    getAllTaskProgress,
    clearAllProgress,
    isSahilUnlocked
};