// ─── ERROR BOUNDARIES ───────────────────────────────────────────
window.onerror = (msg, url, line, col, err) => {
  console.error('[RENDERER ERROR]', msg, '| line:', line, '|', url);
  return false;
};
window.onunhandledrejection = (e) => {
  console.error('[UNHANDLED REJECTION]', e.reason);
};

// Imports
import { loadConfig, loadGamesAndPopulate, getMusicId } from './games.js';
import { initDisplay, setIdleUI, shotsAppear, shotsDisappear, btnsHide, btnsShow, setFilterFav, setFilterLetter, AL } from './ui.js';
import { navigate, launchCurrentGame, navigateToLetter, navigateToGame } from './navigation.js';
import { getIdle, setIdle, getGames, getCurrentIndex, getCurrentGame, toggleFavorite, isFavorite, getFavorites } from './state.js';
import { initAudio, playSound, playSoundAndWait, muteAllAudio } from './audio.js';
import { initGamepad, setGameRunning } from './gamepad.js';
import { playMusicForGame, stopMusic, pauseMusic, resumeMusic, muteMusic } from './music.js';
import { initOptions, toggleOptions, isOptionsOpen } from './options.js';
import { setOnGameChange } from './navigation.js';
import { setNavigate, setGoToLetter, setLaunchGame, setExitWithFade, setToggleFavorite, setIsFavorite } from './aura.js';

window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;

function updateFavLabel(rom) {
  const label = document.getElementById('favLabel');
  if (!label) return;
  if (rom && isFavorite(rom)) {
    label.textContent = 'FAVORI *';
    label.style.color = '#fbbf24';
  } else {
    label.textContent = 'FAVORI';
    label.style.color = '#fff';
  }
}

function toggleFav() {
  const game = getCurrentGame();
  if (!game || !game.rom) return;
  toggleFavorite(game.rom);
  updateFavLabel(game.rom);
  playSound('select');
}

window.toggleFav = toggleFav;

setOnGameChange((game) => {
  if (game?.rom) updateFavLabel(game.rom);
});

const scaler = document.getElementById('scaler');
function scale() {
  if (!scaler) return;
  const s = Math.max(innerWidth/2020, innerHeight/1080);
  const ox = (innerWidth - 2020*s)/2;
  const oy = (innerHeight - 1080*s)/2;
  scaler.style.transform = `translate(${ox}px,${oy}px) scale(${s})`;
}
scale(); addEventListener('resize', scale);

const cur = document.getElementById('cur');
addEventListener('mousemove', e => { if (cur) { cur.style.left = e.clientX+'px'; cur.style.top = e.clientY+'px'; } });
document.querySelectorAll('.cz').forEach(z => {
  z.addEventListener('mouseenter', () => { if (cur) cur.classList.add('big'); });
  z.addEventListener('mouseleave', () => { if (cur) cur.classList.remove('big'); });
});

window.exitWithFade = async function() {
  stopMusic();
  const fadeDiv = document.createElement('div');
  Object.assign(fadeDiv.style, {
    position:'fixed', top:'0', left:'0', width:'100%', height:'100%',
    backgroundColor:'black', zIndex:'9999', pointerEvents:'none',
    opacity:'0', transition:'opacity 0.8s ease'
  });
  document.body.appendChild(fadeDiv);
  requestAnimationFrame(() => { fadeDiv.style.opacity = '1'; });
  await playSoundAndWait('unload');
  window.electronAPI.loadConsoleSelect();
};

window.toggleShotsFromUI = function() {
  if (!getIdle()) {
    btnsHide();
    setTimeout(() => { setIdleUI(true); shotsAppear(); }, 280);
  } else {
    shotsDisappear(() => { setIdleUI(false); setTimeout(() => btnsShow(), 200); });
  }
};

window.launchCurrentGame = launchCurrentGame;

document.getElementById('navLeft')?.addEventListener('click', () => navigate(-1));
document.getElementById('navRight')?.addEventListener('click', () => navigate(1));
document.getElementById('navUp')?.addEventListener('click', () => navigateToLetter(-1));
document.getElementById('navDown')?.addEventListener('click', () => navigateToLetter(1));

document.getElementById('btnB')?.addEventListener('click', () => launchCurrentGame());
document.getElementById('btnY')?.addEventListener('click', () => toggleFav());
document.getElementById('btnA')?.addEventListener('click', () => window.exitWithFade());
document.getElementById('btnX')?.addEventListener('click', () => window.toggleShotsFromUI());

document.getElementById('czL')?.addEventListener('click', () => navigate(-1));
document.getElementById('czR')?.addEventListener('click', () => navigate(1));

