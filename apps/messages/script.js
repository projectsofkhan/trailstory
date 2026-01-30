// Updated contacts data - All contacts visible but most locked
const contacts = [
    { name: 'Mr. Ray', avatar: '👨‍💼', lastMessage: 'Eric Where are you?', time: '10:30 AM', unread: 1 },
    { name: 'Dyere', avatar: '👨‍🔧', lastMessage: 'The repair is done', time: 'Yesterday', unread: 0 },
    { name: 'Sahil', avatar: '👨‍🎓', lastMessage: 'Hey Eric Come where are you?', time: 'Yesterday', unread: 0 },
    { name: 'Mom', avatar: '👩', lastMessage: 'Hey come home son.', time: '11/15/23', unread: 0 },
    { name: 'Sister', avatar: '👧', lastMessage: 'Hey bro we are missing you where are you?', time: '11/14/23', unread: 0 },
    { name: 'Feisher', avatar: '👨‍💻', lastMessage: 'Code review done', time: '11/13/23', unread: 0 },
    { name: 'Dad', avatar: '👨', lastMessage: 'Dinner at 7', time: '11/12/23', unread: 0 },
    { name: 'Layari', avatar: '👩‍🎨', lastMessage: 'Design ready', time: '11/11/23', unread: 0 },
    { name: 'Dan', avatar: '👨‍💼', lastMessage: 'Project launch', time: '11/10/23', unread: 0 },
    { name: 'Falco', avatar: '👨‍✈️', lastMessage: 'Flight confirmed', time: '11/09/23', unread: 0 }
];

// ========== TASK PROGRESSION SYSTEM ==========
const TaskProgress2 = {
    init() {
        console.log('🔄 Initializing Messages Task System...');

        // Always check for Dad unlock on init
        this.checkDadUnlockCondition();

        // Set up storage listener
        this.setupStorageListener();
    },

    // Check if Dad should be unlocked (after Task 4)
    checkDadUnlockCondition() {
        console.log('🔍 Checking Dad unlock condition...');

        const taskProgress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
        const extendedProgress = JSON.parse(localStorage.getItem('extendedProgress') || '{}');

        console.log('📊 Task progress:', taskProgress);
        console.log('📊 Extended progress:', extendedProgress);

        // Dad gets unlocked when task4_call_dyere is completed
        const isTask4Done = taskProgress.task4_call_dyere;

        console.log('   - task4_call_dyere completed:', isTask4Done);
        console.log('   - Dad already unlocked:', extendedProgress.unlock_dad);

        if (isTask4Done && !extendedProgress.unlock_dad) {
            console.log('🎉 Unlocking Dad...');
            // Unlock Dad
            extendedProgress.unlock_dad = true;
            localStorage.setItem('extendedProgress', JSON.stringify(extendedProgress));

            console.log('✅ Dad contact unlocked! Task 4 completed.');
            
            // Show subtle notification instead of big popup
            this.showSubtleNotification();
        } else if (isTask4Done && extendedProgress.unlock_dad) {
            console.log('✅ Dad already unlocked from previous session');
        }
    },

    setupStorageListener() {
        // Listen for localStorage changes from Task Manager
        window.addEventListener('storage', (e) => {
            console.log('📦 Storage event:', e.key);

            if (e.key === 'taskProgress') {
                console.log('📢 Task progress updated, checking Dad unlock...');
                this.checkDadUnlockCondition();
            }

            if (e.key === 'extendedProgress') {
                console.log('📢 Extended progress updated');
                // Force re-render contacts when Dad gets unlocked
                if (window.renderContacts) {
                    window.renderContacts();
                }
            }
        });

        // Also set up polling to check for changes (in case storage event doesn't fire)
        setInterval(() => {
            this.checkDadUnlockCondition();
        }, 2000);
    },

    // Show subtle notification instead of big popup
    showSubtleNotification() {
        console.log('📢 Showing subtle notification...');
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #1a237e, #0d47a1);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 9999;
            animation: slideDown 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
            text-align: center;
            min-width: 250px;
            max-width: 300px;
            font-size: 14px;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                <span style="font-size: 1.2em;">🔓</span>
                <div>
                    <div style="font-size: 14px; font-weight: 600;">Dad Unlocked!</div>
                    <div style="font-size: 12px; opacity: 0.9;">Task 4 completed - Dad is now available</div>
                </div>
            </div>
            <style>
                @keyframes slideDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            </style>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Play subtle sound
        this.playSubtleSound();
    },

    playSubtleSound() {
        try {
            // Use a simple beep sound or no sound at all
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            setTimeout(() => oscillator.stop(), 100);
        } catch (error) {
            console.log('🔇 Sound not supported or user blocked audio');
        }
    }
};

