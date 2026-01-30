// global/audio.js
import { OSState } from './state.js';

const clickSound = new Audio('/sounds/click.mp3');
clickSound.volume = 0.3;

const bgMusic1 = document.getElementById('bgMusic1');
const bgMusic2 = document.getElementById('bgMusic2');

[bgMusic1, bgMusic2].forEach(m => {
  if (m) {
    m.volume = 0.3;
    m.loop = true;
  }
});

export const AudioSystem = {
  click() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  },

  playMusic(type) {
    this.stopMusic();
    const music = type === 'music2' ? bgMusic2 : bgMusic1;
    if (!music) return;

    music.play().catch(() => {});
    OSState.set('musicOn', true);
    OSState.set('currentMusic', type);
  },

  stopMusic() {
    if (bgMusic1) bgMusic1.pause();
    if (bgMusic2) bgMusic2.pause();
    OSState.set('musicOn', false);
  },

  restore() {
    if (OSState.get('musicOn')) {
      this.playMusic(OSState.get('currentMusic'));
    }
  }
};