const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const fs   = require('fs');

let win;
let isGameRunning   = false;
let selectedConsole = null;
let CONFIG = null;
let CONSOLES = null;

// ─────────────────────────────────────────────────────────────
//  FILE LOGGING
// ─────────────────────────────────────────────────────────────
const _console = { log: console.log, error: console.error, warn: console.warn };
let LOG_FILE = null;

function log(type, msg) {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] [${type}] ${msg}`;
  try {
    if (LOG_FILE) fs.appendFileSync(LOG_FILE, logMsg + '\n');
  } catch {}
  if (type === 'ERROR') _console.error(logMsg);
  else _console.log(logMsg);
}

// Initialize after app ready
app.whenReady().then(() => {
  LOG_FILE = path.join(app.getPath('userData'), 'aura4k.log');
  log('INFO', '=== AURA 4K started ===');
});

// ─────────────────────────────────────────────────────────────
//  CONFIG - Chargé depuis config.json et consoles.json
// ─────────────────────────────────────────────────────────────
function loadConfig() {
  try {
    const configPath = path.join(__dirname, 'config.json');
    const raw = fs.readFileSync(configPath, 'utf8');
    CONFIG = JSON.parse(raw);
    console.log('[Config] Chargee depuis config.json');
  } catch (e) {
    console.error('[Config] Erreur chargement config.json:', e.message);
    CONFIG = { consoles: {}, retroarch: {} };
  }
}

function loadConsolesConfig() {
  try {
    const consolesPath = path.join(__dirname, 'consoles.json');
    const raw = fs.readFileSync(consolesPath, 'utf8');
    CONSOLES = JSON.parse(raw);
    console.log('[Consoles] Chargees depuis consoles.json:', Object.keys(CONSOLES).length, 'consoles');
  } catch (e) {
    console.error('[Consoles] Erreur chargement consoles.json:', e.message);
    CONSOLES = {};
  }
}

// ─────────────────────────────────────────────────────────────
//  Compte les jeux activés dans un fichier XML (côté Node)
// ─────────────────────────────────────────────────────────────
function countEnabledGames(xmlFilePath) {
  try {
    if (!fs.existsSync(xmlFilePath)) return 0;
    const content = fs.readFileSync(xmlFilePath, 'utf8');
    const matches = content.match(/<enabled>\s*(yes|oui|1)\s*<\/enabled>/gi);
    return matches ? matches.length : 0;
  } catch (e) {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────
//  Récupère la config console par nom de dossier
// ─────────────────────────────────────────────────────────────
function getConsoleConfig(consoleName) {
  if (!CONSOLES || !CONSOLES[consoleName]) return null;
  return CONSOLES[consoleName];
}

// ─────────────────────────────────────────────────────────────
//  Vérifie si le XML existe et compte les jeux
// ─────────────────────────────────────────────────────────────
function getConsoleXmlInfo(consoleName) {
  const dataDir = path.join(__dirname, 'data');
  const xmlPath = path.join(dataDir, `${consoleName}.xml`);
  const hasXml = fs.existsSync(xmlPath);
  const gameCount = hasXml ? countEnabledGames(xmlPath) : 0;
  return { hasXml, gameCount, xmlPath };
}

// ─────────────────────────────────────────────────────────────
//  Fenêtre
// ─────────────────────────────────────────────────────────────
function createWindow() {
  win = new BrowserWindow({
    fullscreen: true,
    kiosk:      true,
    frame:      false,
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration:  false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('console-select.html');

  globalShortcut.register('CommandOrControl+Q', () => { app.quit(); });
  globalShortcut.register('F12', () => { win.webContents.toggleDevTools(); });
}

// ─────────────────────────────────────────────────────────────
//  IPC - Consoles
// ─────────────────────────────────────────────────────────────
ipcMain.handle('get-all-consoles', () => {
  if (!CONSOLES) return [];
  
  const result = [];
  for (const [name, config] of Object.entries(CONSOLES)) {
    const xmlInfo = getConsoleXmlInfo(name);
    result.push({
      name,
      ...config,
      hasXml: xmlInfo.hasXml,
      gameCount: xmlInfo.gameCount
    });
  }
  
  // Trier par année
  result.sort((a, b) => (a.year || 1990) - (b.year || 1990));
  
  return result;
});

ipcMain.handle('get-console-config', (event, consoleName) => {
  return getConsoleConfig(consoleName);
});

ipcMain.handle('get-xml-timestamp', (event, consoleName) => {
  try {
    const dataDir = path.join(__dirname, 'data');
    const xmlPath = path.join(dataDir, `${consoleName}.xml`);
    if (!fs.existsSync(xmlPath)) return 0;
    const stats = fs.statSync(xmlPath);
    return stats.mtimeMs;
  } catch {
    return 0;
  }
});

ipcMain.handle('get-config', () => CONFIG);

ipcMain.handle('get-selected-console', () => selectedConsole);

ipcMain.handle('quit-app', () => { app.quit(); });

ipcMain.handle('load-console-select', () => {
  selectedConsole = null;
  win.loadFile('console-select.html');
});

ipcMain.handle('select-console', (event, consoleName) => {
  const config = getConsoleConfig(consoleName);
  if (!config) {
    console.error('[Console] Config introuvable:', consoleName);
    return;
  }
  selectedConsole = consoleName;
  win.loadFile('index.html');
});

ipcMain.handle('launch-game', async (event, romPath, consoleName, extensions) => {
  if (isGameRunning) return;
  
  try {
    const consoleConfig = consoleName ? getConsoleConfig(consoleName) : getConsoleConfig(selectedConsole);
    if (!consoleConfig) {
      console.error('[Launch] Config console introuvable:', consoleName || selectedConsole);
      return;
    }

    const retroarchPath = path.join(__dirname, CONFIG?.retroarch?.executable || 'retroarch/retroarch.exe');
    const corePath = path.join(__dirname, consoleConfig?.cores?.default || CONFIG?.retroarch?.defaultCore || '');
    
    const romExtensions = extensions || consoleConfig.romExtensions || ['.zip'];
    let fullRomPath = null;
    
    for (const ext of romExtensions) {
      const testPath = path.join(__dirname, romPath + ext);
      if (fs.existsSync(testPath)) {
        fullRomPath = testPath;
        break;
      }
    }
    
    if (!fullRomPath) {
      console.error('ROM introuvable:', romPath, '(tried:', romExtensions.join(', '), ')');
      return;
    }

    console.log('[Launch] Launching:', { romPath: fullRomPath, consoleName });

    if (!fs.existsSync(retroarchPath)) { 
      console.error('RetroArch introuvable:', retroarchPath);
      win.webContents.send('game-ended');
      isGameRunning = false;
      return; 
    }
    if (!corePath || !fs.existsSync(corePath)) { 
      console.error('Core introuvable:', corePath);
      win.webContents.send('game-ended');
      isGameRunning = false;
      return; 
    }

    const command = `"${retroarchPath}" -L "${corePath}" "${fullRomPath}" --fullscreen`;
    console.log('[Launch] Executing command:', command);
    isGameRunning = true;
    win.webContents.send('game-started');
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Erreur d\'exécution:', error);
        console.error('Stderr:', stderr);
      } else {
        console.log('[Launch] Command executed successfully');
        if (stdout) console.log('Stdout:', stdout);
      }
      isGameRunning = false;
      win.webContents.send('game-ended');
      win.restore();
      win.focus();
    });
  } catch (err) {
    console.error('[Launch] Exception:', err);
    isGameRunning = false;
  }
});

// ─────────────────────────────────────────────────────────────
//  IPC — Data Tab
// ─────────────────────────────────────────────────────────────
function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

ipcMain.handle('select-folder', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
    title: 'Sélectionner le dossier ROMs'
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }
  return { canceled: false, path: result.filePaths[0] };
});

ipcMain.handle('count-roms', (event, folderPath) => {
  try {
    if (!fs.existsSync(folderPath)) return { count: 0, error: 'Dossier introuvable' };
    
    const items = fs.readdirSync(folderPath, { withFileTypes: true });
    const subdirs = items.filter(i => i.isDirectory());
    
    const romExtensions = ['.zip', '.sfc', '.smc', '.nes', '.fds', '.gb', '.gbc', '.gba', '.n64', '.z64', '.v64', '.md', '.gen', '.bin', '.iso', '.cue', '.pbp', '.chd', '.a26', '.a78', '.lnx', '.ngp', '.ngc', '.ws', '.wsc', '.scd', '.sgx', '.pce', '.ss', '.sat', '.32x', '.gg', '.sms', '.psp', '.pbp', '.mpk'];
    
    const files = items.filter(i => i.isFile() && romExtensions.some(ext => i.name.toLowerCase().endsWith(ext)));
    
    const total = subdirs.length + files.length;
    
    return { count: total };
  } catch (e) {
    return { count: 0, error: e.message };
  }
});

ipcMain.handle('list-consoles-folders', () => {
  try {
    const consolesPath = path.join(__dirname, 'assets', 'consoles');
    if (!fs.existsSync(consolesPath)) return [];
    return fs.readdirSync(consolesPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();
  } catch (e) {
    return [];
  }
});

// ─────────────────────────────────────────────────────────────
//  ScreenScraper Integration
// ─────────────────────────────────────────────────────────────
const SS_SYSTEM_IDS = {
  'nes': 3,
  'Nintendo - NES - Famicom': 3,
  'Nintendo - Nintendo Entertainment System': 3,
  'snes': 4,
  'Nintendo - SNES - SFC': 4,
  'Nintendo - Super Nintendo Entertainment System': 4,
  'megadrive': 1,
  'Sega - Mega Drive - Genesis': 1,
  'gba': 12,
  'Nintendo - Game Boy Advance': 12,
  'gbc': 10,
  'Nintendo - Game Boy Color': 10,
  'gb': 9,
  'Nintendo - Game Boy': 9,
  'n64': 14,
  'Nintendo - Nintendo 64': 14,
  'sms': 2,
  'Sega - Master System': 2,
  'Sega - Master System - Mark III': 2,
  'MasterSystem': 2,
  'gg': 32,
  'Sega - Game Gear': 32,
  'pce': 31,
  'NEC - PC Engine - TurboGrafx-16': 31,
  'psx': 57,
  'Sony - PlayStation': 57,
  'saturn': 16,
  'Sega - Saturn': 16,
  'ngp': 18,
  'SNK - Neo Geo Pocket Color': 18,
  'ws': 19,
  'Bandai - WonderSwan Color': 19,
  'lynx': 25,
  'Atari - Lynx': 25,
  'a78': 41,
  'Atari - 7800': 41,
  'a2600': 26,
  'Atari - Atari 2600': 26,
  'coleco': 35,
  'Coleco - ColecoVision': 35,
  'intv': 44,
  'Intellivision': 44,
  'fbneo': 75,
  'FBNeo - Arcade Games': 75,
  'mame': 73,
  'Doom': 73,
  'Doom 3': 73,
  'Doom 3 - Resurrection of Evil': 73,
  'CaveStory': 78,
  'Flashback': 90,
  'Quake': 73,
  'Quake 2': 73,
  'Quake 3': 73,
  'Wolfenstein 3D': 73,
  'ScummVM': 37,
  'OutRun': 1,
  'Tomb Raider': 57,
};

function ssGetJson(url) {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const req = https.get(url, { headers: { 'User-Agent': 'AURA4K/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          console.log('[ScreenScraper] Invalid JSON response:', data.substring(0, 200));
          reject(new Error('JSON parse error'));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function cleanGameName(name) {
  // Remove regions and extra info
  let cleaned = name
    .replace(/\s*\([^)]*\)\s*/g, ' ')  // (USA), (Europe), etc.
    .replace(/\s*\[.*?\]\s*/g, ' ')   // [b1], [!]
    .replace(/\s*\{.*?\}\s*/g, ' ')   // {prototype}
    .replace(/\s+/g, ' ')
    .trim();
  
  // For Atari 7800, also try shorter version
  if (cleaned.length > 20) {
    cleaned = cleaned.split(' ').slice(0, 4).join(' ');
  }
  
  return cleaned;
}

async function fetchFromScreenScraper(gameName, systemId) {
  const cleanName = cleanGameName(gameName);
  try {
    const user = 'bactino';
    const pass = 'sexions';
    const url = `https://www.screenscraper.fr/api2/jeuInfos.php?devid=bactino&devpassword=grvhoQrDvvB&softname=aura4k&output=json&ssid=${user}&sspassword=${pass}&systemeid=${systemId}&romnom=${encodeURIComponent(cleanName)}`;
    
    let data;
    try {
      data = await ssGetJson(url);
    } catch (e) {
      console.log('[ScreenScraper] Network error for', cleanName, '-', e.message);
      return { description: cleanName, manufacturer: '', year: '', genre: '', players: '1', rating: '' };
    }
    
    if (!data.response || !data.response.jeu) {
      return { description: cleanName, manufacturer: '', year: '', genre: '', players: '1', rating: '' };
    }
    
    const jeu = data.response.jeu;
    
    const dates = jeu.dates || [];
    const dateObj = dates.find(d => d.region === 'wor') || dates[0] || {};
    
    const genres = jeu.genres || [];
    const genreText = genres[0]?.noms?.find(n => n.langue === 'fr')?.text 
                   || genres[0]?.noms?.[0]?.text 
                   || '';
    
    const noms = jeu.noms || [];
    const nomObj = noms.find(n => n.region === 'fr') 
                || noms.find(n => n.region === 'wor') 
                || noms[0] 
                || {};
    
    const rawNote = jeu.note || '';
    let rating = '';
    if (rawNote !== '' && rawNote !== null) {
      const n = parseFloat(String(rawNote).replace(',', '.'));
      if (!isNaN(n)) rating = n.toFixed(1);
    }
    
    return {
      description: nomObj.text || cleanName,
      manufacturer: jeu.editeur?.text || jeu.developpeur?.text || '',
      year: (dateObj.text || '').substring(0, 4),
      genre: genreText,
      players: jeu.joueurs?.text || '1',
      rating: rating
    };
  } catch (e) {
    console.log('[ScreenScraper] Error for', cleanName, e.message);
    return { description: cleanName, manufacturer: '', year: '', genre: '', players: '1', rating: '' };
  }
}

