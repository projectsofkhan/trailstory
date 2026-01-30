// App data with new folder structure
const apps = [
    { id: 'messages', name: 'Messages', icon: '💬', color: '#579AD9', file: 'https://projectsofkhan.github.io/Trail/apps/messages/index.html' },
    { id: 'phone', name: 'Phone', icon: '📞', color: '#6BBF6B', file: 'https://projectsofkhan.github.io/Trail/apps/phone/index.html' },
    { id: 'gallery', name: 'Gallery', icon: '🌄', color: '#6A618F', file: 'https://projectsofkhan.github.io/Trail/apps/gallery/index.html' },
    { 
        id: 'InstaShan', 
        name: 'InstaShan', 
        icon: 'https://projectsofkhan.github.io/pythontodoapp/instashan.jpg', 
        color: '#9B5BBE', 
        file: 'https://projectsofkhan.github.io/Trail/apps/instashan.html'
    },
    { id: 'diary', name: 'Diary', icon: '📖', color: '#A08E77', file: 'https://projectsofkhan.github.io/Trail/apps/diary/index.html' },
    { id: 'browser', name: 'Browser', icon: '🌐', color: '#5D6B9C', file: 'https://projectsofkhan.github.io/Trail/apps/browser/index.html' },
    { id: 'settings', name: 'Settings', icon: '⚙️', color: '#555555', file: 'https://projectsofkhan.github.io/Trail/apps/settings/index.html' }
];

// Available websites (case insensitive)
const availableWebsites = {
    'avery-map.com': {
        title: 'Avery Map - Location Data',
        content: `
            <p>Detailed map showing locations and coordinates.</p>
            <div class="image-container">
                <img src="https://image.jimcdn.com/app/cms/image/transf/none/path/s5b7af0618d302082/image/ie4578239dad12bfe/version/1763192908/image.jpg" 
                     alt="Avery Map" 
                     class="map-image"
                     onerror="this.style.display='none'; document.getElementById('mapFallback').style.display='block';">
                <div id="mapFallback" style="display: none; background: #1a1a1a; padding: 40px; border-radius: 10px; color: #888; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🗺️</div>
                    <div>Avery Map Image</div>
                    <div style="font-size: 12px; margin-top: 5px;">Image failed to load</div>
                </div>
                <div class="image-caption">Avery Map - Location coordinates and markers</div>
            </div>
            <div class="info-box">
                <strong>Map Features:</strong><br>
                • Location markers<br>
                • Coordinate grid<br>
                • Area boundaries<br>
                • Navigation points
            </div>
        `
    },
    'kaveri-river.com': {
        title: 'Kaveri River - Natural Wonder',
        content: `
            <p>The Kaveri River is one of the major rivers of India, flowing through the states of Karnataka and Tamil Nadu.</p>
            
            <img src="https://thumbs.dreamstime.com/b/vibrant-digital-painting-depicts-serene-forest-river-flowing-lush-woodland-landscape-sunny-day-clear-blue-386116319.jpg" 
                 alt="Kaveri River" 
                 class="curved-image"
                 onerror="this.style.display='none';">
            
            <div class="info-box">
                <strong>River Characteristics:</strong><br>
                • Length: 805 km (500 mi)<br>
                • Source: Talakaveri, Western Ghats<br>
                • Mouth: Bay of Bengal<br>
                • Coldness: Maintains cool temperature year-round
            </div>
            
            <p><strong>Coldness Uses:</strong><br>
            The river's naturally cold waters are utilized for:<br>
            • Agricultural irrigation<br>
            • Drinking water supply<br>
            • Hydroelectric power generation<br>
            • Religious ceremonies and rituals</p>
            
            <p>The Kaveri is considered sacred and is often called the "Ganges of the South".</p>
        `
    },
    'hospital.com': {
        title: 'Hospital Information',
        content: `
            <div class="website-body">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/009/350/681/small/building-place-hospital-png.png" 
                     alt="Hospital" 
                     class="curved-image"
                     onerror="this.style.display='none';">
                
                <div class="info-box">
                    <strong>Hospital Services:</strong><br>
                    • Emergency Care<br>
                    • Surgical Procedures<br>
                    • Maternity Services<br>
                    • Pediatric Care<br>
                    • Diagnostic Imaging
                </div>
                
                <p><strong>About Healthcare:</strong><br>
                Modern hospitals provide comprehensive medical care with advanced technology and specialized medical professionals. They serve as crucial community health centers offering preventive, curative, and rehabilitative services.</p>
                
                <p>Hospitals maintain strict hygiene protocols and utilize state-of-the-art equipment to ensure patient safety and effective treatment outcomes.</p>
            </div>
        `
    },
    'himalaya.com': {
        title: 'Himalaya Mountains',
        content: `
            <div class="website-body">
                <img src="https://www.shutterstock.com/image-vector/breathtaking-animated-mountain-landscape-inspire-600nw-2614074607.jpg" 
                     alt="Himalaya" 
                     class="curved-image"
                     onerror="this.style.display='none';">
                
                <div class="info-box">
                    <strong>Himalaya Facts:</strong><br>
                    • Highest peak: Mount Everest (8,848 m)<br>
                    • Length: 2,400 km (1,500 mi)<br>
                    • Countries: India, Nepal, Bhutan, China, Pakistan<br>
                    • Age: Approximately 50 million years
                </div>
                
                <p><strong>About the Himalayas:</strong><br>
                The Himalayas are the highest mountain range in the world, forming a natural barrier between the Tibetan Plateau and the Indian subcontinent. These majestic mountains are home to diverse ecosystems, rare wildlife, and ancient cultures.</p>
                
                <p>The range influences weather patterns across Asia and is the source of major river systems including the Ganges, Indus, and Brahmaputra. The Himalayas continue to grow approximately 1 cm per year due to tectonic plate movements.</p>
            </div>
        `
    }
};

