// js/aura.js
// Centralized namespace for AURA 4K

const GP_STORAGE_KEY = 'aura4k_gamepad_config';

function loadGamepadConfig() {
  try {
    const saved = localStorage.getItem(GP_STORAGE_KEY);
    if (saved) {
      const config = JSON.parse(saved);
      if (config.deadzone) AURA.gpDeadzone = config.deadzone;
      if (config.mapping) AURA.gpMapping = config.mapping;
      return true;
    }
  } catch (e) {
    console.warn('[AURA] Gamepad config load error:', e.message);
  }
  return false;
}

function saveGamepadConfig() {
  try {
    localStorage.setItem(GP_STORAGE_KEY, JSON.stringify({
      deadzone: AURA.gpDeadzone,
      mapping: AURA.gpMapping
    }));
  } catch (e) {
    console.warn('[AURA] Gamepad config save error:', e.message);
  }
}

loadGamepadConfig();

export const AURA = {
  // Navigation functions (set by menus)
  navigate: null,
  navigateLetter: null,
  goToLetter: null,
  launchGame: null,
  exitWithFade: null,
  
  // Game functions
  toggleFavorite: null,
  isFavorite: null,
  getCurrentGame: null,
  
  // Settings
  gpDeadzone: 0.45,
  gpMapping: null,
  sfxVolume: 0.6,
  musicVolume: 0.72,
  
  // State
  isOptionsOpen: false,
  isGameRunning: false,
  isIdle: false,
  
  // Gamepad buttons (defaults)
  buttons: {
    up: 12,
    down: 13,
    left: 14,
    right: 15,
    a: 0,
    b: 1,
    x: 2,
    y: 3,
  },
  
  // Gamepad persistence
  _saveGamepadConfig: saveGamepadConfig,
};

// Helper to set navigation function
export function setNavigate(fn) { AURA.navigate = fn; }
export function setNavigateLetter(fn) { AURA.navigateLetter = fn; }
export function setGoToLetter(fn) { AURA.goToLetter = fn; }
export function setLaunchGame(fn) { AURA.launchGame = fn; }
export function setExitWithFade(fn) { AURA.exitWithFade = fn; }

// Helper to set game functions
export function setToggleFavorite(fn) { AURA.toggleFavorite = fn; }
export function setIsFavorite(fn) { AURA.isFavorite = fn; }
export function setGetCurrentGame(fn) { AURA.getCurrentGame = fn; }

// Settings helpers
export function setGpDeadzone(val) { 
  AURA.gpDeadzone = val; 
  AURA._saveGamepadConfig();
}
export function setGpMapping(val) { 
  AURA.gpMapping = val; 
  AURA._saveGamepadConfig();
}
export function setSfxVolume(val) { AURA.sfxVolume = val; }
export function setMusicVolume(val) { AURA.musicVolume = val; }

// State helpers
export function setOptionsOpen(val) { AURA.isOptionsOpen = val; }
export function setGameRunning(val) { AURA.isGameRunning = val; }
export function setIdle(val) { AURA.isIdle = val; }

// Helper to check if gamepad is customized
export function isGamepadCustomized() {
  return localStorage.getItem(GP_STORAGE_KEY) !== null;
}

// Helper to reset gamepad to defaults
export function resetGamepadConfig() {
  localStorage.removeItem(GP_STORAGE_KEY);
  AURA.gpDeadzone = 0.45;
  AURA.gpMapping = null;
}