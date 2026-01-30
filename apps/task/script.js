// Complete task progression system
const gameTasks = {
    'chat_mr_ray': {
        title: 'Task 1: Talk to Mr. Ray',
        description: 'Start a conversation with Mr.Ray and know about Eric, his friend, and him.',
        hint: 'Go to Messages app → Click on Mr. Ray → Complete all conversation steps',
        unlocks: ['talk_sahil']
    },
    'talk_sahil': {
        title: 'Task 2: Talk to Sahil',
        description: "Now Talk To Sahil Eric's close friend.",
        hint: 'Go to Messages app → Click On Sahil → Complete All Conversation.',
        unlocks: ['investigate_dyere']
    },
    'investigate_dyere': {
        title: 'Task 3: Talk To Dyere',
        description: 'investigate Dyere.',
        hint: 'Go to Messages app → Click On Dyere → Complete the conversation.',
        unlocks: ['task4_call_dyere']
    },
    'task4_call_dyere': {
        title: 'Task 4: Call To Dyere',
        description: 'Call Dyere from the phone app to get more information',
        hint: 'Go to Phone app → Call Dyere → Listen to the call carefully.',
        unlocks: ['task5_talk_dad'] // ✅ THIS AUTOMATICALLY UNLOCKS TASK 5
    },
    'task5_talk_dad': {
        title: 'Task 5: Talk to Eric\'s Dad',
        description: 'Interview Eric\'s father for family perspective and clues',
        hint: 'Go to Messages app → Click on Dad → Complete all conversation steps',
        unlocks: ['task6_unlock_instashan'] // ✅ NOW UNLOCKS TASK 6
    },
    'task6_unlock_instashan': {
        title: 'Task 6: Unlock Instashan ID',
        description: 'Unlock the Instashan ID of Eric',
        hint: 'Go to Instashan app → Click forget password → Write Eric\'s nickname (available on Dad\'s chat)...',
        unlocks: ['task7_complete_diary'] // ✅ NOW UNLOCKS TASK 7
    },
    'task7_complete_diary': {  // ✅ NEW TASK 7
        title: 'Task 7: Complete Diary Page 1',
        description: 'Solve the riddle in Eric\'s diary to unlock the first page',
        hint: 'Go to Diary app → Click on Page 1 → Answer the riddle.',
        unlocks: [] // Last task for now
    }
};

let hintWatched = JSON.parse(localStorage.getItem('hintWatched') || '{}');

function isTaskCompleted(taskId) {
    const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
    return !!progress[taskId];
}

function shouldShowTask(taskId) {
    if (taskId === 'chat_mr_ray') return true;
    for (const [prevTaskId, taskData] of Object.entries(gameTasks)) {
        if (taskData.unlocks && taskData.unlocks.includes(taskId)) {
            if (isTaskCompleted(prevTaskId)) return true;
        }
    }
    return false;
}

function getAvailableTasks() {
    return Object.entries(gameTasks)
        .filter(([taskId]) => shouldShowTask(taskId))
        .map(([taskId, taskData]) => ({ id: taskId, ...taskData }));
}

function loadRealTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    const availableTasks = getAvailableTasks();

    taskList.innerHTML = availableTasks.length === 0 ? `
        <div class="empty-state">No tasks available. Complete previous objectives.</div>
    ` : '';

    availableTasks.forEach(task => {
        const completed = isTaskCompleted(task.id);
        const watchedHint = hintWatched[task.id];

        const taskElement = document.createElement('div');
        taskElement.className = `compact-task-item ${completed ? 'completed' : ''}`;
        taskElement.onclick = () => showTaskDetails(task);
        taskElement.innerHTML = `
            <div class="compact-task-status ${completed ? 'completed' : 'pending'}">
                ${completed ? '✓' : '!'}
            </div>
            <div class="compact-task-content">
                <div class="compact-task-title">${task.title}</div>
                <div class="compact-task-description">${task.description}</div>
            </div>
            ${!completed ? `
                <button class="compact-hint-button" onclick="handleHint('${task.id}', event)">
                    ${watchedHint ? 'Hint' : 'Get Hint'}
                </button>
            ` : ''}
        `;
        taskList.appendChild(taskElement);
    });

    showHintForWatchedTask();
    updateProgressCounter();
}

