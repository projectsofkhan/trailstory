// global/state.js

const DEFAULT_STATE = {
  musicOn: false,
  currentMusic: null,
  shutterActive: false,
  activeApp: 'home'
};

export const OSState = {
  state: { ...DEFAULT_STATE },

  load() {
    const saved = localStorage.getItem('TRAIL_OS_STATE');
    if (saved) this.state = { ...DEFAULT_STATE, ...JSON.parse(saved) };
  },

  save() {
    localStorage.setItem('TRAIL_OS_STATE', JSON.stringify(this.state));
  },

  set(key, value) {
    this.state[key] = value;
    this.save();
    window.dispatchEvent(new CustomEvent('os-state-change', {
      detail: { key, value }
    }));
  },

  get(key) {
    return this.state[key];
  }
};

OSState.load();