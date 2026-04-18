// ─── ERROR BOUNDARIES ───────────────────────────────────────────
window.onerror = (msg, url, line, col, err) => {
  console.error('[RENDERER ERROR]', msg, '| line:', line, '|', url);
  return false;
};
window.onunhandledrejection = (e) => {
  console.error('[UNHANDLED REJECTION]', e.reason);
};

// Imports
import { initOptions, toggleOptions, isOptionsOpen } from './options.js';
import { initGamepad } from './gamepad.js';
import { applyLanguage, getCurrentLang, t } from './i18n.js';
import { setNavigate, setGoToLetter, setLaunchGame } from './aura.js';

// ─── Traductions spécifiques au menu console ──────────────────
const MENU_LABELS = {
  fr: { title:'Sélection de la plateforme', platforms:'plateforme', platformsPlural:'plateformes' },
  en: { title:'Platform Selection', platforms:'platform', platformsPlural:'platforms' },
  es: { title:'Selección de plataforma', platforms:'plataforma', platformsPlural:'plataformas' },
  de: { title:'Plattform-Auswahl', platforms:'Plattform', platformsPlural:'Plattformen' },
  it: { title:'Selezione piattaforma', platforms:'piattaforma', platformsPlural:'piattaforme' },
  ja: { title:'プラットフォーム選択', platforms:'プラットフォーム', platformsPlural:'プラットフォーム' },
};

function updateMenuLanguage(lang) {
  const labels = MENU_LABELS[lang] || MENU_LABELS['fr'];
  const headerTitle = document.getElementById('header-title');
  const eraCount = document.querySelector('.era-count');
  if (headerTitle) headerTitle.textContent = labels.title;
  if (eraCount) eraCount.textContent = `${filteredList.length} ${filteredList.length > 1 ? labels.platformsPlural : labels.platforms}`;
  buildCards();
  updateInfo();
}

// ─── Chargement des consoles depuis consoles.json ───────────────
let CONSOLES = [];

async function loadConsolesFromData() {
  CONSOLES = [];
  try {
    const consoles = await window.electronAPI.getAllConsoles();
    console.log('[Console] Consoles chargees:', consoles.length);
    for (const c of consoles) {
      CONSOLES.push({
        id: c.id,
        name: c.name,
        maker: c.maker,
        year: c.year || 1990,
        era: c.era || 'other',
        color: c.color || '#5eb8ff',
        rgb: c.rgb || '94,184,255',
        games: c.gameCount || 0,
        hasXml: c.hasXml || false
      });
    }
    const hideEmpty = localStorage.getItem('aura4k_hide_empty_consoles') === 'true';
    console.log('[Console] hide_empty_consoles:', hideEmpty);
    if (hideEmpty) {
      CONSOLES = CONSOLES.filter(c => c.games > 0);
    }
    CONSOLES.sort((a, b) => a.year - b.year);
    console.log('[Console] Consoles finales:', CONSOLES.length);
  } catch (e) {
    console.warn('[Console] Erreur chargement consoles:', e);
  }
}

const ERAS = [
  { id:'all',      labelKey:'era.all',      label:'Tout'      },
  { id:'arcade',   labelKey:'era.arcade',   label:'Arcade'   },
  { id:'8bit',     labelKey:'era.8bit',     label:'8-Bit'    },
  { id:'16bit',    labelKey:'era.16bit',    label:'16-Bit'   },
  { id:'32bit',    labelKey:'era.32bit',    label:'32-Bit'   },
  { id:'64bit',    labelKey:'era.64bit',    label:'64-Bit'   },
  { id:'portable', labelKey:'era.portable', label:'Portable' },
  { id:'other',    labelKey:'era.other',    label:'Autre'    },
];

let currentEra   = 'all';
let filteredList = [];
let activeIdx    = 0;

const scaler = document.getElementById('scaler');
function scale() {
  const s  = Math.min(innerWidth / 1920, innerHeight / 1080);
  const ox = (innerWidth  - 1920 * s) / 2;
  const oy = (innerHeight - 1080 * s) / 2;
  scaler.style.transform = `translate(${ox}px,${oy}px) scale(${s})`;
}
scale(); addEventListener('resize', scale);

const cur = document.getElementById('cur');
addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});