document.addEventListener('keydown', e => {
  if (e.key === 'Backspace') {
    e.preventDefault();
    toggleOptions();
    return;
  }
  if (isOptionsOpen()) return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); navigate(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (!getIdle()) {
      btnsHide();
      setTimeout(() => { setIdleUI(true); shotsAppear(); }, 280);
    }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (getIdle()) {
      shotsDisappear(() => { setIdleUI(false); setTimeout(() => btnsShow(), 200); });
    }
  }
  if (e.key === 'Enter')      { e.preventDefault(); launchCurrentGame(); }
  if (e.key === 'Escape')     { setFilterFav(false); setFilterLetter(null); window.exitWithFade(); }
  if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFav(); }
  if (e.key === '*') { e.preventDefault(); setFilterFav(true); navigate(0); }
  if (e.key === ' ' || e.key === 'Space') {
    e.preventDefault();
    window.toggleShotsFromUI();
  }
  if (e.key === 'PageUp') {
    e.preventDefault();
    const currentIdx = getCurrentIndex();
    const games = getGames();
    if (games.length === 0) return;
    const currentLetter = games[currentIdx]?.title?.charAt(0).toUpperCase() || 'A';
    const idx = AL.indexOf(/[0-9]/.test(currentLetter) ? '#' : currentLetter);
    const nextIdx = (idx + 1 + AL.length) % AL.length;
    setFilterLetter(AL[nextIdx]);
    navigate(0);
  }
  if (e.key === 'PageDown') {
    e.preventDefault();
    const currentIdx = getCurrentIndex();
    const games = getGames();
    if (games.length === 0) return;
    const currentLetter = games[currentIdx]?.title?.charAt(0).toUpperCase() || 'A';
    const idx = AL.indexOf(/[0-9]/.test(currentLetter) ? '#' : currentLetter);
    const nextIdx = (idx - 1 + AL.length) % AL.length;
    setFilterLetter(AL[nextIdx]);
    navigate(0);
  }
});

function tick() {
  const n = new Date();
  const ch = document.getElementById('ch');
  const cd = document.getElementById('cd');
  if (ch) ch.textContent = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
  if (cd) cd.textContent = `${String(n.getDate()).padStart(2,'0')}.${String(n.getMonth()+1).padStart(2,'0')}.${n.getFullYear()}`;
  const clockH = document.getElementById('ch');
  const logoImg = document.querySelector('.logo-img');
  if (clockH && logoImg) {
    const w = clockH.getBoundingClientRect().width;
    logoImg.style.width = `${w}px`;
    logoImg.style.height = '32px';
  }
}

function startIntro() {
  const introDiv = document.getElementById('intro');
  if (!introDiv) return;
  const logoImg = introDiv.querySelector('.intro-logo');
  if (!logoImg) return;
  setTimeout(() => { logoImg.classList.add('show'); playSound('load'); }, 100);
  setTimeout(() => {
    introDiv.style.opacity = '0';
    setTimeout(() => {
      introDiv.style.display = 'none';
      if (scaler) scaler.style.opacity = '1';
      const games = getGames();
      const idx = getCurrentIndex();
      if (games && games.length > 0 && games[idx]) {
        playMusicForGame(games[idx], true);
        updateFavLabel(games[idx].rom);
      }
    }, 800);
  }, 2500);
}

async function init() {
  if (scaler) scaler.style.opacity = '0';
  await initAudio();
  await loadConfig();

  const lpBar = document.querySelector('.lp-fill');
  const lpText = document.querySelector('.lp-text');
  const lpContainer = document.getElementById('loading-progress');
  window.addEventListener('aura-loading-start', (e) => {
    if (lpContainer) lpContainer.classList.remove('hidden');
    if (lpText) lpText.textContent = `Chargement ${e.detail.console}...`;
    if (lpBar) lpBar.style.width = '10%';
  });
  window.addEventListener('aura-loading-progress', (e) => {
    if (lpBar) lpBar.style.width = `${e.detail.progress}%`;
    if (lpText && e.detail.phase) {
      const phaseText = { parsing: 'Analyse XML...', saving: 'Sauvegarde cache...' };
      if (phaseText[e.detail.phase]) lpText.textContent = phaseText[e.detail.phase];
    }
  });
  window.addEventListener('aura-loading-complete', (e) => {
    if (lpBar) lpBar.style.width = '100%';
    if (lpText) lpText.textContent = `${e.detail.count} jeux ${e.detail.fromCache ? '(cache)' : ''}`;
    setTimeout(() => {
      if (lpContainer) lpContainer.classList.add('hidden');
    }, 1500);
  });

  const selectedConsole = await window.electronAPI.getSelectedConsole();
  const consoleKey = selectedConsole || 'Fbneo';
  await loadGamesAndPopulate(consoleKey);
  const skeleton = document.getElementById('skeleton-loader');
  if (skeleton) skeleton.classList.add('hidden');
  initDisplay();
  setTimeout(() => { if (window.updateLetterDisplay) window.updateLetterDisplay(); }, 100);
  initOptions();
  tick();
  setInterval(tick, 1000);

  setNavigate(function(dir) {
    const event = new KeyboardEvent('keydown', { key: dir > 0 ? 'ArrowRight' : 'ArrowLeft', bubbles: true });
    document.dispatchEvent(event);
  });
  setGoToLetter(function(dir) {
    const event = new KeyboardEvent('keydown', { key: dir > 0 ? 'PageUp' : 'PageDown', bubbles: true });
    document.dispatchEvent(event);
  });
  setLaunchGame(function() {
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    document.dispatchEvent(event);
  });
  setExitWithFade(function() {
    window.exitWithFade();
  });
  initGamepad();
  if (window.electronAPI?.onGameStarted) {
    window.electronAPI.onGameStarted(() => {
      setGameRunning(true);
      pauseMusic();
      muteMusic(true);
      muteAllAudio(true);
    });
  }
  if (window.electronAPI?.onGameEnded) {
    window.electronAPI.onGameEnded(() => {
      setGameRunning(false);
      muteMusic(false);
      muteAllAudio(false);
      resumeMusic();
    });
  }
  startIntro();
}

init();
