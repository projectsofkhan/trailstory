// taskprogress.js - Task 6 unlocks diary
const TaskProgress = {
    tasks: {
        'chat_mr_ray': {
            id: 'chat_mr_ray',
            title: 'Talk to Mr. Ray',
            description: 'Start a conversation with Mr.Ray and know about Eric, his friend, and him.',
            completed: false,
            unlocks: 'Sahil contact',
            type: 'chat'
        },
        'talk_sahil': {
            id: 'talk_sahil',
            title: 'Talk to Sahil',
            description: "Now Talk To Sahil Eric's close friend.",
            completed: false,
            unlocks: 'Dyere contact',
            type: 'chat'
        },
        'investigate_dyere': {
            id: 'investigate_dyere',
            title: 'Investigate Dyere',
            description: 'Question the car repair guy who was close to Eric',
            completed: false,
            unlocks: 'Important clue about Eric',
            type: 'chat'
        },
        'task4_call_dyere': {
            id: 'task4_call_dyere',
            title: 'Call To Dyere',
            description: 'Call Dyere from the phone app to get more information',
            completed: false,
            unlocks: 'Dad contact unlocked & location clue',
            type: 'call'
        },
        'task5_talk_dad': {
            id: 'task5_talk_dad',
            title: 'Talk to Eric\'s Dad',
            description: 'Interview Eric\'s father for family perspective and clues',
            completed: false,
            unlocks: 'Laptop clue and garage evidence',
            type: 'chat'
        },
        'task6_unlock_instashan': {  // ✅ TASK 6 UNLOCKS DIARY
            id: 'task6_unlock_instashan',
            title: 'Unlock Instashan ID',
            description: 'Complete your Instashan profile setup to unlock your unique Instashan ID',
            completed: false,
            unlocks: 'Diary access unlocked',
            type: 'navigation'
        }
    },

    init() {
        if (!localStorage.getItem('taskProgress')) {
            this.saveProgress();
        } else {
            this.loadProgress();
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'taskProgress') {
                this.loadProgress();
                this.notifyChanges();
            }
        });

        window.addEventListener('taskProgressUpdated', (e) => {
            console.log('📢 Task progress updated:', e.detail);
        });

        console.log('✅ Task Progress System Ready - Task 6 unlocks diary');
    },

    completeTask(taskId) {
        if (this.tasks[taskId]) {
            this.tasks[taskId].completed = true;
            this.saveProgress();
            this.notifyChanges();

            this.updateGameTasks(taskId);

            // ✅ UNLOCK DAD'S CONTACT WHEN TASK 4 COMPLETES
            if (taskId === 'task4_call_dyere') {
                this.unlockDadContact();
            }

            // ✅ UNLOCK DIARY PAGE 1 WHEN TASK 6 COMPLETES
            if (taskId === 'task6_unlock_instashan') {
                this.unlockDiaryPage1();
            }

            console.log(`✅ Task completed: ${taskId}`);

            this.playCompletionSound();
        }
    },

    unlockDadContact() {
        const extendedProgress = JSON.parse(localStorage.getItem('extendedProgress') || '{}');
        extendedProgress.unlock_dad = true;
        localStorage.setItem('extendedProgress', JSON.stringify(extendedProgress));
        console.log('🔓 Dad\'s contact unlocked!');
    },

    // ✅ UNLOCK DIARY WHEN TASK 6 COMPLETES
    unlockDiaryPage1() {
        localStorage.setItem('task6_completed', 'true');
        console.log('🔓 Diary Page 1 unlocked! Task 6 completed.');
        
        // Notify any open diary pages
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: 'DIARY_UNLOCKED',
                    page: 'page1'
                }, '*');
            } catch (e) {
                console.log('⚠️ Could not notify diary page');
            }
        }
    },

    updateGameTasks(taskId) {
        const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
        progress[taskId] = true;
        localStorage.setItem('taskProgress', JSON.stringify(progress));
        localStorage.setItem('taskProgressUpdate', Date.now());
    },

    isTaskCompleted(taskId) {
        return this.tasks[taskId]?.completed || false;
    },

    getAllTasks() {
        return this.tasks;
    },

    getCompletedCount() {
        return Object.values(this.tasks).filter(task => task.completed).length;
    },

    getTotalCount() {
        return Object.keys(this.tasks).length;
    },

    saveProgress() {
        const progress = {};
        Object.keys(this.tasks).forEach(taskId => {
            progress[taskId] = this.tasks[taskId].completed;
        });
        localStorage.setItem('taskProgress', JSON.stringify(progress));
        localStorage.setItem('lastTaskUpdate', Date.now());
    },

    loadProgress() {
        const progress = JSON.parse(localStorage.getItem('taskProgress') || '{}');
        Object.keys(this.tasks).forEach(taskId => {
            if (progress[taskId] !== undefined) {
                this.tasks[taskId].completed = progress[taskId];
            }
        });
        
        // Sync task6_completed status
        if (this.tasks['task6_unlock_instashan']?.completed) {
            localStorage.setItem('task6_completed', 'true');
        }
    },

    notifyChanges() {
        const event = new CustomEvent('taskProgressUpdated', {
            detail: { 
                tasks: this.tasks,
                completedCount: this.getCompletedCount()
            }
        });
        window.dispatchEvent(event);

        localStorage.setItem('taskProgressUpdate', Date.now());

        if (window.opener && !window.opener.closed) {
            try {
                window.opener.postMessage({
                    type: 'TASK_COMPLETED',
                    taskId: Object.keys(this.tasks).find(id => !this.tasks[id].completed) || ''
                }, '*');
            } catch (e) {
                console.log('⚠️ Could not notify Task Manager');
            }
        }
    },

    playCompletionSound() {
        const taskSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
        taskSound.volume = 0.3;
        taskSound.play().catch(e => {
            console.log('Task sound error:', e);
        });
    },

    resetAllProgress() {
        Object.keys(this.tasks).forEach(taskId => {
            this.tasks[taskId].completed = false;
        });
        this.saveProgress();
        this.notifyChanges();
        
        // Reset diary unlocks
        localStorage.removeItem('task6_completed');
        localStorage.removeItem('diary_page1_unlocked');
        
        console.log('🔄 All task progress and diary unlocks reset');
    }
};

// Initialize
TaskProgress.init();

// Make it global
window.TaskProgress = TaskProgress;

// Message listener
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'TASK_COMPLETED') {
        const { taskId } = event.data;
        if (taskId) {
            TaskProgress.completeTask(taskId);
        }
    }
});