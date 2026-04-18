// js/ui.js
import { G, ci, idle, setIdle, getIdle, getCurrentIndex, getGames, isFavorite, getFavorites, Game } from './state.js';
import { imgPath, setShot, preloadGameImages } from './games.js';
import { t, tGenre } from './i18n.js';
import { batchUpdate } from './batchUpdate.js';

export const AL = ['#','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
export let filterFav = false;
export let filterLetter: string | null = null;
export const MAX_DISPLAYED_GAMES = 500; // Limit for performance

export function setFilterLetter(letter: string | null) {
  filterLetter = letter;
  filterFav = false;
}

export function setFilterFav(on?: boolean) {
  if (typeof on === 'boolean') {
    filterFav = on;
  } else {
    filterFav = !filterFav;
  }
  if (filterFav) filterLetter = null;
  
  // Met a jour l'affichage
  updateAlpha();
  updateFavIndicator();
}

export function getFilteredGames() {
  const games = getGames();
  if (filterFav) {
    const favs = getFavorites();
    return games.filter(g => favs.includes(g.rom)).slice(0, MAX_DISPLAYED_GAMES);
  }
  if (filterLetter) {
    const letter = filterLetter;
    if (letter === '#') {
      return games.filter(g => /^[0-9]/.test(g.title)).slice(0, MAX_DISPLAYED_GAMES);
    }
    return games.filter(g => g.title.toUpperCase().startsWith(letter)).slice(0, MAX_DISPLAYED_GAMES);
  }
  return games.slice(0, MAX_DISPLAYED_GAMES);
}

export const ix = (d: number): number => {
  const filtered = getFilteredGames();
  if (!filtered.length) return 0;
  const currentGame = getGames()[getCurrentIndex()];
  const currentFiltered = currentGame ? filtered.indexOf(currentGame) : -1;
  if (currentFiltered === -1) return d;
  const result = (currentFiltered + d + filtered.length) % filtered.length;
  return result < 0 ? 0 : result;
};

export function updateUI(g: Game | null, gL: Game | null, gR: Game | null) {
  if (!g || !gL || !gR) return;
  
  batchUpdate(() => {
    const snL = document.getElementById('snL');
    const snR = document.getElementById('snR');
    const pub = document.getElementById('pub');
    const gtitle = document.getElementById('gtitle');
    const gtags = document.getElementById('gtags');
    const alpha = document.getElementById('alpha');
    
    const snLSpan = snL?.querySelector<HTMLSpanElement>('span');
    const snRSpan = snR?.querySelector<HTMLSpanElement>('span');

    if (snLSpan) snLSpan.textContent = gL.short ?? '';
    if (snRSpan) snRSpan.textContent = gR.short ?? '';
    if (pub) pub.textContent = g.pub;
    if (gtitle) gtitle.textContent = g.title;

    let playersLabel: string;
    if (g.playersRange) {
      playersLabel = `${g.playersRange} ${t('player.range')}`;
    } else if (g.playersNum !== null && g.playersNum !== undefined) {
      playersLabel = `${g.playersNum} ${t(g.playersNum > 1 ? 'player.many' : 'player.one')}`;
    } else {
      playersLabel = `1 ${t('player.one')}`;
    }

    const genreLabel = tGenre(g.genre) || g.genre;

    if (gtags) {
      gtags.innerHTML =
        `<span class="tag">${g.year}</span>` +
        `<span class="tag">${playersLabel}</span>` +
        `<span class="tag">${genreLabel}</span>` +
        (isFavorite(g.rom) ? '<span class="tag" style="color:#fbbf24;">FAV</span>' : '');
    }

    // Met a jour l'alphabet - lettre du jeu actuel en jaune
    let displayLetter = 'A';
    if (g && g.title && typeof g.title === 'string' && g.title.length > 0) {
      const gameLetter = g.title.charAt(0).toUpperCase();
      displayLetter = /[0-9]/.test(gameLetter) ? '#' : gameLetter;
    }
    const favs = getFavorites();
    const favCount = favs.length;
    
    let html = `<span class="ac${filterFav ? ' fav on' : ''}" data-filter="fav" style="cursor:pointer;">FAV${favCount > 0 ? ' ' + favCount : ''}&nbsp;</span>`;
    
    for (let i = 0; i < AL.length; i++) {
      const l = AL[i];
      const isActive = (filterLetter === l) || (l === displayLetter && !filterFav);
      html += `<span class="ac${isActive ? ' on' : ''}" data-letter="${l}" style="cursor:pointer;">${l}&nbsp;&nbsp;</span>`;
    }
    
    if (alpha) {
      alpha.innerHTML = html;
    }
  });

  const s0 = document.getElementById('s0');
  const s1 = document.getElementById('s1');
  const s2 = document.getElementById('s2');
  if (s0) setShot(s0, g, 1);
  if (s1) setShot(s1, g, 2);
  if (s2) setShot(s2, g, 3);
  
  document.querySelectorAll<HTMLElement>('#alpha [data-letter]').forEach(el => {
    el.addEventListener('click', () => {
      const letter = el.dataset.letter || null;
      if (filterLetter === letter) {
        filterLetter = null;
      } else {
        filterLetter = letter;
        filterFav = false;
      }
      updateAlpha();
      updateFavIndicator();
    });
  });
  
  document.querySelector<HTMLElement>('#alpha [data-filter="fav"]')?.addEventListener('click', () => {
    filterFav = !filterFav;
    if (filterFav) filterLetter = null;
    updateAlpha();
    updateFavIndicator();
  });
}

function updateAlpha() {
  const games = getGames();
  const idx = getCurrentIndex();
  let displayLetter = null;
  
  if (idx >= 0 && idx < games.length && games[idx] && games[idx].title) {
    const gameLetter = games[idx].title.charAt(0).toUpperCase();
    displayLetter = /[0-9]/.test(gameLetter) ? '#' : gameLetter;
  }
  
  const favs = getFavorites();
  const favCount = favs.length;
  
  const alphaEl = document.getElementById('alpha');
  if (alphaEl) {
    alphaEl.innerHTML =
      `<span class="ac${filterFav ? ' fav on' : ''}" data-filter="fav" style="cursor:pointer;">FAV${favCount > 0 ? ' ' + favCount : ''}&nbsp;</span>` +
      AL.map(l => {
        const isActive = (filterLetter === l) || (displayLetter && l === displayLetter && !filterFav);
        return `<span class="ac${isActive ? ' on' : ''}" data-letter="${l}" style="cursor:pointer;">${l}&nbsp;&nbsp;</span>`;
      }).join('');

    const newAlphaEl = alphaEl.cloneNode(true) as HTMLElement;
    alphaEl.parentNode?.replaceChild(newAlphaEl, alphaEl);

    newAlphaEl.querySelectorAll<HTMLElement>('[data-letter]').forEach(el => {
      el.addEventListener('click', () => {
        const letter = el.dataset.letter || null;
        if (filterLetter === letter) {
          filterLetter = null;
        } else {
          filterLetter = letter;
          filterFav = false;
        }
        updateAlpha();
        updateFavIndicator();
      });
    });

    newAlphaEl.querySelector<HTMLElement>('[data-filter="fav"]')?.addEventListener('click', () => {
      filterFav = !filterFav;
      if (filterFav) filterLetter = null;
      updateAlpha();
      updateFavIndicator();
    });
  }
}

function updateFavIndicator() {
  const indicator = document.getElementById('fav-indicator');
  if (indicator) {
    indicator.style.display = filterFav ? 'block' : 'none';
  }
}

// Expose pour gamepad
(window as any).setFilterFav = setFilterFav;

export function initDisplay() {
  const games = getGames();
  if (!games.length) return;
  filterFav = false;
  filterLetter = null;
  updateFavIndicator();
  
  const g  = games[0];
  const gL = games[ix(-1)] || games[0];
  const gR = games[ix(1)] || games[0];
  
  if (!g) return;

  const bgCa = document.getElementById('bgCa') as HTMLElement | null;
  const bgLa = document.getElementById('bgLa') as HTMLElement | null;
  const bgRa = document.getElementById('bgRa') as HTMLElement | null;

  if (bgCa) {
    bgCa.style.backgroundImage = `url('${imgPath(g)}')`;
    bgCa.style.backgroundSize = 'cover';
  }
  if (bgLa) {
    bgLa.style.backgroundImage = `url('${imgPath(gL)}')`;
    bgLa.style.backgroundSize = 'cover';
  }
  if (bgRa) {
    bgRa.style.backgroundImage = `url('${imgPath(gR)}')`;
    bgRa.style.backgroundSize = 'cover';
  }

  updateUI(g, gL, gR);
  preloadGameImages(g);
}

export function setIdleUI(on: boolean) {
  setIdle(on);
  const screen = document.getElementById('screen');
  if (screen) screen.classList.toggle('idle', on);
}

export function shotsAppear() {
  const shots = document.querySelectorAll<HTMLElement>('.shot');
  shots.forEach((s, i) => {
    s.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    s.style.opacity    = '1';
    s.style.transform  = 'translateY(0px) scale(1)';
  });
}

export function shotsDisappear(cb?: () => void) {
  const shots = document.querySelectorAll<HTMLElement>('.shot');
  shots.forEach(s => {
    s.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    s.style.opacity    = '0';
    s.style.transform  = 'translateY(30px) scale(0.97)';
  });
  setTimeout(() => { if (cb) cb(); }, 300);
}

export function btnsHide() {
  const btns = document.querySelector<HTMLElement>('.btns');
  if (btns) {
    btns.style.opacity       = '0';
    btns.style.pointerEvents = 'none';
  }
}

export function btnsShow() {
  const btns = document.querySelector<HTMLElement>('.btns');
  if (!btns) return;
  btns.style.opacity       = '1';
  btns.style.pointerEvents = 'auto';
}