function tickClock() {
  const n = new Date();
  document.getElementById('clock').textContent = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}
tickClock(); setInterval(tickClock, 1000);

function buildEraTabs() {
  const container = document.getElementById('eraTabs');
  container.innerHTML = '';
  ERAS.forEach(era => {
    const count = era.id === 'all' ? CONSOLES.length : CONSOLES.filter(c => c.era === era.id).length;
    const tab = document.createElement('div');
    tab.className = 'era-tab' + (era.id === currentEra ? ' active' : '');
    tab.textContent = era.labelKey ? t(era.labelKey) : era.label;
    tab.dataset.era = era.id;
    tab.addEventListener('click', () => selectEra(era.id));
    container.appendChild(tab);
  });
  const sep = document.createElement('div'); sep.className = 'era-sep';
  const cnt = document.createElement('div'); cnt.className = 'era-count';
  const labels = MENU_LABELS[getCurrentLang()] || MENU_LABELS['fr'];
  cnt.textContent = `${filteredList.length} ${filteredList.length > 1 ? labels.platformsPlural : labels.platforms}`;
  container.appendChild(sep);
  container.appendChild(cnt);
}

function selectEra(eraId) {
  currentEra   = eraId;
  filteredList = eraId === 'all' ? [...CONSOLES] : CONSOLES.filter(c => c.era === eraId);
  activeIdx    = 0;
  buildEraTabs();
  buildCards();
  updateTrack();
  updateInfo();
  updateDots();
}

