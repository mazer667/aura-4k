// js/gameCache.js
// IndexedDB cache pour les jeux - évite de re-parser le XML à chaque fois

const DB_NAME = 'aura4k_cache';
const DB_VERSION = 2;
const STORE_NAME = 'games_cache';

let db: IDBDatabase | null = null;
let initPromise: Promise<void> | null = null;

async function _ensureDB(): Promise<IDBDatabase> {
  if (db) return db;
  
  if (initPromise) {
    await initPromise;
    return db!;
  }
  
  initPromise = new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      initPromise = null;
      reject(request.error);
    };
    
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'consoleKey' });
        store.createIndex('by_rom', 'rom', { unique: false });
      }
    };
  });
  
  return initPromise.then(() => db!);
}

export function initCache(): Promise<void> {
  return _ensureDB().then(() => undefined);
}

export async function getCachedGames(consoleKey: string) {
  const database = await _ensureDB();
  
  return new Promise<any>((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(consoleKey);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function setCachedGames(consoleKey: string, games: any[], xmlTimestamp: number) {
  const database = await _ensureDB();
  
  return new Promise<void>((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const data = {
      consoleKey,
      games,
      xmlTimestamp,
      cachedAt: Date.now()
    };
    
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearCache() {
  const database = await _ensureDB();
  
  return new Promise<void>((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getCacheInfo() {
  const database = await _ensureDB();
  
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const entries = request.result || [];
      resolve({
        entries: entries.length,
        totalGames: entries.reduce((sum, e) => sum + (e.games?.length || 0), 0),
        oldest: entries.length ? Math.min(...entries.map(e => e.cachedAt)) : null,
        newest: entries.length ? Math.max(...entries.map(e => e.cachedAt)) : null
      });
    };
    request.onerror = () => reject(request.error);
  });
}

export function getDB(): IDBDatabase | null {
  return db;
}
