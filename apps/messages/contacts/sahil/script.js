let currentStep = 0;
let messages = [];
let isProcessing = false;

// Questions and their fixed answers
const questions = [
    "Hello Sahil, I'm a detective working on Eric Petrove's disappearance. I need to ask you a few questions.",
    "I'm trying to track his activities in the last few days before he went missing. You were close to him, right?",
    "What do you mean?",
    "About what?",
    "When was the last time you saw him?",
    "Did anything unusual happen?",
    "Why?",
    "Do you think Dyere is involved?",
    "Thank you, Sahil."
];

// Answer mapping
const answerMap = {
    "Hello Sahil, I'm a detective working on Eric Petrove's disappearance. I need to ask you a few questions.": 
        "...Eric? Why now?",
    "I'm trying to track his activities in the last few days before he went missing. You were close to him, right?": 
        "Yeah, we were close… at least we used to be.",
    "What do you mean?": 
        "Look, Eric changed a lot recently. Stopped hanging out. Stopped replying. Always stressed about… something.",
    "About what?": 
        "I don't know. He wouldn't tell me. Every time I asked, he just said: 'I'm fixing my life.' Never explained.",
    "When was the last time you saw him?": 
        "Two weeks ago. He came to meet me at the café near school. He looked tired… nervous. Kept checking his phone.",
    "Did anything unusual happen?": 
        "Yeah… He told me if anything ever happened to him… I should not trust Dyere.",
    "Why?": 
        "He didn't say. He just walked away after that. I haven't seen him since.",
    "Do you think Dyere is involved?": 
        "I'm not saying anything. Ask him yourself. I'm out of this.",
    "Thank you, Sahil.": 
        "Just find him… He didn't deserve whatever happened."
};

// Check if Sahil chat should be available
function checkSahilAvailability() {
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    
    // Check if Mr. Ray chat is completed (Sahil should be unlocked)
    if (!progress['chat_mr_ray']) {
        console.log('⚠️ Sahil chat not available yet. Complete Mr. Ray chat first.');
        return false;
    }
    
    // Check if Sahil chat is already completed
    if (progress['chat_sahil']) {
        console.log('✅ Sahil chat already completed');
        loadCompletedChat();
        return true;
    }
    
    return true;
}

// Load completed chat if already finished
function loadCompletedChat() {
    const chatMessages = document.getElementById('chatMessages');
    const choiceButton = document.getElementById('choiceBtn');
    const choiceContainer = document.getElementById('choiceContainer');
    
    if (!chatMessages || !choiceButton) return;
    
    // Load saved messages from localStorage
    const savedMessages = JSON.parse(localStorage.getItem('sahil_chat_messages') || '[]');
    
    if (savedMessages.length > 0) {
        // Clear existing messages
        chatMessages.innerHTML = '';
        
        // Add all saved messages
        savedMessages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.type}`;
            messageDiv.innerHTML = `
                <div class="message-content">${msg.content}</div>
                <div class="message-time">${msg.time}</div>
            `;
            chatMessages.appendChild(messageDiv);
        });
        
        // Scroll to bottom
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    }
    
    // Disable choice button
    choiceButton.textContent = "Conversation Completed";
    choiceButton.disabled = true;
    choiceButton.style.opacity = '0.7';
    
    // Add completed indicator
    if (choiceContainer) {
        const completedIndicator = document.createElement('div');
        completedIndicator.style.cssText = `
            text-align: center;
            color: #128C7E;
            font-size: 12px;
            margin-top: 10px;
            font-weight: 500;
        `;
        completedIndicator.textContent = '✓ Task Completed';
        choiceContainer.appendChild(completedIndicator);
    }
}

// Save chat messages to localStorage
function saveChatMessages() {
    localStorage.setItem('sahil_chat_messages', JSON.stringify(messages));
    console.log('💾 Chat messages saved to localStorage');
}

// Save progress to localStorage
function saveProgress() {
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    
    // Mark Sahil chat as completed
    progress['chat_sahil'] = true;
    
    // Add clue about Dyere suspicion
    progress['clue_dyere_suspicion'] = true;
    
    // Unlock Dyere contact
    progress['unlock_dyere'] = true;
    
    // Save back to localStorage
    localStorage.setItem('taskProgress', JSON.stringify(progress));
    console.log('✅ Progress saved: Sahil chat completed, Dyere unlocked');
}

// Get fixed answer for question
function getAnswer(question) {
    return answerMap[question] || "I don't want to talk about this anymore.";
}

// Update the choice button
function updateChoiceButton() {
    const choiceButton = document.getElementById('choiceBtn');
    if (!choiceButton) return;
    
    if (currentStep < questions.length) {
        choiceButton.textContent = questions[currentStep];
        choiceButton.disabled = false;
    } else {
        choiceButton.textContent = "Conversation Ended";
        choiceButton.disabled = true;

        // Complete the task when conversation ends
        setTimeout(() => {
            completeSahilChat();
        }, 2000);
    }
}

// ========== TASK COMPLETION FUNCTION ==========
function completeSahilChat() {
    // Save chat messages
    saveChatMessages();
    
    // Save progress to localStorage
    saveProgress();
    
    // Play task completion sound
    const taskSound = new Audio('https://projectsofkhan.github.io/Trail/apps/task/task.mp3');
    taskSound.volume = 0.6;
    taskSound.play().catch(e => {
        console.log('Task sound error:', e);
    });

    // ✅ COMPLETE IN BOTH SYSTEMS
    // 1. Complete in TaskProgress system (for Messages app)
    if (window.TaskProgress && typeof TaskProgress.completeTask === 'function') {
        console.log('🎯 Completing task_2 in TaskProgress system');
        TaskProgress.completeTask('task_2');
    }

    // 2. Complete in gameTasks system (for Task Manager app)
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    progress['talk_sahil'] = true; // This is the key your Task Manager is looking for!
    localStorage.setItem('taskProgress', JSON.stringify(progress));

    console.log('✅ Task "talk_sahil" completed for Task Manager!');
    console.log('🔓 Dyere contact unlocked!');
    console.log('🕵️ Clue gained: Eric warned about Dyere');

    const popup = document.createElement('div');
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
        ">
            <div style="font-size: 3rem; margin-bottom: 15px;">🎉</div>
            <h3 style="margin: 0 0 10px 0; font-size: 1.4rem; font-weight: 600;">Task Completed</h3>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 12px; margin: 15px 0;">
                <div style="font-size: 1.1rem; font-weight: 500; margin-bottom: 5px;">Interview Sahil</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">Task Completed Successfully</div>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.15); padding: 12px; border-radius: 10px; margin: 15px 0;">
                <div style="font-size: 1.8rem; margin-right: 10px;">🔓</div>
                <div style="text-align: left;">
                    <div style="font-size: 0.9rem; font-weight: 500;">New Contact Unlocked!</div>
                    <div style="font-size: 0.8rem; opacity: 0.9;">Dyere is now Available</div>
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
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
        </style>
    `;

    document.body.appendChild(popup);

    // Notify Task Manager app
    if (window.opener && !window.opener.closed) {
        try {
            window.opener.postMessage({
                type: 'TASK_COMPLETED',
                taskId: 'talk_sahil' // Use the correct task ID for Task Manager
            }, '*');
            console.log('📱 Task Manager notified about talk_sahil completion');
        } catch (error) {
            console.log('⚠️ Could not notify Task Manager');
        }
    }

    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 8000);
}

