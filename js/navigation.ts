// js/navigation.js
import { setCi, getCurrentIndex, getGames, getCurrentGame, setLastPlayed, isFavorite } from './state.js';
import { getFilteredGames, setFilterLetter, setFilterFav, AL, updateUI } from './ui.js';
import { imgPath, preloadGameImages, getRomPath, getRomExtensions } from './games.js';
import { playSound } from './audio.js';
import { playMusicForGame } from './music.js';
import { preloadAdjacentGames, preloadBackgrounds } from './preloader.js';

let onGameChange = null;
let preloadScheduled = false;

export function setOnGameChange(callback) {
  onGameChange = callback;
}

function schedulePreload(idx, filtered) {
  if (preloadScheduled) return;
  preloadScheduled = true;
  requestIdleCallback?.(() => {
    preloadAdjacentGames(idx, filtered);
    preloadScheduled = false;
  }, { timeout: 1000 });
}

function updateGameDisplay(game, prevGame, nextGame, filtered, allGames) {
  const gameIdx = allGames.indexOf(game);
  setCi(gameIdx >= 0 ? gameIdx : 0);

  const bgCa = document.getElementById('bgCa');
  if (bgCa) bgCa.style.backgroundImage = `url('${imgPath(game)}')`;
  const bgLa = document.getElementById('bgLa');
  if (bgLa) bgLa.style.backgroundImage = `url('${imgPath(prevGame)}')`;
  const bgRa = document.getElementById('bgRa');
  if (bgRa) bgRa.style.backgroundImage = `url('${imgPath(nextGame)}')`;

  updateUI(game, prevGame, nextGame);
  preloadGameImages(game);
  playSound('highlight');
  playMusicForGame(game);
  if (onGameChange) onGameChange(game);
}

export function navigate(dir) {
  const filtered = getFilteredGames();
  if (filtered.length === 0) return;
  
  const allGames = getGames();
  const currentIdx = getCurrentIndex();
  const currentGame = allGames[currentIdx];
  const currentFilteredIdx = filtered.indexOf(currentGame);
  
  // Simple infinite scroll - wrap around filtered list
  let nextFilteredIdx = currentFilteredIdx + dir;
  if (nextFilteredIdx < 0) nextFilteredIdx = filtered.length - 1;
  if (nextFilteredIdx >= filtered.length) nextFilteredIdx = 0;
  
  const game = filtered[nextFilteredIdx];
  if (!game) return;
  
  const prevGame = filtered[(nextFilteredIdx - 1 + filtered.length) % filtered.length];
  const nextGame = filtered[(nextFilteredIdx + 1) % filtered.length];

  const gameIdx = allGames.indexOf(game);
  setCi(gameIdx);
  updateGameDisplay(game, prevGame, nextGame, filtered, allGames);
  schedulePreload(nextFilteredIdx, filtered);
}

export function navigateToLetter(dir) {
  const allGames = getGames();
  if (allGames.length === 0) return;
  
  const currentIdx = getCurrentIndex();
  const currentGame = allGames[currentIdx];
  const currentLetter = currentGame?.title?.charAt(0).toUpperCase() || 'A';
  const currentLetterIdx = AL.indexOf(/[0-9]/.test(currentLetter) ? '#' : currentLetter);
  
  // Search for next letter with games
  let foundLetter = null;
  for (let i = 1; i < AL.length; i++) {
    const checkIdx = (currentLetterIdx + dir * i + AL.length) % AL.length;
    const checkLetter = AL[checkIdx];
    
    const hasGames = allGames.some(g => {
      const l = g.title?.charAt(0).toUpperCase() || '#';
      return /[0-9]/.test(l) ? '#' : l === checkLetter;
    });
    
    if (hasGames) {
      foundLetter = checkLetter;
      break;
    }
  }
  
  if (foundLetter) {
    setFilterLetter(foundLetter);
    const filtered = getFilteredGames();
    if (filtered.length > 0) {
      const game = filtered[0];
      const newIdx = allGames.indexOf(game);
      setCi(newIdx);
      const prevGame = filtered[filtered.length - 1] || game;
      const nextGame = filtered[1] || game;
      updateGameDisplay(game, prevGame, nextGame, filtered, allGames);
    }
  }
}

function showToast(message, type = 'info') {
  const colors = {
    info:    { bg: 'rgba(20,30,50,0.92)', border: 'rgba(94,184,255,0.5)', icon: 'ℹ️' },
    success: { bg: 'rgba(20,50,30,0.92)', border: 'rgba(74,222,128,0.5)', icon: '✓' },
    error:   { bg: 'rgba(50,20,20,0.92)', border: 'rgba(248,113,113,0.5)', icon: '✕' },
    warning: { bg: 'rgba(50,40,20,0.92)', border: 'rgba(251,191,36,0.5)', icon: '⚠' },
  };
  const style = colors[type] || colors.info;
  
  let toast = document.getElementById('aura-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'aura-toast';
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '180px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: style.bg,
      color: 'white',
      padding: '14px 28px',
      borderRadius: '10px',
      fontFamily: 'Barlow, sans-serif',
      fontSize: '16px',
      fontWeight: '600',
      border: `1px solid ${style.border}`,
      zIndex: '1000',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    });
    document.body.appendChild(toast);
  }
  
  toast.style.backgroundColor = style.bg;
  toast.style.borderColor = style.border;
  toast.innerHTML = `<span>${style.icon}</span><span>${message}</span>`;
  toast.style.opacity = '1';
  
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

export function navigateToGame(index) {
  const filtered = getFilteredGames();
  if (index < 0 || index >= filtered.length) return;
  
  const game = filtered[index];
  const allGames = getGames();
  const prevGame = filtered[(index - 1 + filtered.length) % filtered.length] || game;
  const nextGame = filtered[(index + 1) % filtered.length] || game;
  
  updateGameDisplay(game, prevGame, nextGame, filtered, allGames);
}

export function launchCurrentGame() {
  try {
    const game = getCurrentGame();
    if (!game) {
      showToast('Aucun jeu sélectionné', 'warning');
      return;
    }

    const romBasePath = getRomPath(game);
    if (!romBasePath) {
      showToast('Chemin ROM introuvable', 'error');
      return;
    }

    const extensions = getRomExtensions(game);

    playSound('select');
    setLastPlayed(game.console, game.rom);

    window.electronAPI.launchGame(romBasePath, game.console, extensions);
  } catch (err) {
    console.error('[Launch] Erreur:', err);
    showToast('Erreur au lancement', 'error');
  }
}