const { contextBridge, ipcRenderer } = require('electron');

function safeInvoke(channel, ...args) {
  return ipcRenderer.invoke(channel, ...args).catch(err => {
    console.error(`[IPC] ${channel}:`, err.message);
    return null;
  });
}

function safeInvokeArray(channel, ...args) {
  return ipcRenderer.invoke(channel, ...args).catch(err => {
    console.error(`[IPC] ${channel}:`, err.message);
    return [];
  });
}

function safeInvokeEmpty(channel, ...args) {
  return ipcRenderer.invoke(channel, ...args).catch(err => {
    console.error(`[IPC] ${channel}:`, err.message);
  });
}

contextBridge.exposeInMainWorld('electronAPI', {
  // Game launching
  launchGame: (romPath, consoleName, extensions) => 
    safeInvoke('launch-game', romPath, consoleName, extensions),
  quitApp: () => safeInvokeEmpty('quit-app'),
  getConfig: () => safeInvoke('get-config'),
  getSelectedConsole: () => safeInvoke('get-selected-console'),
  
  // Console management
  selectConsole: (name) => safeInvokeEmpty('select-console', name),
  loadConsoleSelect: () => safeInvokeEmpty('load-console-select'),
  getAllConsoles: () => safeInvokeArray('get-all-consoles'),
  getConsoleConfig: (name) => safeInvoke('get-console-config', name),
  
  // Game events
  onGameStarted: (callback) => ipcRenderer.on('game-started', () => callback()),
  onGameEnded: (callback) => ipcRenderer.on('game-ended', () => callback()),
  
  // Data tab / XML
  selectFolder: () => safeInvoke('select-folder'),
  countRoms: (path) => safeInvoke('count-roms', path),
  listConsolesFolders: () => safeInvokeArray('list-consoles-folders'),
  createXml: (name, path) => safeInvoke('create-xml', name, path),
  getXmlTimestamp: (name) => safeInvoke('get-xml-timestamp', name),
  onScanProgress: (callback) => ipcRenderer.on('scan-progress', (e, data) => callback(data)),
});