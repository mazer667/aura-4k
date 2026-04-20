// js/aura.js
// Centralized namespace for AURA 4K

const GP_STORAGE_KEY = 'aura4k_gamepad_config';

function loadGamepadConfig() {
  try {
    const saved = localStorage.getItem(GP_STORAGE_KEY);
    if (!saved) return false;

    const config = JSON.parse(saved);

    if (config.deadzone !== undefined) {
      AURA.gpDeadzone = config.deadzone;
    }

    if (config.mapping !== undefined) {
      AURA.gpMapping = config.mapping;
    }

    return true;
  } catch (e: any) {
    console.warn('[AURA] Gamepad config load error:', e?.message);
  }
  return false;
}

function saveGamepadConfig() {
  try {
    localStorage.setItem(
      GP_STORAGE_KEY,
      JSON.stringify({
        deadzone: AURA.gpDeadzone,
        mapping: AURA.gpMapping,
      })
    );
  } catch (e: any) {
    console.warn('[AURA] Gamepad config save error:', e?.message);
  }
}

// --- MAIN OBJECT ---
export const AURA: {
  navigate?: (dir: number) => void;
  navigateLetter?: (dir: number) => void;
  goToLetter?: (dir: number) => void;
  launchGame?: () => void;
  exitWithFade?: () => void;

  toggleFavorite?: (rom: string) => void;
  isFavorite?: (rom: string) => boolean;
  getCurrentGame?: () => any;

  gpDeadzone: number;
  gpMapping: any;
  sfxVolume: number;
  musicVolume: number;

  isOptionsOpen: boolean;
  isGameRunning: boolean;
  isIdle: boolean;

  buttons: Record<string, number>;
  _saveGamepadConfig: () => void;
} = {
  // Navigation
  navigate: undefined,
  navigateLetter: undefined,
  goToLetter: undefined,
  launchGame: undefined,
  exitWithFade: undefined,

  // Game
  toggleFavorite: undefined,
  isFavorite: undefined,
  getCurrentGame: undefined,

  // Settings
  gpDeadzone: 0.45,
  gpMapping: null,
  sfxVolume: 0.6,
  musicVolume: 0.72,

  // State
  isOptionsOpen: false,
  isGameRunning: false,
  isIdle: false,

  // Gamepad buttons
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

  _saveGamepadConfig: saveGamepadConfig,
};

// ✅ FIX CRITIQUE → après initialisation
window.addEventListener("DOMContentLoaded", () => {
  loadGamepadConfig();
});

// --- HELPERS ---

export function setNavigate(fn: (dir: number) => void) {
  AURA.navigate = fn;
}

export function setNavigateLetter(fn: (dir: number) => void) {
  AURA.navigateLetter = fn;
}

export function setGoToLetter(fn: (dir: number) => void) {
  AURA.goToLetter = fn;
}

export function setLaunchGame(fn: () => void) {
  AURA.launchGame = fn;
}

export function setExitWithFade(fn: () => void) {
  AURA.exitWithFade = fn;
}

// Game
export function setToggleFavorite(fn: (rom: string) => void) {
  AURA.toggleFavorite = fn;
}

export function setIsFavorite(fn: (rom: string) => boolean) {
  AURA.isFavorite = fn;
}

export function setGetCurrentGame(fn: () => any) {
  AURA.getCurrentGame = fn;
}

// Settings
export function setGpDeadzone(val: number) {
  AURA.gpDeadzone = val;
  AURA._saveGamepadConfig();
}

export function setGpMapping(val: any) {
  AURA.gpMapping = val;
  AURA._saveGamepadConfig();
}

export function setSfxVolume(val: number) {
  AURA.sfxVolume = val;
}

export function setMusicVolume(val: number) {
  AURA.musicVolume = val;
}

// State
export function setOptionsOpen(val: boolean) {
  AURA.isOptionsOpen = val;
}

export function setGameRunning(val: boolean) {
  AURA.isGameRunning = val;
}

export function setIdle(val: boolean) {
  AURA.isIdle = val;
}

// Utils
export function isGamepadCustomized(): boolean {
  return localStorage.getItem(GP_STORAGE_KEY) !== null;
}

export function resetGamepadConfig() {
  localStorage.removeItem(GP_STORAGE_KEY);
  AURA.gpDeadzone = 0.45;
  AURA.gpMapping = null;
}