// Browser state
let currentPage = 'home';
let history = [];
let currentUrl = '';
let navigationHistory = [];
let currentHistoryIndex = -1;

// DOM Elements
const browserContent = document.getElementById('browserContent');
const homePage = document.getElementById('homePage');
const searchResults = document.getElementById('searchResults');
const websiteContent = document.getElementById('websiteContent');
const urlInput = document.getElementById('urlInput');
const recentItems = document.getElementById('recentItems');
const noHistoryMessage = document.getElementById('noHistoryMessage');
const appNavigation = document.getElementById('appNavigation');
const appGrid = document.getElementById('appGrid');
const homeButton = document.getElementById('homeButton');

/**
 * Fixed Back Button - Handles both browser back and app close
 */
function initializeBackButton() {
    const backButton = document.querySelector('.back-button');

    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            playClickSound();

            if (currentPage === 'home' || navigationHistory.length <= 1) {
                // Close app when on home or minimal history
                closeAppAndReturnHome();
            } else {
                // Use browser back navigation
                goBack();
            }
        });
    }

    // Support Android back button
    window.addEventListener('popstate', function(event) {
        if (currentPage === 'home' || navigationHistory.length <= 1) {
            closeAppAndReturnHome();
        } else {
            goBack();
        }
    });

    // Support Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (currentPage === 'home' || navigationHistory.length <= 1) {
                closeAppAndReturnHome();
            } else {
                goBack();
            }
        }
    });
}

/**
 * Close app tab and focus home screen
 */
function closeAppAndReturnHome() {
    console.log('🔙 Closing Browser and returning to home...');

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
 * Fixed App Lifecycle Management
 */
function initializeAppLifecycle() {
    window.addEventListener('beforeunload', function() {
        console.log('📱 Browser app closing');
        // Clean up - don't redirect parent to avoid loops
    });
}

/**
 * Browser Navigation Functions
 */
function goBack() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        const previousUrl = navigationHistory[currentHistoryIndex];
        loadWebsite(previousUrl);
    } else {
        // If no more history, go home
        goHome();
    }
}

