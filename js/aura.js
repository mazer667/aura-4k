const GP_STORAGE_KEY = "aura4k_gamepad_config";
function loadGamepadConfig() {
  try {
    const saved = localStorage.getItem(GP_STORAGE_KEY);
    if (!saved) return false;
    const config = JSON.parse(saved);
    if (config.deadzone !== void 0) {
      AURA.gpDeadzone = config.deadzone;
    }
    if (config.mapping !== void 0) {
      AURA.gpMapping = config.mapping;
    }
    return true;
  } catch (e) {
    console.warn("[AURA] Gamepad config load error:", e?.message);
  }
  return false;
}
function saveGamepadConfig() {
  try {
    localStorage.setItem(
      GP_STORAGE_KEY,
      JSON.stringify({
        deadzone: AURA.gpDeadzone,
        mapping: AURA.gpMapping
      })
    );
  } catch (e) {
    console.warn("[AURA] Gamepad config save error:", e?.message);
  }
}
const AURA = {
  // Navigation
  navigate: void 0,
  navigateLetter: void 0,
  goToLetter: void 0,
  launchGame: void 0,
  exitWithFade: void 0,
  // Game
  toggleFavorite: void 0,
  isFavorite: void 0,
  getCurrentGame: void 0,
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
    y: 3
  },
  _saveGamepadConfig: saveGamepadConfig
};
window.addEventListener("DOMContentLoaded", () => {
  loadGamepadConfig();
});
function setNavigate(fn) {
  AURA.navigate = fn;
}
function setNavigateLetter(fn) {
  AURA.navigateLetter = fn;
}
function setGoToLetter(fn) {
  AURA.goToLetter = fn;
}
function setLaunchGame(fn) {
  AURA.launchGame = fn;
}
function setExitWithFade(fn) {
  AURA.exitWithFade = fn;
}
function setToggleFavorite(fn) {
  AURA.toggleFavorite = fn;
}
function setIsFavorite(fn) {
  AURA.isFavorite = fn;
}
function setGetCurrentGame(fn) {
  AURA.getCurrentGame = fn;
}
function setGpDeadzone(val) {
  AURA.gpDeadzone = val;
  AURA._saveGamepadConfig();
}
function setGpMapping(val) {
  AURA.gpMapping = val;
  AURA._saveGamepadConfig();
}
function setSfxVolume(val) {
  AURA.sfxVolume = val;
}
function setMusicVolume(val) {
  AURA.musicVolume = val;
}
function setOptionsOpen(val) {
  AURA.isOptionsOpen = val;
}
function setGameRunning(val) {
  AURA.isGameRunning = val;
}
function setIdle(val) {
  AURA.isIdle = val;
}
function isGamepadCustomized() {
  return localStorage.getItem(GP_STORAGE_KEY) !== null;
}
function resetGamepadConfig() {
  localStorage.removeItem(GP_STORAGE_KEY);
  AURA.gpDeadzone = 0.45;
  AURA.gpMapping = null;
}
export {
  AURA,
  isGamepadCustomized,
  resetGamepadConfig,
  setExitWithFade,
  setGameRunning,
  setGetCurrentGame,
  setGoToLetter,
  setGpDeadzone,
  setGpMapping,
  setIdle,
  setIsFavorite,
  setLaunchGame,
  setMusicVolume,
  setNavigate,
  setNavigateLetter,
  setOptionsOpen,
  setSfxVolume,
  setToggleFavorite
};