// Format contact name for URL
function formatContactName(contactName) {
    if (contactName === 'Mr. Ray') return 'misterray';
    return contactName.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Smart chat navigation - checks task progress (SYNCED WITH TASK MANAGER)
function openChat(contactName) {
    const formattedName = formatContactName(contactName);
    const taskProgress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    const extendedProgress = JSON.parse(localStorage.getItem('extendedProgress') || '{}');

    console.log(`🔍 Opening chat for ${contactName}`);
    console.log('   Task progress:', taskProgress);
    console.log('   Extended progress:', extendedProgress);

    // Only Mr. Ray is always unlocked
    if (contactName === 'Mr. Ray') {
        const realUrl = `https://projectsofkhan.github.io/Trail/apps/messages/contacts/${formattedName}/index.html`;
        window.location.href = realUrl;
    } 
    // Sahil requires Mr. Ray task completion
    else if (contactName === 'Sahil') {
        if (taskProgress.chat_mr_ray) {
            const realUrl = `https://projectsofkhan.github.io/Trail/apps/messages/contacts/${formattedName}/index.html`;
            window.location.href = realUrl;
        } else {
            const lockedUrl = `https://projectsofkhan.github.io/Trail/apps/messages/contacts/${formattedName}/locked.html`;
            window.location.href = lockedUrl;
        }
    }
    // Dyere requires Sahil task completion
    else if (contactName === 'Dyere') {
        if (taskProgress.talk_sahil) {
            const realUrl = `https://projectsofkhan.github.io/Trail/apps/messages/contacts/${formattedName}/index.html`;
            window.location.href = realUrl;
        } else {
            const lockedUrl = `https://projectsofkhan.github.io/Trail/apps/messages/contacts/${formattedName}/locked.html`;
            window.location.href = lockedUrl;
        }
    }
    // ✅ DAD: Unlocked after completing Task 4 (task4_call_dyere)
    else if (contactName === 'Dad') {
        console.log('👨 Checking Dad unlock status...');
        console.log('   - task4_call_dyere:', taskProgress.task4_call_dyere);
        console.log('   - unlock_dad:', extendedProgress.unlock_dad);

        if (extendedProgress.unlock_dad || taskProgress.task4_call_dyere) {
            console.log('🔓 Dad is unlocked! Going to chat...');
            const realUrl = `https://projectsofkhan.github.io/Trail/apps/messages/contacts/${formattedName}/index.html`;
            window.location.href = realUrl;
        } else {
            console.log('🔒 Dad is still locked...');
            const lockedUrl = `https://projectsofkhan.github.io/Trail/apps/messages/contacts/${formattedName}/locked.html`;
            window.location.href = lockedUrl;
        }
    }
    // All other contacts are locked for now
    else {
        const lockedUrl = `https://projectsofkhan.github.io/Trail/apps/messages/contacts/${formattedName}/locked.html`;
        window.location.href = lockedUrl;
    }
}

// Render contacts - All visible, no lock icons
function renderContacts(filter = '') {
    const contactsList = document.getElementById('contactsList');
    if (!contactsList) {
        console.error('❌ contactsList element not found!');
        return;
    }

    console.log('🔄 Rendering contacts...');

    contactsList.innerHTML = '';

    const filteredContacts = contacts.filter(contact => {
        return contact.name.toLowerCase().includes(filter.toLowerCase());
    });

    filteredContacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-item';
        contactElement.onclick = () => {
            playClickSound();
            openChat(contact.name);
        };

        contactElement.innerHTML = `
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-last-message">${contact.lastMessage}</div>
            </div>
            <div class="contact-meta">
                <div class="message-time">${contact.time}</div>
                ${contact.unread > 0 ? `<div class="unread-badge">${contact.unread}</div>` : ''}
            </div>
        `;

        contactsList.appendChild(contactElement);
    });

    console.log('✅ Contacts rendered successfully');
}

function playClickSound() {
    try {
        // Use a simple click sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        setTimeout(() => oscillator.stop(), 50);
    } catch (error) {
        // Fallback: Try to play a simple beep using the old method
        try {
            const sound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
            sound.volume = 0.1;
            sound.play().catch(() => {
                // If all else fails, just ignore the sound
            });
        } catch (e) {
            // No sound available
        }
    }
}

// Simple back button function
function closeAppAndReturnHome() {
    if (window.opener && !window.opener.closed) {
        try {
            window.opener.focus();
        } catch (error) {
            console.log('⚠️ Could not focus home tab');
        }
    }

    setTimeout(() => {
        window.close();
    }, 50);
}

// DEBUG FUNCTION: Manually unlock Dad for testing
function debugUnlockDad() {
    console.log('🔓 DEBUG: Manually unlocking Dad...');
    const extendedProgress = JSON.parse(localStorage.getItem('extendedProgress') || '{}');
    extendedProgress.unlock_dad = true;
    localStorage.setItem('extendedProgress', JSON.stringify(extendedProgress));

    const taskProgress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    taskProgress.task4_call_dyere = true;
    localStorage.setItem('taskProgress', JSON.stringify(taskProgress));

    // Show subtle notification
    TaskProgress2.showSubtleNotification();
    
    // Refresh contacts
    if (window.renderContacts) {
        window.renderContacts();
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM Content Loaded - Initializing Messages App...');

    // Initialize task system
    TaskProgress2.init();

    // Update time
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
        function updateTime() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            currentTimeElement.textContent = `${hours}:${minutes}`;
        }
        updateTime();
        setInterval(updateTime, 60000);
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderContacts(this.value);
        });
    }

    // Render contacts initially
    renderContacts();

    // Add back button event listener
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            closeAppAndReturnHome();
        });
    }

    console.log('💬 Messages App Ready!');
    console.log('📝 Debug: Type debugUnlockDad() in console to manually unlock Dad');
});

// Make functions globally available
window.openChat = openChat;
window.renderContacts = renderContacts;
window.closeAppAndReturnHome = closeAppAndReturnHome;
window.debugUnlockDad = debugUnlockDad; // Debug function