function closePopup() {
    const popup = document.querySelector('div[style*="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8);"]');
    if (popup) {
        popup.remove();
    }
}

// Add message to chat
function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-time">${timeString}</div>
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
        time: timeString,
        type: type
    });

    // Play sound based on message type
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

// Handle choice selection
function selectChoice() {
    if (isProcessing || currentStep >= questions.length) return;

    const choiceButton = document.getElementById('choiceBtn');
    if (!choiceButton) return;

    isProcessing = true;
    const question = questions[currentStep];

    // Disable button immediately
    choiceButton.disabled = true;

    console.log("Detective:", question);

    // STEP 1: Send user message immediately
    addMessage(question, 'sent');

    // STEP 2: Wait 1.5 seconds and send reply
    setTimeout(() => {
        const answer = getAnswer(question);
        console.log("Sahil:", answer);
        addMessage(answer, 'received');

        // Move to next question
        currentStep++;

        // Update button for next question
        setTimeout(() => {
            updateChoiceButton();
            isProcessing = false;
        }, 1000);

    }, 1500);
}

// Update time
function updateTime() {
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        currentTimeElement.textContent = `${hours}:${minutes}`;
    }
}

// Initialize chat
function initChat() {
    console.log("🕵️ Detective chat with Sahil initialized");
    
    // Check if chat should be available
    if (!checkSahilAvailability()) {
        const choiceButton = document.getElementById('choiceBtn');
        const chatMessages = document.getElementById('chatMessages');
        
        if (choiceButton) {
            choiceButton.textContent = "Complete Mr. Ray Chat First";
            choiceButton.disabled = true;
            choiceButton.style.opacity = '0.7';
        }
        
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="message received" style="align-self: center; background: #f8d7da; color: #721c24;">
                    <div class="message-content">🔒 Complete Mr. Ray's chat first to unlock Sahil</div>
                    <div class="message-time">System</div>
                </div>
            `;
        }
        return;
    }
    
    updateChoiceButton();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    const choiceButton = document.getElementById('choiceBtn');
    
    // Event listeners
    if (choiceButton) {
        choiceButton.addEventListener('click', selectChoice);
    }

    // Start everything
    updateTime();
    initChat();
    setInterval(updateTime, 60000);
});

// ========== LOCALSTORAGE UTILITY FUNCTIONS ==========

// Check if Sahil chat is completed
function isSahilChatCompleted() {
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    return progress['chat_sahil'] === true;
}

// Check if Dyere is unlocked
function isDyereUnlocked() {
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    return progress['unlock_dyere'] === true;
}

// Get all clues
function getAllClues() {
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    const clues = [];
    
    if (progress['clue_dyere_suspicion']) {
        clues.push('Eric warned Sahil not to trust Dyere');
    }
    
    return clues;
}

// Export functions to global scope
window.selectChoice = selectChoice;
window.completeSahilChat = completeSahilChat;
window.closePopup = closePopup;
window.isSahilChatCompleted = isSahilChatCompleted;
window.isDyereUnlocked = isDyereUnlocked;
window.getAllClues = getAllClues;