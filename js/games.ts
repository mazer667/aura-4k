// js/games.ts
import { Game, ConsoleConfig, AppConfig } from './types.js';
import { G, setCi, getGames, getCurrentGame, beginBatch, endBatch } from './state.js';
import { preloadImage, preloadImages, isImageCached } from './imageCache.js';
import { initCache, getCachedGames, setCachedGames } from './gameCache.js';

let appConfig: AppConfig | null = null;
let consoleConfigs: ConsoleConfig[] = [];
let cacheInitialized = false;

export async function loadConfig() {
  try {
    appConfig = await window.electronAPI.getConfig();
    console.log('[Config] Chargee');
  } catch (err) {
    console.error('[Config] Erreur:', err);
  }
  
  try {
    consoleConfigs = await window.electronAPI.getAllConsoles();
    console.log('[Consoles] Configs chargees:', consoleConfigs.length);
  } catch (err) {
    console.error('[Consoles] Erreur:', err);
  }
}

export function getConsoleConfigByName(consoleName) {
  return consoleConfigs.find(c => c.name === consoleName) || null;
}

export function imgPath(game) {
  if (!game) return '';
  const consoleConfig = getConsoleConfigByName(game.console);
  if (!consoleConfig || !appConfig) return '';
  const folder = consoleConfig.imagesFolder || `consoles/${game.console}/images`;
  const base = `${appConfig.assetsBasePath || 'assets'}/${folder}/${game.rom}/${consoleConfig.imageCenterSubfolder || 'Image centre'}/${game.rom}`;
  return `${base}.webp`;
}

export function shotPath(game, n) {
  if (!game) return '';
  const consoleConfig = getConsoleConfigByName(game.console);
  if (!consoleConfig || !appConfig) return '';
  const folder = consoleConfig.imagesFolder || `consoles/${game.console}/images`;
  const base = `${appConfig.assetsBasePath || 'assets'}/${folder}/${game.rom}/${consoleConfig.screenshotsSubfolder || 'screenshots'}/${game.rom}-${n}`;
  return `${base}.webp`;
}

export function setShot(el, game, n) {
  if (!el) return;
  const url = shotPath(game, n);
  el.style.backgroundColor = '#111';
  if (!url) {
    el.style.backgroundImage = 'url("assets/no-image.svg")';
    return;
  }
  el.style.backgroundImage = `url('${url}')`;
}

export function preloadGameImages(game) {
  if (!game) return;
  const centerUrl = imgPath(game);
  const shotUrls  = [1, 2, 3].map(n => shotPath(game, n));
  preloadImages([centerUrl, ...shotUrls]);
}

export function isGameImageCached(game) {
  if (!game) return false;
  return isImageCached(imgPath(game));
}

export function getRomExtension(consoleName) {
  const consoleConfig = getConsoleConfigByName(consoleName);
  if (!consoleConfig?.romExtensions?.length) return '.zip';
  return consoleConfig.romExtensions[0];
}

export function getRomBasePath(game) {
  if (!appConfig) return '';
  const consoleConfig = getConsoleConfigByName(game.console);
  if (!consoleConfig) return '';
  const romsFolder = consoleConfig.imagesFolder?.replace('/images', '') || `consoles/${game.console}`;
  return `${appConfig.assetsBasePath}/${romsFolder}/roms/${game.rom}`;
}

export function getRomExtensions(game) {
  const consoleConfig = getConsoleConfigByName(game.console);
  if (!consoleConfig?.romExtensions?.length) return ['.zip'];
  return consoleConfig.romExtensions;
}

export function getRomPath(game) {
  if (!appConfig) {
    console.warn('[ROM] Config non chargee');
    return '';
  }
  const consoleConfig = getConsoleConfigByName(game.console);
  if (!consoleConfig) {
    console.error(`[ROM] Configuration introuvable: ${game.console}`);
    return '';
  }
  // Retourne le chemin de base sans extension
  // main.js doit essayer toutes les extensions via getRomExtensions
  const romsFolder = consoleConfig.imagesFolder?.replace('/images', '') || `consoles/${game.console}`;
  return `${appConfig.assetsBasePath}/${romsFolder}/roms/${game.rom}`;
}

export function getMusicId(game) {
  if (!game || !game.rom) return null;
  return game.rom;
}

export function getMusicUrl(game) {
  if (!game || !game.rom || !appConfig) return '';
  const consoleConfig = getConsoleConfigByName(game.console);
  if (!consoleConfig?.musicFolder) return '';
  return `${appConfig.assetsBasePath || 'assets'}/${consoleConfig.musicFolder}/${game.rom}.mp3`;
}