function goHome() {
    currentPage = 'home';
    homePage.style.display = 'block';
    searchResults.style.display = 'none';
    websiteContent.style.display = 'none';
    urlInput.value = '';
}

/**
 * Initializes the app grid with proper icon handling
 */
function initializeAppGrid() {
    if (!appGrid) return;

    apps.forEach(app => {
        const iconLink = document.createElement('a');
        iconLink.className = 'app-icon';
        iconLink.href = app.file;
        iconLink.target = "_self";

        // Check if the icon is an image URL or emoji
        const isImageIcon = app.icon.includes('http') || app.icon.includes('.jpg') || app.icon.includes('.png') || app.icon.includes('.jpeg');

        let iconHTML = '';

        if (isImageIcon) {
            // Use img tag for image icons (specifically for InstaShan)
            iconHTML = `
                <div class="app-icon-body" style="background-color: ${app.color}; padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img src="${app.icon}" 
                         alt="${app.name}" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"
                         onerror="this.style.display='none'; this.parentElement.innerHTML='📷'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center';">
                </div>
                <div class="app-icon-label">${app.name}</div>
            `;
        } else {
            // Use emoji for regular icons
            iconHTML = `
                <div class="app-icon-body" style="background-color: ${app.color};">
                    ${app.icon}
                </div>
                <div class="app-icon-label">${app.name}</div>
            `;
        }

        iconLink.innerHTML = iconHTML;
        appGrid.appendChild(iconLink);
    });
}

/**
 * Opens the app navigation overlay
 */
function openAppNavigation() {
    playClickSound();
    appNavigation.style.display = 'flex';
}

/**
 * Closes the app navigation overlay
 */
