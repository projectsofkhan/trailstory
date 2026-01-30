let currentContact = '';

/**
 * Back Button - Closes app tab and returns to home
 */
function initializeBackButton() {
    // Get the back button
    const backButton = document.querySelector('.back-button');
    
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            closeAppAndReturnHome();
        });
    }
    
    // Also support Android back button
    window.addEventListener('popstate', function() {
        closeAppAndReturnHome();
    });

    // Support browser back button
    window.onkeydown = function(e) {
        if (e.key === 'Escape') {
            closeAppAndReturnHome();
        }
    };
}

/**
 * Close app tab and focus home screen
 */
function closeAppAndReturnHome() {
    console.log('🔙 Closing Phone and returning to home...');
    
    // Try to focus the home tab first
    if (window.opener && !window.opener.closed) {
        try {
            window.opener.focus();
            console.log('✅ Home tab focused');
        } catch (error) {
            console.log('⚠️ Could not focus home tab');
        }
    }
    
    // Close this app tab
    setTimeout(() => {
        window.close();
    }, 50);
}

/**
 * AUTO-REDIRECT SYSTEM for all apps
 */
function initializeAutoRedirect() {
    window.addEventListener('beforeunload', function() {
        console.log('🔄 Phone closing - redirecting to home...');

        if (window.opener && !window.opener.closed) {
            try {
                window.opener.location.href = window.location.origin + '/Trail/';
                console.log('✅ Home tab redirected!');
            } catch (error) {
                console.log('⚠️ Could not redirect, focusing home tab...');
                try {
                    window.opener.focus();
                } catch (focusError) {
                    console.log('❌ Could not focus home tab');
                }
            }
        }
    });
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
 * Formats contact name for URL path
 */
function formatContactName(contactName) {
    // Special case for Mr. Ray = Misterray (with capital M)
    if (contactName === 'Mr. Ray') {
        return 'Misterray';
    }

    // For other names, convert to lowercase and remove special characters
    return contactName.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Opens unlocked contact - redirects to URL with contact name IN SAME TAB
 */
function openContact(contactName) {
    // Format the contact name for URL path
    const formattedName = formatContactName(contactName);

    // Create the URL with the contact name
    const url = `https://projectsofkhan.github.io/Trail/apps/phone/contacts/${formattedName}/index.html`;

    // Open the URL in the SAME tab
    window.location.href = url;
}

/**
 * Shows password prompt for locked contacts
 */
function showPasswordPrompt(contactName) {
    currentContact = contactName;
    const passwordOverlay = document.getElementById('passwordOverlay');
    const passwordContactName = document.getElementById('passwordContactName');
    const passwordInput = document.getElementById('passwordInput');

    if (passwordOverlay && passwordContactName && passwordInput) {
        passwordContactName.textContent = `to access ${contactName}`;
        passwordInput.value = '';
        passwordOverlay.style.display = 'flex';
        passwordInput.focus();
    }
}

/**
 * Closes password prompt
 */
function closePasswordPrompt() {
    const passwordOverlay = document.getElementById('passwordOverlay');
    if (passwordOverlay) {
        passwordOverlay.style.display = 'none';
        currentContact = '';
    }
}

/**
 * Checks password for locked contacts
 * For now, any password is valid as requested
 */
function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;

    // For now, any password is valid as requested
    if (password.length > 0) {
        // Format the contact name for URL path
        const formattedName = formatContactName(currentContact);

        // Create the URL with the contact name
        const url = `https://projectsofkhan.github.io/Trail/apps/phone/contacts/${formattedName}/index.html`;

        // Open the URL in the SAME tab
        window.location.href = url;

        closePasswordPrompt();
    } else {
        alert('❌ Please enter a password!');
        passwordInput.focus();
    }
}

// Handle Enter key in password input
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }
});

// Initialize when page loads
window.onload = function() {
    updateTime();
    setInterval(updateTime, 60000);
    initializeBackButton();    // 🆕 Back button navigation
    initializeAutoRedirect();  // 🆕 Auto-redirect system
    
    console.log('📞 Phone App Ready - Back button closes tab!');
};