function parseXmlText(xmlText, consoleName) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) throw new Error('Erreur parsing XML');
  
  const gameNodes = xmlDoc.getElementsByTagName('game');
  const games = [];
  
  for (let i = 0; i < gameNodes.length; i++) {
    const gameNode = gameNodes[i];
    
    let rom = null;
    const romTag = gameNode.getElementsByTagName('rom')[0];
    if (romTag) rom = romTag.getAttribute('path');
    if (!rom) rom = gameNode.getAttribute('name');
    if (!rom) continue;
    
    if (consoleName.includes('NES') || consoleName.includes('Famicom')) {
      rom = rom.split('#')[0];
      rom = rom.replace(/\.(zip|nes)$/i, '');
    }
    
    const getTagContent = (tagName) => {
      const elem = gameNode.getElementsByTagName(tagName)[0];
      return elem ? elem.textContent.trim() : '';
    };
    
    const enabled = getTagContent('enabled').toLowerCase();
    if (enabled !== 'yes' && enabled !== 'oui' && enabled !== '1') continue;
    
    const description = getTagContent('description');
    if (!description) continue;
    
    const manufacturer = getTagContent('manufacturer') || '?';
    const year = getTagContent('year') || '????';
    const genre = getTagContent('genre') || 'Action';
    const playersRaw = getTagContent('players') || '1';
    
    let playersNum = null;
    let playersRange = null;
    
    if (playersRaw.includes('-')) {
      playersRange = playersRaw;
    } else {
      const n = parseInt(playersRaw, 10);
      playersNum = !isNaN(n) ? n : 1;
    }
    
    const title = description.toUpperCase();
    let short = title;
    if (short.length > 22) short = short.substring(0, 19) + '…';
    const letter = title[0] || '#';
    
    games.push({
      title,
      short,
      pub: manufacturer,
      year,
      genre,
      playersNum,
      playersRange,
      let: letter.toUpperCase(),
      console: consoleName,
      rom
    });
  }
  
  return games;
}

export async function loadGamesFromXML(consoleName = 'FBNeo - Arcade Games') {
  try {
    const consoleConfig = getConsoleConfigByName(consoleName);
    const xmlFile = `data/${consoleName}.xml`;
    
    const res = await fetch(xmlFile);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let xmlText = await res.text();
    
    xmlText = xmlText.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#x?[0-9a-fA-F]+;)/g, '&amp;');
    
    if (consoleName.includes('NES') || consoleName.includes('Famicom')) {
      xmlText = xmlText.replace(/name="([^"]*)\.zip#[^"]*"/g, 'name="$1"');
    }
    
    try {
      const worker = new Worker('js/xmlParser.worker.js');
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          worker.terminate();
          resolve(parseXmlText(xmlText, consoleName));
        }, 2000);
        
        worker.onmessage = (e) => {
          clearTimeout(timeout);
          worker.terminate();
          if (e.data.success) {
            resolve(e.data.games);
          } else {
            resolve(parseXmlText(xmlText, consoleName));
          }
        };
        
        worker.onerror = () => {
          clearTimeout(timeout);
          worker.terminate();
          resolve(parseXmlText(xmlText, consoleName));
        };
        
        worker.postMessage({ xmlContent: xmlText, consoleKey: consoleName });
      });
    } catch (err) {
      console.warn('[Games] Worker failed, fallback to main thread:', err.message);
      return parseXmlText(xmlText, consoleName);
    }
  } catch (error) {
    console.error('[Games] Erreur fatale:', error);
    return [];
  }
}

export async function loadGamesAndPopulate(consoleName = 'FBNeo - Arcade Games', forceReload = false) {
  // Emit loading start
  window.dispatchEvent(new CustomEvent('aura-loading-start', { detail: { console: consoleName } }));
  
  if (!cacheInitialized) {
    await initCache();
    cacheInitialized = true;
  }
  
  let xmlTimestamp = 0;
  
  if (!forceReload && window.electronAPI?.getXmlTimestamp) {
    xmlTimestamp = await window.electronAPI.getXmlTimestamp(consoleName);
  }
  
  const cached = await getCachedGames(consoleName);
  let games;
  
  const cacheIsFresh = cached?.xmlTimestamp && cached.xmlTimestamp >= xmlTimestamp && xmlTimestamp > 0;
  
  if (cached?.games?.length > 0 && cacheIsFresh && !forceReload) {
    games = cached.games;
    window.dispatchEvent(new CustomEvent('aura-loading-complete', { detail: { count: games.length, fromCache: true } }));
  } else {
    // Emit progress for XML loading
    window.dispatchEvent(new CustomEvent('aura-loading-progress', { detail: { phase: 'parsing', progress: 30 } }));
    
    games = await loadGamesFromXML(consoleName);
    
    window.dispatchEvent(new CustomEvent('aura-loading-progress', { detail: { phase: 'saving', progress: 80 } }));
    
    if (games.length > 0) {
      await setCachedGames(consoleName, games, xmlTimestamp || Date.now());
    }
    
    window.dispatchEvent(new CustomEvent('aura-loading-complete', { detail: { count: games.length, fromCache: false } }));
  }
  
  beginBatch();
  G.length = 0;
  if (games.length === 0) {
    G.push({
      title: 'AUCUN JEU ACTIF', short: 'DEMO', pub: 'VERIFIE XML',
      year: '----', genre: 'TEST', playersNum: 0, playersRange: null,
      let: '#', console: consoleName, rom: 'demo'
    });
  } else {
    G.push(...games);
  }
  setCi(0);
  endBatch();
  
  window.dispatchEvent(new CustomEvent('aura-games-loaded', { detail: { count: G.length } }));
}

export async function clearGamesCache() {
  if (!cacheInitialized) {
    await initCache();
    cacheInitialized = true;
  }
  const { clearCache } = await import('./gameCache.js');
  await clearCache();
}

export { getGames, getCurrentGame };
