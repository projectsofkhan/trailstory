// shutter/shutter.js
import { OSState } from '../global/state.js';

const shutter = document.createElement('div');
shutter.id = 'global-shutter';
document.body.appendChild(shutter);

export const Shutter = {
  open() {
    shutter.classList.add('active');
    OSState.set('shutterActive', true);
  },

  close() {
    shutter.classList.remove('active');
    OSState.set('shutterActive', false);
  },

  sync() {
    if (OSState.get('shutterActive')) {
      shutter.classList.add('active');
    }
  }
};

window.addEventListener('os-state-change', e => {
  if (e.detail.key === 'shutterActive') {
    e.detail.value ? Shutter.open() : Shutter.close();
  }
});

Shutter.sync();