ipcMain.handle('create-xml', async (event, consoleName, romsFolder) => {
  try {
    console.log('[Data] Creating XML for:', consoleName);
    console.log('[Data] Source folder:', romsFolder);
    
    if (!fs.existsSync(romsFolder)) {
      return { success: false, error: 'Dossier ROMs introuvable' };
    }
    
    const items = fs.readdirSync(romsFolder, { withFileTypes: true });
    
    const romExtensions = ['.zip', '.sfc', '.smc', '.nes', '.fds', '.gb', '.gbc', '.gba', '.n64', '.z64', '.v64', '.md', '.gen', '.bin', '.iso', '.cue', '.pbp', '.chd', '.a26', '.a78', '.lnx', '.ngp', '.ngc', '.ws', '.wsc', '.scd', '.sgx', '.pce', '.ss', '.sat', '.32x', '.gg', '.sms', '.psp', '.pbp', '.mpk'];
    
    const subdirs = items.filter(i => i.isDirectory()).map(i => i.name);
    const files = items.filter(i => i.isFile() && romExtensions.some(ext => i.name.toLowerCase().endsWith(ext))).map(i => i.name.replace(/\.[^.]+$/, ''));
    
    const allGames = [...subdirs, ...files].sort();
    
    console.log('[Data] Found', allGames.length, 'jeux');
    
    // Utiliser le systemId de consoles.json
    const consoleConfig = getConsoleConfig(consoleName);
    const systemId = consoleConfig?.systemId || SS_SYSTEM_IDS[consoleName] || 4;
    
    let xml = '<?xml version="1.0" encoding="utf-8"?>\n<menu>\n';
    for (let i = 0; i < allGames.length; i++) {
      const gameName = allGames[i];
      const progress = Math.round(((i + 1) / allGames.length) * 100);
      
      event.sender.send('scan-progress', {
        current: i + 1,
        total: allGames.length,
        gameName: gameName,
        progress: progress
      });
      
      const ssData = await fetchFromScreenScraper(gameName, systemId);
      const description = ssData?.description || gameName;
      
      xml += `  <game name="${escapeXml(gameName)}">\n`;
      xml += `    <description>${escapeXml(description)}</description>\n`;
      xml += `    <manufacturer>${escapeXml(ssData.manufacturer)}</manufacturer>\n`;
      xml += `    <year>${escapeXml(ssData.year)}</year>\n`;
      xml += `    <genre>${escapeXml(ssData.genre)}</genre>\n`;
      xml += `    <players>${escapeXml(ssData.players)}</players>\n`;
      xml += `    <rating>${escapeXml(ssData.rating)}</rating>\n`;
      xml += `    <enabled>Yes</enabled>\n`;
      xml += `  </game>\n`;
      
      await new Promise(r => setTimeout(r, 20));
    }
    xml += '</menu>\n';
    
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    const xmlPath = path.join(dataDir, `${consoleName}.xml`);
    fs.writeFileSync(xmlPath, xml, 'utf8');
    
    console.log('[Data] XML created:', xmlPath);
    
    return { success: true, count: allGames.length, xmlPath };
  } catch (e) {
    console.error('[Data] Error:', e);
    return { success: false, error: e.message };
  }
});

// ─────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  loadConfig();
  loadConsolesConfig();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') app.quit();
});
