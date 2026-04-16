// js/navigation.js
import { setCi, getCurrentIndex, getGames, getCurrentGame, setLastPlayed, isFavorite } from './state.js';
import { getFilteredGames, setFilterLetter, setFilterFav, ix, updateUI } from './ui.js';
import { imgPath, preloadGameImages, getRomPath, getRomExtensions } from './games.js';
import { playSound } from './audio.js';
import { playMusicForGame } from './music.js';
import { preloadAdjacentGames, preloadBackgrounds } from './preloader.js';

let onGameChange = null;

export function setOnGameChange(callback) {
  onGameChange = callback;
}

function updateGameDisplay(game, prevGame, nextGame, filtered, allGames) {
  const gameIdx = allGames.indexOf(game);
  setCi(gameIdx >= 0 ? gameIdx : 0);

  document.getElementById('bgCa').style.backgroundImage = `url('${imgPath(game)}')`;
  document.getElementById('bgLa').style.backgroundImage = `url('${imgPath(prevGame)}')`;
  document.getElementById('bgRa').style.backgroundImage = `url('${imgPath(nextGame)}')`;

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
  const currentGame = allGames[getCurrentIndex()];
  const currentIdx = filtered.indexOf(currentGame);
  const newIdx = (currentIdx + dir + filtered.length) % filtered.length;
  
  const game = filtered[newIdx];
  if (!game) return;
  
  const prevGame = filtered[(newIdx - 1 + filtered.length) % filtered.length] || game;
  const nextGame = filtered[(newIdx + 1) % filtered.length] || game;

  updateGameDisplay(game, prevGame, nextGame, filtered, allGames);
  
  requestIdleCallback?.(() => {
    preloadAdjacentGames(newIdx, filtered);
  }) || setTimeout(() => preloadAdjacentGames(newIdx, filtered), 50);
}

export function navigateToLetter(dir) {
  navigate(dir);
}

function showToast(message) {
  let toast = document.getElementById('aura-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'aura-toast';
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '180px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      fontFamily: 'Barlow, sans-serif',
      fontSize: '16px',
      fontWeight: '600',
      border: '1px solid rgba(248,113,113,0.4)',
      zIndex: '1000',
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
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
      showToast('Aucun jeu selectionne');
      return;
    }

    const romBasePath = getRomPath(game);
    if (!romBasePath) {
      showToast('Chemin ROM introuvable');
      return;
    }

    const extensions = getRomExtensions(game);

    playSound('select');
    setLastPlayed(game.console, game.rom);

    window.electronAPI.launchGame(romBasePath, game.console, extensions);
  } catch (err) {
    console.error('[Launch] Erreur:', err);
    showToast('Erreur au lancement');
  }
}