function updateProgressCounter() {
    const completed = Object.keys(gameTasks).filter(id => isTaskCompleted(id)).length;
    const total = Object.keys(gameTasks).length;

    const progressElement = document.querySelector('.app-title');
    if (progressElement && completed > 0) {
        progressElement.textContent = `Task Manager (${completed}/${total})`;
    }
}

function showTaskDetails(task) {
    const overlay = document.getElementById('taskDetailsOverlay');
    const title = document.getElementById('taskDetailsTitle');
    const description = document.getElementById('taskDetailsDescription');
    const hintSection = document.getElementById('taskDetailsHintSection');
    const hintText = document.getElementById('taskDetailsHint');

    if (overlay && title && description) {
        title.textContent = task.title;
        description.textContent = task.description;

        if (hintWatched[task.id] && !isTaskCompleted(task.id)) {
            hintText.textContent = task.hint;
            hintSection.style.display = 'block';
        } else {
            hintSection.style.display = 'none';
        }

        overlay.style.display = 'flex';
    }
}

function closeTaskDetails() {
    const overlay = document.getElementById('taskDetailsOverlay');
    if (overlay) overlay.style.display = 'none';
}

function handleHint(taskId, event) {
    event.stopPropagation();
    const task = gameTasks[taskId];
    if (!task) return;

    hintWatched[taskId] ? showDirectHint(task.hint) : showAd(taskId);
}

function showDirectHint(hint) {
    const hintBox = document.getElementById('hintBox');
    const hintContent = hintBox.querySelector('.hint-content');
    if (hintBox && hintContent) {
        hintContent.innerHTML = `<strong>Hint:</strong> ${hint}`;
        hintBox.style.display = 'block';
        setTimeout(() => hintBox.style.display = 'none', 8000);
    }
}

function showHintForWatchedTask() {
    const hintBox = document.getElementById('hintBox');
    const hintContent = hintBox.querySelector('.hint-content');
    const task = getAvailableTasks().find(t => hintWatched[t.id] && !isTaskCompleted(t.id));

    if (task && hintBox && hintContent) {
        hintContent.innerHTML = `<strong>Hint:</strong> ${task.hint}`;
        hintBox.style.display = 'block';
    } else if (hintBox) {
        hintBox.style.display = 'none';
    }
}

function markHintAsWatched(taskId) {
    hintWatched[taskId] = true;
    localStorage.setItem('hintWatched', JSON.stringify(hintWatched));
}

function showAd(taskId) {
    const elements = ['adOverlay', 'adImage', 'adTimer', 'seeHintBtn', 'adText']
        .map(id => document.getElementById(id));

    if (elements.some(el => !el)) return;

    const [overlay, image, timer, hintBtn, text] = elements;
    hintBtn.setAttribute('data-taskid', taskId);

    const randomAd = Math.random() < 0.5 ? 'ad1.jpg' : 'ad2.png';
    image.src = randomAd;

    if (randomAd === 'ad1.jpg') {
        text.textContent = 'Play BlitzRacer Now';
        image.onclick = () => window.open('https://blitzracer.github.io/Cargame/', '_blank');
    } else {
        text.textContent = 'ZeeAi Text To Speech App';
        image.onclick = () => window.open('https://projectsofkhan.github.io/zeeAi/', '_blank');
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
    const hintBtn = document.getElementById('seeHintBtn');
    const taskId = hintBtn.getAttribute('data-taskid');
    const task = gameTasks[taskId];

    if (task) {
        markHintAsWatched(taskId);
        showDirectHint(task.hint);
        loadRealTasks();
    }
    closeAd();
}

function closeAd() {
    const elements = ['adOverlay', 'adTimer', 'seeHintBtn', 'adText', 'adImage']
        .map(id => document.getElementById(id));

    const [overlay, timer, hintBtn, text, image] = elements;

    if (overlay) overlay.style.display = 'none';
    if (timer) {
        timer.style.display = 'block';
        timer.textContent = 'Ad ends in 3s';
    }
    if (hintBtn) hintBtn.style.display = 'none';
    if (text) text.style.display = 'none';
    if (image) image.onclick = null;
}

function initializeBackButton() {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            closeAppAndReturnHome();
        });
    }

    window.addEventListener('popstate', closeAppAndReturnHome);
    window.onkeydown = (e) => e.key === 'Escape' && closeAppAndReturnHome();
}

