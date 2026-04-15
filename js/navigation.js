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

export function navigate(dir) {
  const filtered = getFilteredGames();
  if (filtered.length === 0) return;
  
  const allGames = getGames();
  const currentGame = allGames[getCurrentIndex()];
  const currentIdx = filtered.indexOf(currentGame);
  const newIdx = (currentIdx + dir + filtered.length) % filtered.length;
  
  const game = filtered[newIdx];
  if (!game) return;
  
  const gameIdx = allGames.indexOf(game);
  setCi(gameIdx >= 0 ? gameIdx : 0);

  const prevGame = filtered[(newIdx - 1 + filtered.length) % filtered.length] || game;
  const nextGame = filtered[(newIdx + 1) % filtered.length] || game;

  document.getElementById('bgCa').style.backgroundImage = `url('${imgPath(game)}')`;
  document.getElementById('bgLa').style.backgroundImage = `url('${imgPath(prevGame)}')`;
  document.getElementById('bgRa').style.backgroundImage = `url('${imgPath(nextGame)}')`;

  updateUI(game, prevGame, nextGame);
  preloadGameImages(game);
  playSound('highlight');
  playMusicForGame(game);
  if (onGameChange) onGameChange(game);
  
  requestIdleCallback?.(() => {
    preloadAdjacentGames(newIdx, filtered);
  }) || setTimeout(() => preloadAdjacentGames(newIdx, filtered), 50);
}

export function navigateToLetter(dir) {
  const filtered = getFilteredGames();
  if (filtered.length === 0) return;
  
  const allGames = getGames();
  const currentGame = allGames[getCurrentIndex()];
  const currentIdx = filtered.indexOf(currentGame);
  const newIdx = (currentIdx + dir + filtered.length) % filtered.length;
  
  const game = filtered[newIdx];
  if (!game) return;
  
  const gameIdx = allGames.indexOf(game);
  setCi(gameIdx >= 0 ? gameIdx : 0);

  const prevGame = filtered[(newIdx - 1 + filtered.length) % filtered.length] || game;
  const nextGame = filtered[(newIdx + 1) % filtered.length] || game;

  document.getElementById('bgCa').style.backgroundImage = `url('${imgPath(game)}')`;
  document.getElementById('bgLa').style.backgroundImage = `url('${imgPath(prevGame)}')`;
  document.getElementById('bgRa').style.backgroundImage = `url('${imgPath(nextGame)}')`;

  updateUI(game, prevGame, nextGame);
  preloadGameImages(game);
  playSound('highlight');
  playMusicForGame(game);
  if (onGameChange) onGameChange(game);
}

// Aller directement a la lettre (stick haut/bas)
const LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#'];

export function goToLetter(dir) {
  const games = getGames();
  if (games.length === 0) return;
  
  // Trouver la lettre actuelle du jeu selectionne
  const currentIdx = getCurrentIndex();
  const currentLetter = games[currentIdx]?.title?.charAt(0).toUpperCase() || 'A';
  let currentLetterIdx = LETTERS.indexOf(currentLetter);
  if (currentLetterIdx === -1) currentLetterIdx = 26; // # pour les chiffres
  
  // dir: 1 = haut (A->B->C...), -1 = bas (Z->Y->X...)
  let newLetterIdx = currentLetterIdx + dir;
  if (newLetterIdx < 0) newLetterIdx = LETTERS.length - 1;
  if (newLetterIdx >= LETTERS.length) newLetterIdx = 0;
  
  const targetLetter = LETTERS[newLetterIdx];
  
  // Trouver le premier jeu qui commence par cette lettre
  for (let i = 0; i < games.length; i++) {
    const gameLetter = games[i]?.title?.charAt(0).toUpperCase();
    if (targetLetter === '#') {
      if (/[0-9]/.test(gameLetter)) {
        setCi(i);
        const game = games[i];
        const gL = games[ix(-1)];
        const gR = games[ix(1)];
        document.getElementById('bgCa').style.backgroundImage = `url('${imgPath(game)}')`;
        document.getElementById('bgLa').style.backgroundImage = `url('${imgPath(gL)}')`;
        document.getElementById('bgRa').style.backgroundImage = `url('${imgPath(gR)}')`;
        updateUI(game, gL, gR);
        preloadGameImages(game);
        playSound('highlight');
        playMusicForGame(game);
        return;
      }
    } else if (gameLetter === targetLetter) {
      setCi(i);
      const game = games[i];
      const gL = games[ix(-1)];
      const gR = games[ix(1)];
      document.getElementById('bgCa').style.backgroundImage = `url('${imgPath(game)}')`;
      document.getElementById('bgLa').style.backgroundImage = `url('${imgPath(gL)}')`;
      document.getElementById('bgRa').style.backgroundImage = `url('${imgPath(gR)}')`;
      updateUI(game, gL, gR);
      preloadGameImages(game);
      playSound('highlight');
      playMusicForGame(game);
      return;
    }
  }
}

window.__auraGoToLetter = goToLetter;

export function navigateToGame(index) {
  const games = getGames();
  if (index < 0 || index >= games.length) return;
  setCi(index);
  
  const game = games[index];
  const gL = games[ix(-1)];
  const gR = games[ix(1)];

  document.getElementById('bgCa').style.backgroundImage = `url('${imgPath(game)}')`;
  document.getElementById('bgLa').style.backgroundImage = `url('${imgPath(gL)}')`;
  document.getElementById('bgRa').style.backgroundImage = `url('${imgPath(gR)}')`;

  updateUI(game, gL, gR);
  preloadGameImages(game);
  playSound('highlight');
  playMusicForGame(game);
  if (onGameChange) onGameChange(game);
}

export function launchCurrentGame() {
  const game = getCurrentGame();
  if (!game) {
    showToast('Aucun jeu sélectionné');
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

  // Passe le chemin de base + toutes les extensions possibles
  // main.js essaiera chaque extension jusqu'à trouver le fichier
  window.electronAPI.launchGame(romBasePath, game.console, extensions);
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
      background: 'rgba(10,20,40,0.95)',
      border: '1px solid rgba(248,113,113,0.4)',
      borderRadius: '6px',
      padding: '12px 28px',
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: '14px',
      fontWeight: '600',
      letterSpacing: '2px',
      color: '#f87171',
      zIndex: '1000',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.3s'
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

window.showToast = showToast;

window.__auraNavigate = navigate;
window.__auraNavigateLetter = navigateToLetter;
window.__auraLaunchGame = launchCurrentGame;
