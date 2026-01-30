const STORY_KEY = "TRAIL_STORY_STEP";

const stories = [
  "Everything begins quietly. You don’t notice it yet.",
  "Small changes appear. Things feel… different.",
  "You start connecting dots. Something is moving.",
  "The system reacts. Not everyone sees it.",
  "Now it’s clear. This was never random."
];

const storyStepEl = document.getElementById("storyStep");
const storyTextEl = document.getElementById("storyText");
const card = document.getElementById("storyCard");
const btn = document.getElementById("nextTaskBtn");

function getStep() {
  return parseInt(localStorage.getItem(STORY_KEY) || "0");
}

function setStep(step) {
  localStorage.setItem(STORY_KEY, step);
}

function render() {
  const step = getStep();
  storyStepEl.textContent = `Story ${step + 1}`;
  storyTextEl.textContent = stories[step];

  card.style.animation = "none";
  card.offsetHeight;
  card.style.animation = "fadeUp 0.6s ease";
}

btn.addEventListener("click", () => {
  let step = getStep();
  step = (step + 1) % stories.length;
  setStep(step);
  render();
});

/* Real-time sync (multi-tab / future OS sync) */
window.addEventListener("storage", (e) => {
  if (e.key === STORY_KEY) render();
});

/* Init */
render();