function closeAppNavigation() {
    playClickSound();
    appNavigation.style.display = 'none';
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

function refreshPage() {
    playClickSound();
    if (currentPage === 'website' && currentUrl) {
        loadWebsite(currentUrl);
    }
}

function searchOrNavigate(input) {
    if (!input.trim()) return;

    const query = input.toLowerCase().trim();
    playClickSound();

    // Remove protocol and www if present
    let cleanUrl = query.replace(/https?:\/\//, '').replace(/^www\./, '');

    // Check if it's a valid website (has .com, .net, etc.)
    if (cleanUrl.match(/\.(com|net|org|io|gov|edu)$/)) {
        // Try to navigate to the website
        if (availableWebsites[cleanUrl]) {
            navigateTo(cleanUrl);
        } else {
            // Website not found
            showWebsiteNotFound(cleanUrl);
        }
    } else {
        // Treat as search
        performSearch(query);
    }
}

function performSearch(query) {
    if (!query.trim()) return;

    currentPage = 'search';
    showSearchResults(query);
    urlInput.value = query;

    // Add to history
    addToHistory(query, 'search');
}

function navigateTo(url) {
    if (!url) return;

    currentUrl = url;
    currentPage = 'website';

    // Fixed: Proper history management
    if (navigationHistory[currentHistoryIndex] !== url) {
        // Remove forward history when navigating to new page
        navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
        navigationHistory.push(url);
        currentHistoryIndex = navigationHistory.length - 1;
    }

    loadWebsite(url);
    urlInput.value = url;

    // Add to recent history
    addToHistory(url, 'website');
}

function addToHistory(item, type) {
    // Remove if already exists
    history = history.filter(entry => entry.url !== item);

    // Add to beginning
    history.unshift({
        url: item,
        title: getTitleFromUrl(item),
        type: type,
        timestamp: new Date()
    });

    // Keep only last 5 items
    if (history.length > 5) {
        history.pop();
    }

    updateHistoryDisplay();
}

function getTitleFromUrl(url) {
    const titles = {
        'avery-map.com': 'Avery Map - Location Data',
        'kaveri-river.com': 'Kaveri River Information',
        'hospital.com': 'Hospital Information',
        'himalaya.com': 'Himalaya Mountains'
    };
    return titles[url] || url;
}

function updateHistoryDisplay() {
    if (history.length === 0) {
        noHistoryMessage.style.display = 'block';
        recentItems.style.display = 'none';
    } else {
        noHistoryMessage.style.display = 'none';
        recentItems.style.display = 'block';

        recentItems.innerHTML = history.map(item => `
            <div class="recent-item" onclick="playClickSound(); navigateTo('${item.url}')">
                <div class="recent-title">${item.title}</div>
                <div class="recent-url">${item.url}</div>
            </div>
        `).join('');
    }
}

function showSearchResults(query) {
    homePage.style.display = 'none';
    searchResults.style.display = 'block';
    websiteContent.style.display = 'none';

    searchResults.innerHTML = `
        <div style="color: #888; margin-bottom: 20px; font-size: 14px;">
            Search results for "${query}"
        </div>
        <div class="error-message">
            No search results found for "${query}".<br>
            Try entering a valid website address like "avery-map.com"
        </div>
    `;
}

function loadWebsite(url) {
    homePage.style.display = 'none';
    searchResults.style.display = 'none';
    websiteContent.style.display = 'block';

    const websiteData = availableWebsites[url];
    if (websiteData) {
        websiteContent.innerHTML = `
            <div class="website-title">${websiteData.title}</div>
            <div class="website-url">${url}</div>
            ${websiteData.content}
        `;
    }
}

function showWebsiteNotFound(url) {
    homePage.style.display = 'none';
    searchResults.style.display = 'none';
    websiteContent.style.display = 'block';

    websiteContent.innerHTML = `
        <div class="website-title">Website Not Available</div>
        <div class="website-url">${url}</div>
        <div class="website-body">
            <div class="error-message">
                Cannot connect to "${url}"<br><br>
                The website may be temporarily unavailable or the address may be incorrect.
            </div>
            <p>Available websites:</p>
            <div class="info-box">
                • avery-map.com<br>
                • kaveri-river.com<br>
                • hospital.com<br>
                • himalaya.com
            </div>
        </div>
    `;

    // Add to history even if not found
    addToHistory(url, 'website');
}

// Play click sound function
function playClickSound() {
    const sound = new Audio('https://projectsofkhan.github.io/Trail/sounds/click.mp3');
    sound.volume = 0.3;
    sound.play().catch(e => console.log('Sound error:', e));
}

// Automatic click sounds for all interactive elements
function setupClickSounds() {
    document.addEventListener('click', function(event) {
        const target = event.target;
        const isClickable = (
            target.tagName === 'BUTTON' ||
            target.tagName === 'A' ||
            target.closest('.app-icon') ||
            target.closest('.recent-item') ||
            target.closest('.suggested-item') ||
            target.closest('.website-link') ||
            target.hasAttribute('onclick') ||
            target.classList.contains('clickable') ||
            (target.parentElement && target.parentElement.classList.contains('clickable'))
        );

        if (isClickable) {
            playClickSound();
        }
    });
}

// Initialize browser
window.onload = function() {
    // Set current time
    updateTime();
    setInterval(updateTime, 60000);

    // Initialize app grid with fixed InstaShan icon
    initializeAppGrid();

    // Setup click sounds
    setupClickSounds();

    // Initialize back button (fixed version)
    initializeBackButton();

    // Initialize app lifecycle
    initializeAppLifecycle();

    // Setup URL input handler
    if (urlInput) {
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchOrNavigate(this.value);
            }
        });
    }

    // Initialize home button
    if (homeButton) homeButton.addEventListener('click', goHome);

    // Show home page initially
    homePage.style.display = 'block';
    searchResults.style.display = 'none';
    websiteContent.style.display = 'none';

    // Initialize empty history
    updateHistoryDisplay();

    console.log('🌐 Browser Ready - Updated version loaded!');
    console.log('✅ Removed forward/backward buttons - Only Home button remains');
    console.log('✅ Updated URLs: hospital.com & himalaya.com');
    console.log('✅ Click sounds enabled for all interactions');
};