function closeAppAndReturnHome() {
    console.log('🔙 Closing Task Manager...');
    if (window.opener && !window.opener.closed) {
        try {
            window.opener.focus();
        } catch (error) {
            console.log('⚠️ Could not focus home tab');
        }
    }
    setTimeout(() => window.close(), 50);
}

function initializeAutoRedirect() {
    window.addEventListener('beforeunload', () => {
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.location.href = window.location.origin + '/Trail/';
            } catch (error) {
                try {
                    window.opener.focus();
                } catch (focusError) {
                    console.log('❌ Could not focus home tab');
                }
            }
        }
    });
}

function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }
}

function setupTaskUpdateListener() {
    console.log('👂 Setting up task update listener...');

    window.addEventListener('message', function(event) {
        console.log('📬 Message received:', event.data);

        if (event.data && event.data.type === 'TASK_COMPLETED') {
            const taskId = event.data.taskId;
            console.log('✅ Task completed via message:', taskId);

            const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
            progress[taskId] = true;
            localStorage.setItem('taskProgress', JSON.stringify(progress));

            // ✅ AUTOMATICALLY UNLOCK DAD'S CONTACT WHEN TASK 4 COMPLETES
            if (taskId === 'task4_call_dyere') {
                const extendedProgress = JSON.parse(localStorage.getItem('extendedProgress') || '{}');
                extendedProgress.unlock_dad = true;
                localStorage.setItem('extendedProgress', JSON.stringify(extendedProgress));
                console.log('🔓 Dad\'s contact unlocked automatically!');
            }

            // ✅ AUTOMATICALLY MARK TASK 7 COMPLETE WHEN DIARY IS UNLOCKED
            if (taskId === 'task7_complete_diary') {
                console.log('🔓 Task 7 (Diary) completed!');
            }

            loadRealTasks();
            showTaskNotification(taskId);
        }
    });

    window.addEventListener('storage', function(e) {
        console.log('💾 Storage change:', e.key);
        if (e.key === 'taskProgress' || e.key === 'taskProgressUpdate') {
            setTimeout(loadRealTasks, 100);
        }
    });

    window.addEventListener('taskProgressUpdated', function(e) {
        console.log('📢 Task progress event:', e.detail);
        loadRealTasks();
    });

    setInterval(loadRealTasks, 2000);
}

function showTaskNotification(taskId) {
    const taskNames = {
        'chat_mr_ray': 'Talk to Mr. Ray',
        'talk_sahil': 'Talk to Sahil',
        'investigate_dyere': 'Investigate Dyere',
        'task4_call_dyere': 'Call To Dyere',
        'task5_talk_dad': 'Talk to Eric\'s Dad',
        'task6_unlock_instashan': 'Unlock Instashan ID',
        'task7_complete_diary': 'Complete Diary Page 1' // ✅ ADDED
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 9999;
        animation: slideDown 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.2);
        text-align: center;
        min-width: 250px;
    `;

    // ✅ SHOW "DAD UNLOCKED" IN NOTIFICATION FOR TASK 4
    let contactUnlock = '';
    if (taskId === 'task4_call_dyere') {
        contactUnlock = `<div style="font-size: 11px; margin-top: 3px; opacity: 0.9;">🔓 Dad's contact unlocked!</div>`;
    }

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
            <span style="font-size: 1.2em;">✅</span>
            <div>
                <div style="font-size: 14px; font-weight: 600;">Task Completed!</div>
                <div style="font-size: 12px;">${taskNames[taskId] || 'Task'}</div>
                ${contactUnlock}
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

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

window.onload = function() {
    updateTime();
    setInterval(updateTime, 60000);
    initializeBackButton();
    initializeAutoRedirect();
    loadRealTasks();
    setupTaskUpdateListener();
    console.log('📋 Task Manager Ready with 7 tasks!');
};