function buildCards() {
  const track = document.getElementById('track');
  track.innerHTML = '';
  filteredList.forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'ccard' + (c.games === 0 ? ' unavailable' : '');
    card.dataset.idx = i;
    card.style.setProperty('--cc-accent', c.color);
    card.style.setProperty('--cc-rgb', c.rgb);
    const logoPath = `ui/consoles/${c.id}.png`;
    const shortName = c.name.split(' - ').pop();
    const displayName = shortName || c.name;
    const displayMaker = t('maker.' + c.id) || c.maker;
    const realCount = c.games || 0;
    const localeMap = { fr:'fr', en:'en', es:'es', de:'de', it:'it', ja:'ja' };
    const countLocale = localeMap[getCurrentLang()] || 'fr';
    const countLabel = realCount.toLocaleString(countLocale);
    const gamesLabel = realCount === 1 ? t('card.game') : t('card.games');
    const realBadge = realCount > 0 ? `<div class="real-count">✓ ${t('card.real')}</div>` : '';
    const emptyBadge = realCount === 0 ? `<div class="empty-count">${t('card.empty')}</div>` : '';

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-bg" style="background:linear-gradient(135deg, rgba(${c.rgb},0.12) 0%, rgba(0,0,0,0.6) 100%);">
          <div class="card-glow" style="background:${c.color};"></div>
          <div class="card-icon">
            <img src="${logoPath}" alt="${c.name}" style="display:block">
            <span class="icon-emoji" style="display:none">🎮</span>
          </div>
          ${realBadge}
          ${emptyBadge}
        </div>
        <div class="card-info">
          <div class="card-name">${displayName}</div>
          <div class="card-maker">${displayMaker}</div>
          <div class="card-games">
            <div class="games-count">${countLabel}</div>
            <div class="games-label">${gamesLabel}</div>
          </div>
          <div class="card-bar">
            <div class="card-bar-fill" style="width:${Math.min(100, realCount / 50)}%"></div>
          </div>
        </div>
      </div>`;

    const cardIconImg = card.querySelector('.card-icon img');
    const cardIconEmoji = card.querySelector('.card-icon .icon-emoji');
    if (cardIconImg && cardIconEmoji) {
      cardIconImg.addEventListener('error', () => {
        cardIconImg.style.display = 'none';
        cardIconEmoji.style.display = 'block';
      });
    }

    card.addEventListener('click', () => {
      if (i === activeIdx) { playSound('select'); confirmSelect(); }
      else { activeIdx = i; updateTrack(); updateInfo(); updateDots(); playSound('highlight'); }
    });
    card.addEventListener('mouseenter', () => cur.classList.add('big'));
    card.addEventListener('mouseleave', () => cur.classList.remove('big'));

    track.appendChild(card);
  });
}

function updateTrack() {
  const cards  = document.querySelectorAll('.ccard');
  const cardW  = 280 + 32;
  const offset = -activeIdx * cardW;
  document.getElementById('track').style.transform = `translateX(${offset}px)`;
  cards.forEach((card, i) => {
    const dist = Math.abs(i - activeIdx);
    card.classList.remove('active','prev','next','far','hidden');
    if (dist === 0) card.classList.add('active');
    else if (dist === 1) card.classList.add(i < activeIdx ? 'prev' : 'next');
    else if (dist === 2) card.classList.add('far');
    else card.classList.add('hidden');
  });
}

function updateInfo() {
  const c = filteredList[activeIdx];
  if (!c) return;
  const infoName = document.getElementById('infoName');
  const infoMaker = document.getElementById('infoMaker');
  const infoGames = document.getElementById('infoGames');
  if (infoName) infoName.childNodes[0].textContent = c.name;
  if (infoMaker) infoMaker.textContent = c.maker;
  if (infoGames) {
    const localeMap = { fr:'fr', en:'en', es:'es', de:'de', it:'it', ja:'ja' };
    const countLocale = localeMap[getCurrentLang()] || 'fr';
    infoGames.textContent = (c.games || 0).toLocaleString(countLocale);
    infoGames.style.color = c.color;
  }
}

function buildDots() {
  const dots = document.getElementById('dots');
  dots.innerHTML = '';
  filteredList.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === activeIdx ? ' active' : '');
    d.addEventListener('click', () => { activeIdx = i; updateTrack(); updateInfo(); updateDots(); });
    dots.appendChild(d);
  });
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === activeIdx);
  });
  const c = filteredList[activeIdx];
  const activeDot = document.querySelector('.dot.active');
  if (activeDot) activeDot.style.background = c?.color || 'var(--accent)';
}

const SFX = {};
const SFX_FILES = { highlight: 'sounds/highlight.wav', select: 'sounds/select.wav', load: 'sounds/load.wav', unload: 'sounds/unload.wav' };
(function initSfx() {
  for (const [name, path] of Object.entries(SFX_FILES)) {
    const a = new Audio(path);
    a.preload = 'auto';
    a.volume  = 0.60;
    SFX[name] = a;
  }
})();
function playSound(name) {
  const a = SFX[name];
  if (!a) return;
  a.currentTime = 0;
  a.play().catch(() => {});
}

let bgMusic = null;
function initBgMusic() {
  bgMusic = new Audio('sounds/background.mp3');
  bgMusic.loop   = true;
  bgMusic.volume = 0;
  bgMusic.play().catch(() => {});
  window.__bgMusic = bgMusic;
  let v = 0;
  const fadeIn = setInterval(() => {
    v = Math.min(0.45, v + 0.02);
    bgMusic.volume = v;
    if (v >= 0.45) clearInterval(fadeIn);
  }, 80);
}
function stopBgMusic(cb) {
  if (!bgMusic) { if (cb) cb(); return; }
  let v = bgMusic.volume;
  const fadeOut = setInterval(() => {
    v = Math.max(0, v - 0.04);
    bgMusic.volume = v;
    if (v <= 0) { clearInterval(fadeOut); bgMusic.pause(); if (cb) cb(); }
  }, 40);
}

function confirmSelect() {
  const c = filteredList[activeIdx];
  const flash = document.getElementById('flash');
  if (flash) flash.classList.add('on');
  setTimeout(() => { if (flash) flash.classList.remove('on'); }, 100);
  const trOverlay = document.getElementById('transition-overlay');
  if (trOverlay) trOverlay.classList.add('show');
  setTimeout(() => {
    stopBgMusic(() => { window.electronAPI.selectConsole(c.name); });
  }, 700);
}

function showComingSoon(name) {
  let banner = document.getElementById('cs-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'cs-banner';
    Object.assign(banner.style, {
      position:'absolute', bottom:'140px', left:'50%',
      transform:'translateX(-50%)',
      background:'rgba(10,20,40,0.95)',
      border:'1px solid rgba(94,184,255,0.3)',
      borderRadius:'6px', padding:'14px 36px',
      fontFamily:"'Barlow Condensed',sans-serif",
      fontSize:'13px', fontWeight:'700', letterSpacing:'3px',
      textTransform:'uppercase', color:'rgba(255,255,255,0.6)',
      zIndex:'100', pointerEvents:'none',
      opacity:'0', transition:'opacity 0.3s', whiteSpace:'nowrap'
    });
    document.getElementById('scaler').appendChild(banner);
  }
  banner.textContent = `${name} — ${t('banner.coming')}`;
  banner.style.opacity = '1';
  clearTimeout(banner._timer);
  banner._timer = setTimeout(() => { banner.style.opacity = '0'; }, 2500);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Backspace') {
    e.preventDefault();
    toggleOptions();
    return;
  }
  if (isOptionsOpen()) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    playSound('unload');
    stopBgMusic(() => { window.electronAPI.quitApp(); });
    return;
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    activeIdx = Math.max(0, Math.min(filteredList.length - 1, activeIdx + dir));
    updateTrack(); updateInfo(); updateDots();
    playSound('highlight');
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const idx = ERAS.findIndex(e => e.id === currentEra);
    if (idx > 0) { selectEra(ERAS[idx - 1].id); playSound('highlight'); }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const idx = ERAS.findIndex(e => e.id === currentEra);
    if (idx < ERAS.length - 1) { selectEra(ERAS[idx + 1].id); playSound('highlight'); }
  }
  if (e.key === 'Enter') { e.preventDefault(); playSound('select'); confirmSelect(); }
});

document.getElementById('navLeft').addEventListener('click', () => {
  activeIdx = Math.max(0, activeIdx - 1);
  updateTrack(); updateInfo(); updateDots();
  playSound('highlight');
});
document.getElementById('navRight').addEventListener('click', () => {
  activeIdx = Math.min(filteredList.length - 1, activeIdx + 1);
  updateTrack(); updateInfo(); updateDots();
  playSound('highlight');
});

document.getElementById('btnA').addEventListener('click', () => {
  playSound('select'); confirmSelect();
});
document.getElementById('btnB').addEventListener('click', () => {
  playSound('unload');
  stopBgMusic(() => { window.electronAPI.quitApp(); });
});

async function init() {
  const savedLang = localStorage.getItem('aura-lang') || 'fr';
  applyLanguage(savedLang);
  updateMenuLanguage(savedLang);
  window.addEventListener('aura-lang-change', e => {
    updateMenuLanguage(e.detail.lang);
  });
  window.addEventListener('aura-consoles-changed', async () => {
    await loadConsolesFromData();
    filteredList = [...CONSOLES];
    activeIdx = 0;
    buildEraTabs();
    buildCards();
    updateTrack();
    updateInfo();
    buildDots();
    updateDots();
  });
  initOptions();
  await loadConsolesFromData();
  console.log('[Console] Consoles chargees dynamiquement :', CONSOLES.length);
  filteredList = [...CONSOLES];
  buildEraTabs();
  buildCards();
  updateTrack();
  updateInfo();
  buildDots();
  updateDots();
  const overlay   = document.getElementById('intro-overlay');
  const introLogo = document.getElementById('intro-logo');
  setTimeout(() => { introLogo.classList.add('show'); playSound('load'); }, 150);
  setTimeout(() => { introLogo.classList.remove('show'); }, 2800);
  setTimeout(() => {
    overlay.classList.add('fade-out');
    initBgMusic();
    setTimeout(() => { overlay.style.display = 'none'; }, 1200);
  }, 3400);
  setNavigate(function(dir) {
    const event = new KeyboardEvent('keydown', { key: dir > 0 ? 'ArrowRight' : 'ArrowLeft', bubbles: true });
    document.dispatchEvent(event);
  });
  setGoToLetter(function(dir) {
    const event = new KeyboardEvent('keydown', { key: dir > 0 ? 'ArrowDown' : 'ArrowUp', bubbles: true });
    document.dispatchEvent(event);
  });
  setLaunchGame(function() {
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    document.dispatchEvent(event);
  });
  initGamepad();
  const _origSetMusic = window.setMusicVolume;
  window.setMusicVolume = function(vol) {
    if (_origSetMusic) _origSetMusic(vol);
    if (bgMusic) bgMusic.volume = vol;
  };
}

init();
