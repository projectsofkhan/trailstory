let currentContact = '';

/**
 * Back Button – Return to home (same tab)
 */
function initializeBackButton() {
    const backButton = document.querySelector('.back-button');

    if (backButton) {
        backButton.addEventListener('click', function (e) {
            e.preventDefault();
            returnHome();
        });
    }

    // Browser back / Android back
    window.addEventListener('popstate', returnHome);

    // ESC key
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            returnHome();
        }
    });
}

/**
 * Return to Home Screen (TrailStory launcher)
 */
function returnHome() {
    console.log('🔙 Returning to home...');
    window.location.href = '../../index.html';
}

/**
 * Update time in status bar
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
 * Format contact name to folder name
 */
function formatContactName(contactName) {
    if (contactName === 'Mr. Ray') {
        return 'Misterray';
    }
    return contactName.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Open unlocked contact (RELATIVE PATH)
 */
function openContact(contactName) {
    const formattedName = formatContactName(contactName);
    const url = `contacts/${formattedName}/index.html`;
    window.location.href = url;
}

/**
 * Show password overlay
 */
function showPasswordPrompt(contactName) {
    currentContact = contactName;

    const overlay = document.getElementById('passwordOverlay');
    const nameText = document.getElementById('passwordContactName');
    const input = document.getElementById('passwordInput');

    if (overlay && nameText && input) {
        nameText.textContent = `to access ${contactName}`;
        input.value = '';
        overlay.style.display = 'flex';
        input.focus();
    }
}

/**
 * Close password overlay
 */
function closePasswordPrompt() {
    const overlay = document.getElementById('passwordOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        currentContact = '';
    }
}

/**
 * Check password (any password valid as requested)
 */
function checkPassword() {
    const input = document.getElementById('passwordInput');
    if (!input) return;

    if (input.value.length > 0) {
        const formattedName = formatContactName(currentContact);
        window.location.href = `contacts/${formattedName}/index.html`;
        closePasswordPrompt();
    } else {
        alert('❌ Please enter a password');
        input.focus();
    }
}

/**
 * Enter key support for password
 */
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('passwordInput');
    if (input) {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }
});

/**
 * Init on load
 */
window.onload = function () {
    updateTime();
    setInterval(updateTime, 60000);
    initializeBackButton();

    console.log('📞 Phone App Ready');
};