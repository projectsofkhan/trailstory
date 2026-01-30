import { Shutter } from '../shutter/shutter.js';

Shutter.open();   // from ANY app
Shutter.close();  // synced everywhere





// ✅ CHECK IF TASK 6 IS COMPLETED
function isTask6Completed() {
    // Check localStorage for task completion status
    const task6Completed = localStorage.getItem('task6_completed');

    console.log('📖 Checking Task 6 completion:', task6Completed);

    if (task6Completed === 'true' || task6Completed === true) {
        console.log('✅ Task 6 IS completed');
        return true;
    }

    // Also check taskProgress storage
    const taskProgress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    console.log('📖 Task Progress data:', taskProgress);

    if (taskProgress['task6_unlock_instashan'] === true) {
        console.log('✅ Task 6 IS completed (from taskProgress)');
        // Sync it to task6_completed for consistency
        localStorage.setItem('task6_completed', 'true');
        return true;
    }

    console.log('❌ Task 6 is NOT completed');
    return false;
}

// Apply lock/unlock status based on Task 6 completion
function applyPageLockStatus() {
    const page1Item = document.getElementById('page1-item');

    if (isTask6Completed()) {
        // Task 6 is completed - Page 1 should be unlocked
        page1Item.classList.remove('locked');
        page1Item.style.cursor = 'pointer';
        page1Item.onclick = function() { 
            openPage('page1');
        };
        console.log('✅ Page 1 unlocked - Task 6 completed');
    } else {
        // Task 6 is NOT completed - Page 1 should be locked
        page1Item.classList.add('locked');
        page1Item.style.cursor = 'not-allowed';
        page1Item.onclick = function() { 
            openLockedPage();
        };
        console.log('🔒 Page 1 locked - Task 6 not completed');
    }
}

// Open locked page (for all locked pages)
function openLockedPage() {
    const pagesGrid = document.getElementById('pagesGrid');
    if (pagesGrid) {
        pagesGrid.classList.add('page-transition');
    }
    setTimeout(() => {
        window.location.href = 'lockedpage.html'; // Local file
    }, 200);
}

// Open specific page (only for unlocked pages) - UPDATED PATHS
function openPage(pageNumber) {
    // Always double-check before opening
    if (pageNumber === 'page1' && !isTask6Completed()) {
        console.log('⚠️ Double-check failed: Task 6 not completed');
        openLockedPage();
        return;
    }

    const pagesGrid = document.getElementById('pagesGrid');
    if (pagesGrid) {
        pagesGrid.classList.add('page-transition');
    }

    setTimeout(() => {
        if (pageNumber === 'page1') {
            // ✅ UPDATED: Redirect to local page1 folder
            window.location.href = 'page1/index.html';
        } else {
            openLockedPage();
        }
    }, 200);
}

// Listen for storage changes (when TaskProgress updates localStorage)
function setupStorageListener() {
    window.addEventListener('storage', function(event) {
        console.log('📡 Storage event detected:', event.key, '=', event.newValue);

        if (event.key === 'task6_completed' || event.key === 'taskProgress') {
            console.log('🔄 Task status changed, updating page lock status...');
            setTimeout(() => {
                applyPageLockStatus();
            }, 100);
        }
    });

    // Also check for message events from TaskProgress
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'DIARY_UNLOCKED') {
            console.log('📨 Received DIARY_UNLOCKED message from TaskProgress');
            localStorage.setItem('task6_completed', 'true');
            applyPageLockStatus();
        }
    });
}

/**
 * Back Button - Closes app tab and returns to home
 */
function initializeBackButton() {
    const backButton = document.querySelector('.back-button');

    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            closeAppAndReturnHome();
        });
    }

    window.addEventListener('popstate', function() {
        closeAppAndReturnHome();
    });

    window.onkeydown = function(e) {
        if (e.key === 'Escape') {
            closeAppAndReturnHome();
        }
    };
}

function closeAppAndReturnHome() {
    console.log('🔙 Closing Diary and returning to home...');

    if (window.opener && !window.opener.closed) {
        try {
            window.opener.focus();
            console.log('✅ Home tab focused');
        } catch (error) {
            console.log('⚠️ Could not focus home tab');
        }
    }

    setTimeout(() => {
        window.close();
    }, 50);
}

function initializeAutoRedirect() {
    window.addEventListener('beforeunload', function() {
        console.log('🔄 Diary closing - redirecting to home...');

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

document.addEventListener('DOMContentLoaded', function() {
    const pagesGrid = document.getElementById('pagesGrid');
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

    // Apply lock/unlock status for pages
    applyPageLockStatus();

    // Setup storage listener to detect when Task 6 completes
    setupStorageListener();

    // Add fade animations to page items
    if (pagesGrid) {
        const pageItems = pagesGrid.querySelectorAll('.page-item');
        pageItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Initialize back button and auto-redirect
    initializeBackButton();
    initializeAutoRedirect();

    console.log('📖 Diary App Ready - Checking Task 6 completion');
    console.log('📖 Current task6_completed status:', localStorage.getItem('task6_completed'));
});

function nextPage() {
    window.location.href = 'lockedpage.html';
}

function prevPage() {
    window.location.href = 'lockedpage.html';
}

// Debug function - can be called from console
window.debugTask6Status = function() {
    console.log('🔍 DEBUG TASK 6 STATUS:');
    console.log('localStorage task6_completed:', localStorage.getItem('task6_completed'));
    console.log('localStorage taskProgress:', JSON.parse(localStorage.getItem('taskProgress') || '{}'));
    console.log('Is task6 completed?', isTask6Completed());
};

// Make functions global
window.openPage = openPage;
window.openLockedPage = openLockedPage;
window.nextPage = nextPage;
window.prevPage = prevPage;
window.isTask6Completed = isTask6Completed;
window.applyPageLockStatus = applyPageLockStatus;