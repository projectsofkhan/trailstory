/* ========= CONFIG ========= */
const STORY_VERSION = "1.0.0";
const STORY_VERSION_KEY = "STORY_APP_VERSION";
const STORY_UNLOCK_KEY = "STORY_UNLOCKED";

/* Must match task app */
const TASK_PROGRESS_KEY = "TASK_PROGRESS";

/* ========= STORY DATA ========= */
const stories = [
  "It started quietly. Nothing felt unusual at first.",
  "Patterns began to repeat. Small signs appeared.",
  "You noticed changes others ignored.",
  "The system reacted. Not everything was random.",
  "Now you understand. This was always meant to happen."
];

const storyText = document.getElementById("storyText");

/* ========= VERSION / CACHE HANDLING ========= */
(function handleVersion() {
  const oldVersion = localStorage.getItem(STORY_VERSION_KEY);
  if (oldVersion !== STORY_VERSION) {
    localStorage.removeItem(STORY_UNLOCK_KEY);
    localStorage.setItem(STORY_VERSION_KEY, STORY_VERSION);
  }
})();

/* ========= HELPERS ========= */
function getTaskCount() {
  const val = localStorage.getItem(TASK_PROGRESS_KEY);
  return val ? parseInt(val, 10) : 0;
}

function unlockStory() {
  localStorage.setItem(STORY_UNLOCK_KEY, "true");
}

function isUnlocked() {
  return localStorage.getItem(STORY_UNLOCK_KEY) === "true";
}

/* ========= RENDER ========= */
function renderStory() {
  const tasks = getTaskCount();

  if (tasks < 5) {
    storyText.textContent = "Complete some tasks to read the story.";
    return;
  }

  if (!isUnlocked()) {
    unlockStory();
  }

  const index = Math.min(tasks - 5, stories.length - 1);
  storyText.textContent = stories[index];
}

/* ========= REAL-TIME UPDATE ========= */
window.addEventListener("storage", (e) => {
  if (e.key === TASK_PROGRESS_KEY) {
    renderStory();
  }
});

/* ========= INIT ========= */
renderStory();