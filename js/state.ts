// js/state.ts - Encapsulated state with module pattern

export interface Game {
  title: string;
  rom: string;
  short?: string;
  console?: string;
  genre?: string;
  year?: string;
  pub?: string;
  let?: string;
  playersNum?: number | null;
  playersRange?: string | null;
  isClone?: boolean;
  driver?: string;
  resolution?: string;
}

export interface StateChange {
  games: Game[];
  ci: number;
  idle: boolean;
}

// ─── PRIVATE STATE ────────────────────────────────────────────
const _G: Game[] = [];
let _ci = 0;
let _idle = false;
const _bgActive: Record<string, string> = { bgL: 'a', bgC: 'a', bgR: 'a' };
let _listeners: Array<(change: StateChange) => void> = [];

// ─── STATE API ───────────────────────────────────────────────
export function setCi(value: number): void { 
  _ci = value; 
  _notifyBatched();
}
export function setIdle(value: boolean): void { 
  _idle = value; 
  _notifyBatched();
}
export function setBgActive(id: string, layer: string): void { 
  _bgActive[id] = layer; 
  _notifyBatched();
}

// Getter functions
export function getIdle(): boolean { return _idle; }
export function getCurrentIndex(): number { return _ci; }
export function getGames(): Game[] { return _G; }
export function getCurrentGame(): Game | null { return _G[_ci] || null; }

// Subscribe to state changes
export function subscribe(fn: (change: StateChange) => void): () => void {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(f => f !== fn); };
}

function _notify(): void {
  _listeners.forEach(fn => fn({ games: _G, ci: _ci, idle: _idle }));
}

let _batchMode = false;
let _batchPending = false;

export function beginBatch() {
  _batchMode = true;
  _batchPending = false;
}

export function endBatch() {
  _batchMode = false;
  if (_batchPending) {
    _batchPending = false;
    _notify();
  }
}

function _notifyBatched() {
  if (_batchMode) {
    _batchPending = true;
  } else {
    _notify();
  }
}

// Direct mutation still needed for performance (populateGames uses G.push)
// But we expose via getter
export { _G as G };
export { _ci as ci };
export { _idle as idle };

// ─── FAVORITES ────────────────────────────────────────────────
const FAV_KEY = 'aura4k_favorites';
let _favoritesCache: string[] | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === FAV_KEY) {
      _favoritesCache = null;
    }
  });
}

function _refreshFavoritesCache() {
  try {
    _favoritesCache = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  } catch (err: unknown) {
    console.warn('[STATE] Favorites parse error:', err instanceof Error ? err.message : String(err));
    _favoritesCache = [];
  }
}

export function _resetFavoritesCache() {
  _favoritesCache = null;
}

export function getFavorites(): string[] {
  if (_favoritesCache === null) {
    _refreshFavoritesCache();
  }
  return _favoritesCache || [];
}

export function toggleFavorite(rom: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(rom);
  if (idx === -1) {
    favs.push(rom);
  } else {
    favs.splice(idx, 1);
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  _favoritesCache = [...favs];
  return idx === -1;
}

export function isFavorite(rom: string): boolean {
  const favs = getFavorites();
  return favs.includes(rom);
}

// ─── LAST PLAYED ──────────────────────────────────────────────
const LAST_KEY = 'aura4k_last_played';

export function getLastPlayed(): { console: string; rom: string; time: number } | null {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err: unknown) {
    console.warn('[STATE] Last played parse error:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

export function setLastPlayed(consoleName: string, rom: string): void {
  localStorage.setItem(LAST_KEY, JSON.stringify({ console: consoleName, rom, time: Date.now() }));
}