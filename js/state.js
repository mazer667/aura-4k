const _G = [];
let _ci = 0;
let _idle = false;
const _bgActive = { bgL: "a", bgC: "a", bgR: "a" };
let _listeners = [];
function setCi(value) {
  _ci = value;
  _notify();
}
function setIdle(value) {
  _idle = value;
  _notify();
}
function setBgActive(id, layer) {
  _bgActive[id] = layer;
  _notify();
}
function getIdle() {
  return _idle;
}
function getCurrentIndex() {
  return _ci;
}
function getGames() {
  return _G;
}
function getCurrentGame() {
  return _G[_ci] || null;
}
function subscribe(fn) {
  _listeners.push(fn);
  return () => {
    _listeners = _listeners.filter((f) => f !== fn);
  };
}
function _notify() {
  _listeners.forEach((fn) => fn({ games: _G, ci: _ci, idle: _idle }));
}
const FAV_KEY = "aura4k_favorites";
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch (err) {
    console.warn("[STATE] Favorites parse error:", err instanceof Error ? err.message : String(err));
    return [];
  }
}
function toggleFavorite(rom) {
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
function isFavorite(rom) {
  return getFavorites().includes(rom);
}
const LAST_KEY = "aura4k_last_played";
function getLastPlayed() {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("[STATE] Last played parse error:", err instanceof Error ? err.message : String(err));
    return null;
  }
}
function setLastPlayed(consoleName, rom) {
  localStorage.setItem(LAST_KEY, JSON.stringify({ console: consoleName, rom, time: Date.now() }));
}
export {
  _G as G,
  _ci as ci,
  getCurrentGame,
  getCurrentIndex,
  getFavorites,
  getGames,
  getIdle,
  getLastPlayed,
  _idle as idle,
  isFavorite,
  setBgActive,
  setCi,
  setIdle,
  setLastPlayed,
  subscribe,
  toggleFavorite
};
