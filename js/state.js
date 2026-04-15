// js/state.js - Encapsulated state with module pattern

// ─── PRIVATE STATE ────────────────────────────────────────────
let _G = [];
let _ci = 0;
let _idle = false;
let _bgActive = { bgL:'a', bgC:'a', bgR:'a' };
let _listeners = [];

// ─── STATE API ───────────────────────────────────────────────
export function setCi(value) { 
  _ci = value; 
  _notify();
}
export function setIdle(value) { 
  _idle = value; 
  _notify();
}
export function setBgActive(id, layer) { 
  _bgActive[id] = layer; 
  _notify();
}

// Getter functions
export function getIdle() { return _idle; }
export function getCurrentIndex() { return _ci; }
export function getGames() { return _G; }
export function getCurrentGame() { return _G[_ci] || null; }

// Subscribe to state changes
export function subscribe(fn) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(f => f !== fn); };
}

function _notify() {
  _listeners.forEach(fn => fn({ games: _G, ci: _ci, idle: _idle }));
}

// Direct mutation still needed for performance (populateGames uses G.push)
// But we expose via getter
export { _G as G };
export { _ci as ci };
export { _idle as idle };

// ─── FAVORITES ────────────────────────────────────────────────
const FAV_KEY = 'aura4k_favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  } catch { return []; }
}

export function toggleFavorite(rom) {
  const favs = getFavorites();
  const idx = favs.indexOf(rom);
  if (idx === -1) {
    favs.push(rom);
  } else {
    favs.splice(idx, 1);
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return idx === -1;
}

export function isFavorite(rom) {
  return getFavorites().includes(rom);
}

// ─── LAST PLAYED ──────────────────────────────────────────────
const LAST_KEY = 'aura4k_last_played';

export function getLastPlayed() {
  try {
    return JSON.parse(localStorage.getItem(LAST_KEY) || null);
  } catch { return null; }
}

export function setLastPlayed(consoleName, rom) {
  localStorage.setItem(LAST_KEY, JSON.stringify({ console: consoleName, rom, time: Date.now() }));
}