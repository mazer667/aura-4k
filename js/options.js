import { applyLanguage, t } from "./i18n.js";
import { setSfxVolume, setMusicVolume, setGpDeadzone, setGpMapping } from "./aura.js";
const LS_PREFIX = "aura4k_";
const DEFAULTS = {
  volume_music: 72,
  volume_sfx: 60,
  mute: false,
  fullscreen: true,
  show_clock: true,
  grain_intensity: 35,
  cursor_size: 12,
  accent_color: "#5eb8ff",
  language: "fr",
  subtitles: true,
  transition_speed: "normal",
  fps_limit: 60,
  hide_empty_consoles: false,
  // Manette — mapping par défaut (index boutons Gamepad API standard)
  gp_left: 4,
  // LB
  gp_right: 5,
  // RB
  gp_up: 12,
  // D-pad haut
  gp_down: 13,
  // D-pad bas
  gp_play: 1,
  // Button 1 (A bas) = Jouer
  gp_quit: 2,
  // Button 2 (X gauche) = Quitter
  gp_shots: 3,
  // Button 3 (B droite) = Screenshots
  gp_favorite: 0,
  // Button 0 (Y haut) = Favoris
  gp_addFav: 7,
  // Button 7 (RT) = Ajouter favori
  gp_options: 8,
  // Select / Share
  gp_deadzone: 45
  // 45%
};
const GP_PRESETS = {
  "Xbox": { gp_left: 4, gp_right: 5, gp_up: 12, gp_down: 13, gp_play: 0, gp_quit: 1, gp_shots: 2, gp_favorite: 3, gp_addFav: 7, gp_options: 6, gp_deadzone: 15 },
  "PlayStation": { gp_left: 4, gp_right: 5, gp_up: 12, gp_down: 13, gp_play: 1, gp_quit: 2, gp_shots: 3, gp_favorite: 0, gp_addFav: 7, gp_options: 8, gp_deadzone: 15 },
  "Nintendo": { gp_left: 4, gp_right: 5, gp_up: 12, gp_down: 13, gp_play: 0, gp_quit: 1, gp_shots: 3, gp_favorite: 2, gp_addFav: 7, gp_options: 8, gp_deadzone: 15 },
  "PowerA": { gp_left: 4, gp_right: 5, gp_up: 12, gp_down: 13, gp_play: 1, gp_quit: 3, gp_shots: 2, gp_favorite: 0, gp_addFav: 7, gp_options: 8, gp_deadzone: 20 },
  "8BitDo": { gp_left: 4, gp_right: 5, gp_up: 12, gp_down: 13, gp_play: 1, gp_quit: 2, gp_shots: 3, gp_favorite: 0, gp_addFav: 7, gp_options: 8, gp_deadzone: 15 },
  "Generic": { gp_left: 4, gp_right: 5, gp_up: 12, gp_down: 13, gp_play: 1, gp_quit: 2, gp_shots: 3, gp_favorite: 0, gp_addFav: 7, gp_options: 8, gp_deadzone: 20 }
};
function detectControllerPreset(gpId) {
  const id = (gpId || "").toLowerCase();
  if (id.includes("xbox")) return "Xbox";
  if (id.includes("playstation") || id.includes("ps4") || id.includes("ps5") || id.includes("dualshock")) return "PlayStation";
  if (id.includes("nintendo") || id.includes("switch") || id.includes("wii") || id.includes("gamecube")) return "Nintendo";
  if (id.includes("powera") || id.includes("power") || id.includes("nan")) return "PowerA";
  if (id.includes("8bitdo")) return "8BitDo";
  return "Generic";
}
function applyPreset(presetName) {
  const preset = GP_PRESETS[presetName];
  if (!preset) return;
  Object.keys(preset).forEach((key) => {
    if (key.startsWith("gp_")) {
      saveSetting(key, preset[key]);
    }
  });
}
let isOpen = false;
let currentTab = 0;
let settings = { ...DEFAULTS };
let animFrameId = null;
let frameInterval = 1e3 / 60;
const TABS = ["audio", "display", "interface", "gamepad", "calibration", "language", "data", "about"];
function isOptionsOpen() {
  return isOpen;
}
function isInGamepadTab() {
  return isOpen && (document.getElementById("aura-tab-gamepad")?.classList.contains("active") || document.getElementById("aura-tab-calibration")?.classList.contains("active"));
}
function openOptions() {
  setOpenState(true);
}
function closeOptions() {
  setOpenState(false);
}
function toggleOptions() {
  setOpenState(!isOpen);
}
function getSetting(key) {
  return settings[key] ?? DEFAULTS[key];
}
function getFPSLimit() {
  return settings.fps_limit ?? DEFAULTS.fps_limit;
}
function getFrameInterval() {
  return frameInterval > 0 ? frameInterval : 1e3 / 60;
}
function getTransitionDuration() {
  const map = { fast: 250, normal: 500, slow: 1e3, none: 0 };
  return map[settings.transition_speed] ?? 500;
}
function initOptions() {
  loadSettings();
  injectCSS();
  injectHTML();
  bindEvents();
  populateControls();
  applyAllSettings();
  applyFPSLimit();
  applyLanguage(settings.language);
  console.log("[Options] Initialis\xE9 \u2014 FPS:", getFPSLimit(), "Langue:", settings.language);
}
function loadSettings() {
  settings = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (raw === null) continue;
    if (typeof DEFAULTS[key] === "boolean") settings[key] = raw === "true";
    else if (typeof DEFAULTS[key] === "number") settings[key] = Number(raw);
    else settings[key] = raw;
  }
}
function saveSetting(key, value) {
  settings[key] = value;
  localStorage.setItem(LS_PREFIX + key, String(value));
  showSavedIndicator();
}
function resetAllSettings() {
  for (const key of Object.keys(DEFAULTS)) {
    localStorage.removeItem(LS_PREFIX + key);
  }
  loadSettings();
  populateControls();
  applyAllSettings();
  applyFPSLimit();
  showSavedIndicator();
}
function setOpenState(state) {
  isOpen = state;
  const scaler = document.getElementById("scaler");
  const overlay = document.getElementById("aura-opt-overlay");
  const panel = document.getElementById("aura-opt-panel");
  if (isOpen) {
    scaler?.classList.add("aura-opt-blurred");
    overlay?.classList.add("open");
    panel?.classList.add("open");
  } else {
    scaler?.classList.remove("aura-opt-blurred");
    overlay?.classList.remove("open");
    panel?.classList.remove("open");
  }
}
function activateTab(index) {
  currentTab = Math.max(0, Math.min(TABS.length - 1, index));
  const tabName = TABS[currentTab];
  document.querySelectorAll(".aura-opt-nav-item").forEach(
    (el) => el.classList.toggle("active", el.dataset.tab === tabName)
  );
  document.querySelectorAll(".aura-opt-tab").forEach(
    (el) => el.classList.toggle("active", el.id === `aura-tab-${tabName}`)
  );
}
function moveTab(delta) {
  activateTab(currentTab + delta);
}
function applyFPSLimit() {
  const fps = getFPSLimit();
  frameInterval = 1e3 / fps;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  let lastTime = performance.now();
  function loop(now) {
    const elapsed = now - lastTime;
    if (elapsed >= frameInterval) {
      lastTime = now - elapsed % frameInterval;
      window.dispatchEvent(new CustomEvent("frame", { detail: { fps } }));
    }
    animFrameId = requestAnimationFrame(loop);
  }
  animFrameId = requestAnimationFrame(loop);
  console.log(`[Options] FPS limit\xE9 \xE0 ${fps} \u2014 intervalle: ${frameInterval.toFixed(1)}ms`);
}
function applyAllSettings() {
  applyVolume();
  applyGrain();
  applyCursor();
  applyClock();
  applyAccent();
}
function applyVolume() {
  const musicVol = settings.mute ? 0 : settings.volume_music / 100;
  const sfxVol = settings.mute ? 0 : settings.volume_sfx / 100;
  if (typeof window.setMusicVolume === "function") {
    window.setMusicVolume(musicVol);
  }
  if (typeof window.updateSfxVolume === "function") {
    window.updateSfxVolume(sfxVol);
  }
  setSfxVolume(sfxVol);
  setMusicVolume(musicVol);
}
function applyGrain() {
  const opacity = settings.grain_intensity / 100 * 0.25;
  document.querySelectorAll(".grain").forEach((el) => {
    el.style.opacity = opacity.toFixed(3);
  });
}
function applyCursor() {
  const cur = document.getElementById("cur");
  if (!cur) return;
  cur.style.width = `${settings.cursor_size}px`;
  cur.style.height = `${settings.cursor_size}px`;
  document.documentElement.style.setProperty("--cursor-size", `${settings.cursor_size}px`);
  document.documentElement.style.setProperty("--cursor-big", `${settings.cursor_size * 2.8}px`);
}
function applyClock() {
  const clockEl = document.querySelector(".clock");
  if (!clockEl) return;
  clockEl.style.visibility = settings.show_clock ? "visible" : "hidden";
  clockEl.style.opacity = settings.show_clock ? "1" : "0";
}
function applyAccent() {
  document.documentElement.style.setProperty("--aura-accent", settings.accent_color);
}
function populateControls() {
  setSlider("aura-sl-music", settings.volume_music);
  setSlider("aura-sl-sfx", settings.volume_sfx);
  setSlider("aura-sl-grain", settings.grain_intensity);
  setSlider("aura-sl-deadzone", settings.gp_deadzone ?? 15);
  setToggle("aura-tg-mute", settings.mute);
  setToggle("aura-tg-fs", settings.fullscreen);
  setToggle("aura-tg-clock", settings.show_clock);
  setToggle("aura-tg-subs", settings.subtitles);
  setToggle("aura-tg-hideempty", settings.hide_empty_consoles);
  setStepper("aura-st-cursor", settings.cursor_size);
  setStepper("aura-st-fps", settings.fps_limit);
  setRadioGroup("speed", settings.transition_speed);
  document.querySelectorAll(".aura-lang-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.lang === settings.language);
  });
  document.querySelectorAll(".aura-accent-dot").forEach((dot) => {
    dot.classList.toggle("active", dot.dataset.color === settings.accent_color);
  });
}
function setSlider(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = String(value);
  const pct = (value - Number(el.min)) / (Number(el.max) - Number(el.min)) * 100;
  el.style.setProperty("--pct", `${pct}%`);
  const valEl = document.getElementById(id.replace("aura-sl-", "aura-val-"));
  if (valEl) valEl.textContent = String(value);
}
function setToggle(id, state) {
  document.getElementById(id)?.classList.toggle("on", state);
}
function setStepper(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setRadioGroup(group, activeValue) {
  document.querySelectorAll(`[data-group="${group}"]`).forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === activeValue);
  });
}
function showSavedIndicator() {
  const el = document.getElementById("aura-opt-saved");
  if (!el) return;
  el.classList.add("show");
  clearTimeout(el._saveTimer);
  el._saveTimer = setTimeout(() => el.classList.remove("show"), 1800);
}
let selectedRomsFolder = "";
function initDataTab() {
  loadConsolesList();
  loadSSCredentials();
  document.getElementById("aura-btn-ss-save")?.addEventListener("click", saveSSCredentials);
  document.getElementById("aura-btn-select-folder")?.addEventListener("click", selectRomsFolder);
  document.getElementById("aura-btn-create-xml")?.addEventListener("click", createXml);
  if (window.electronAPI?.onScanProgress) {
    window.electronAPI.onScanProgress((data) => {
      updateScanProgress(data);
    });
  }
}
function applyDataTabI18n() {
  const dataTab = document.getElementById("aura-tab-data");
  if (!dataTab) return;
  dataTab.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key && t(key)) {
      el.textContent = t(key);
    }
  });
}
function updateScanProgress(data) {
  const progressEl = document.getElementById("aura-scan-progress");
  const barEl = document.getElementById("aura-progress-bar");
  const countEl = document.getElementById("aura-progress-count");
  const gameEl = document.getElementById("aura-progress-game");
  if (progressEl) progressEl.style.display = "block";
  if (barEl) barEl.style.width = data.progress + "%";
  if (countEl) countEl.textContent = data.current + "/" + data.total + " (" + data.progress + "%)";
  if (gameEl) gameEl.textContent = data.gameName;
}
function loadSSCredentials() {
  const userEl = document.getElementById("aura-ss-user");
  const passEl = document.getElementById("aura-ss-pass");
  if (userEl) userEl.value = localStorage.getItem("aura4k_ss_user") || "";
  if (passEl) passEl.value = localStorage.getItem("aura4k_ss_pass") || "";
}
function saveSSCredentials() {
  const userEl = document.getElementById("aura-ss-user");
  const passEl = document.getElementById("aura-ss-pass");
  if (userEl) localStorage.setItem("aura4k_ss_user", userEl.value);
  if (passEl) localStorage.setItem("aura4k_ss_pass", passEl.value);
  showDataResult("success", t("data.saved"));
}
async function loadConsolesList() {
  const select = document.getElementById("aura-console-select");
  if (!select) return;
  const chooseOpt = document.createElement("option");
  chooseOpt.value = "";
  chooseOpt.textContent = t("data.choose");
  select.innerHTML = "";
  select.appendChild(chooseOpt);
  if (window.electronAPI?.getAllConsoles) {
    const consoles = await window.electronAPI.getAllConsoles();
    consoles.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
  }
}
async function selectRomsFolder() {
  if (!window.electronAPI?.selectFolder) {
    showDataResult("error", t("data.novailable"));
    return;
  }
  const result = await window.electronAPI.selectFolder();
  if (result.canceled) return;
  selectedRomsFolder = result.path;
  const selectedFolderEl = document.getElementById("aura-selected-folder");
  if (selectedFolderEl) selectedFolderEl.textContent = selectedRomsFolder;
  const countResult = await window.electronAPI?.countRoms?.(selectedRomsFolder);
  const gamesLabel = t("data.games");
  const romsCountEl = document.getElementById("aura-roms-count");
  if (countResult && romsCountEl) {
    romsCountEl.innerHTML = countResult.count + ' <span data-i18n="data.games">' + gamesLabel + "</span>";
  }
}
async function createXml() {
  const select = document.getElementById("aura-console-select");
  const consoleName = select?.value;
  if (!selectedRomsFolder) {
    showDataResult("error", t("data.selectfolder"));
    return;
  }
  if (!consoleName) {
    showDataResult("error", t("data.selectconsole"));
    return;
  }
  const dataResultEl = document.getElementById("aura-data-result");
  const scanProgressEl = document.getElementById("aura-scan-progress");
  if (dataResultEl) dataResultEl.style.display = "none";
  if (scanProgressEl) scanProgressEl.style.display = "block";
  const result = await window.electronAPI?.createXml?.(consoleName, selectedRomsFolder);
  if (scanProgressEl) scanProgressEl.style.display = "none";
  if (result.success) {
    showDataResult("success", t("data.created") + " " + result.count + " " + t("data.games"));
    window.dispatchEvent(new CustomEvent("aura-consoles-changed"));
  } else {
    showDataResult("error", t("data.error") + ": " + result.error);
  }
}
function showDataResult(type, message) {
  const el = document.getElementById("aura-data-result");
  if (!el) return;
  el.className = "aura-data-result " + type;
  el.textContent = message;
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 8e3);
}
function bindEvents() {
  document.getElementById("aura-opt-overlay")?.addEventListener("click", (e) => {
    const target = e.target;
    if (target?.id === "aura-opt-overlay") closeOptions();
  });
  document.getElementById("aura-opt-close")?.addEventListener("click", closeOptions);
  document.querySelectorAll(".aura-opt-nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const tab = item.dataset.tab;
      if (tab) {
        const idx = TABS.indexOf(tab);
        if (idx !== -1) activateTab(idx);
      }
    });
  });
  bindSlider("aura-sl-music", "aura-val-music", (v) => {
    saveSetting("volume_music", v);
    applyVolume();
  });
  bindSlider("aura-sl-sfx", "aura-val-sfx", (v) => {
    saveSetting("volume_sfx", v);
    applyVolume();
  });
  bindSlider("aura-sl-grain", "aura-val-grain", (v) => {
    saveSetting("grain_intensity", v);
    applyGrain();
  });
  bindToggle("aura-tg-mute", (v) => {
    saveSetting("mute", v);
    applyVolume();
  });
  bindToggle("aura-tg-fs", (v) => {
    saveSetting("fullscreen", v);
    if (window.electronAPI?.setFullscreen) {
      window.electronAPI.setFullscreen(v);
    } else {
      if (v) document.documentElement.requestFullscreen?.().catch(() => {
      });
      else document.exitFullscreen?.().catch(() => {
      });
    }
  });
  document.addEventListener("fullscreenchange", () => {
    const isFs = !!document.fullscreenElement;
    saveSetting("fullscreen", isFs);
    setToggle("aura-tg-fs", isFs);
  });
  bindToggle("aura-tg-clock", (v) => {
    saveSetting("show_clock", v);
    applyClock();
  });
  bindToggle("aura-tg-hideempty", (v) => {
    saveSetting("hide_empty_consoles", v);
    window.dispatchEvent(new CustomEvent("aura-consoles-changed"));
  });
  bindToggle("aura-tg-subs", (v) => {
    saveSetting("subtitles", v);
  });
  bindStepper(
    "aura-st-fps",
    "aura-st-fps-dec",
    "aura-st-fps-inc",
    [30, 60, 120, 144, 240],
    (v) => {
      saveSetting("fps_limit", v);
      applyFPSLimit();
    }
  );
  bindStepper(
    "aura-st-cursor",
    "aura-st-cur-dec",
    "aura-st-cur-inc",
    [6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
    (v) => {
      saveSetting("cursor_size", v);
      applyCursor();
    }
  );
  document.querySelectorAll('[data-group="speed"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll('[data-group="speed"]').forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const value = btn.dataset.value;
      if (value) saveSetting("transition_speed", value);
    });
  });
  document.querySelectorAll(".aura-accent-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      document.querySelectorAll(".aura-accent-dot").forEach((d) => d.classList.remove("active"));
      dot.classList.add("active");
      const color = dot.dataset.color;
      if (color) saveSetting("accent_color", color);
      applyAccent();
    });
  });
  document.querySelectorAll(".aura-lang-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".aura-lang-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      const lang = card.dataset.lang;
      if (lang) {
        saveSetting("language", lang);
        applyLanguage(lang);
        applyDataTabI18n();
      }
    });
  });
  const GP_ACTIONS = [
    { key: "gp_left", label: "Jeu pr\xE9c\xE9dent", hint: "Navigation gauche" },
    { key: "gp_right", label: "Jeu suivant", hint: "Navigation droite" },
    { key: "gp_up", label: "Lettre pr\xE9c\xE9dente", hint: "Navigation haut" },
    { key: "gp_down", label: "Lettre suivante", hint: "Navigation bas" },
    { key: "gp_play", label: "Jouer", hint: "Lancer le jeu" },
    { key: "gp_quit", label: "Quitter", hint: "Fermer AURA" },
    { key: "gp_shots", label: "Screenshots", hint: "Afficher captures" },
    { key: "gp_favorite", label: "Filtre favoris", hint: "Afficher favoris" },
    { key: "gp_addFav", label: "Ajouter favori", hint: "Ajouter aux favoris" },
    { key: "gp_options", label: "Menu Options", hint: "Ouvrir/Fermer" }
  ];
  const BTN_NAMES = {
    0: "A/Croix",
    1: "B/Rond",
    2: "X/Carr\xE9",
    3: "Y/Triangle",
    4: "LB",
    5: "RB",
    6: "LT",
    7: "RT",
    8: "Select",
    9: "Start",
    10: "L3",
    11: "R3",
    12: "\u2191",
    13: "\u2193",
    14: "\u2190",
    15: "\u2192"
  };
  let listeningKey = null;
  let gpPollId = null;
  function buildGpActions() {
    const container = document.getElementById("aura-gp-actions");
    if (!container) return;
    container.innerHTML = "";
    GP_ACTIONS.forEach((action) => {
      const btnIdx = Number(settings[action.key] ?? DEFAULTS[action.key]);
      const btnName = BTN_NAMES[btnIdx] ?? `Btn ${btnIdx}`;
      const row = document.createElement("div");
      row.className = "aura-gp-action";
      row.dataset.key = action.key;
      row.innerHTML = `
        <div class="aura-gp-action-name">${action.label}</div>
        <div class="aura-gp-action-hint">${action.hint}</div>
        <div class="aura-gp-badge" id="aura-gp-badge-${action.key}">${btnName}</div>`;
      row.addEventListener("click", () => startListening(action.key));
      container.appendChild(row);
    });
  }
  function startListening(key) {
    if (listeningKey) stopListening(false);
    listeningKey = key;
    document.querySelectorAll(".aura-gp-action").forEach((r) => {
      r.classList.toggle("listening", r.dataset.key === key);
    });
    const hint = document.getElementById("aura-gp-listen-hint");
    if (hint) hint.classList.add("show");
    startGpPoll();
  }
  function stopListening(save) {
    if (listeningKey && save !== false) {
    }
    listeningKey = null;
    document.querySelectorAll(".aura-gp-action").forEach((r) => r.classList.remove("listening"));
    const hint = document.getElementById("aura-gp-listen-hint");
    if (hint) hint.classList.remove("show");
    stopGpPoll();
  }
  function startGpPoll() {
    if (gpPollId) return;
    const prevStates = {};
    function poll() {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const gp of gamepads) {
        if (!gp) continue;
        gp.buttons.forEach((btn, idx) => {
          const stateKey = `${gp.index}-${idx}`;
          const wasPressed = prevStates[stateKey];
          const isPressed = btn.pressed || btn.value > 0.5;
          if (isPressed && !wasPressed && listeningKey) {
            assignButton(listeningKey, idx);
          }
          prevStates[stateKey] = isPressed;
        });
      }
      gpPollId = requestAnimationFrame(poll);
    }
    gpPollId = requestAnimationFrame(poll);
  }
  function stopGpPoll() {
    if (gpPollId) {
      cancelAnimationFrame(gpPollId);
      gpPollId = null;
    }
  }
  function assignButton(key, btnIdx) {
    saveSetting(key, btnIdx);
    const badge = document.getElementById(`aura-gp-badge-${key}`);
    if (badge) badge.textContent = BTN_NAMES[btnIdx] ?? `Btn ${btnIdx}`;
    stopListening(true);
    _exportGpMapping();
  }
  function _exportGpMapping() {
    const mapping = {
      left: settings.gp_left,
      right: settings.gp_right,
      up: settings.gp_up,
      down: settings.gp_down,
      play: settings.gp_play,
      quit: settings.gp_quit,
      shots: settings.gp_shots,
      favorite: settings.gp_favorite,
      addFav: settings.gp_addFav,
      options: settings.gp_options
    };
    setGpMapping(mapping);
  }
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (listeningKey && target && !target.closest(".aura-gp-action")) stopListening(false);
  });
  window.addEventListener("gamepadconnected", (e) => {
    const el = document.getElementById("aura-gp-status");
    if (el) {
      el.textContent = `${e.gamepad.id.substring(0, 22)}\u2026`;
      el.style.color = "rgba(52,211,153,0.7)";
    }
  });
  window.addEventListener("gamepaddisconnected", () => {
    const el = document.getElementById("aura-gp-status");
    if (el) {
      el.textContent = "Aucune manette";
      el.style.color = "rgba(255,255,255,0.2)";
    }
  });
  bindSlider("aura-sl-deadzone", "aura-val-deadzone", (v) => {
    saveSetting("gp_deadzone", v);
    setGpDeadzone(v / 100);
  });
  const dzSlider = document.getElementById("aura-sl-deadzone");
  const dzVal = document.getElementById("aura-val-deadzone");
  if (dzSlider && dzVal) {
    dzSlider.addEventListener("input", () => {
      dzVal.textContent = dzSlider.value + "%";
    });
    dzVal.textContent = (settings.gp_deadzone ?? 15) + "%";
  }
  document.getElementById("aura-gp-reset")?.addEventListener("click", () => {
    ["gp_left", "gp_right", "gp_up", "gp_down", "gp_play", "gp_quit", "gp_shots", "gp_favorite", "gp_addFav", "gp_options", "gp_deadzone"].forEach((k) => {
      settings[k] = DEFAULTS[k];
      localStorage.removeItem(LS_PREFIX + k);
    });
    buildGpActions();
    setSlider("aura-sl-deadzone", DEFAULTS.gp_deadzone);
    if (dzVal) dzVal.textContent = DEFAULTS.gp_deadzone + "%";
    _exportGpMapping();
    showSavedIndicator();
    document.querySelectorAll(".aura-gp-preset-btn").forEach((b) => b.classList.remove("active"));
  });
  document.querySelectorAll(".aura-gp-preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = btn.dataset.preset;
      if (preset) {
        applyPreset(preset);
      }
      document.querySelectorAll(".aura-gp-preset-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  const gpDetectEl = document.getElementById("aura-gp-detected");
  window.addEventListener("gamepadconnected", (e) => {
    const preset = detectControllerPreset(e.gamepad.id);
    if (gpDetectEl) gpDetectEl.textContent = `D\xE9tect\xE9: ${e.gamepad.id.substring(0, 30)}... (${preset})`;
  });
  window.addEventListener("gamepaddisconnected", () => {
    if (gpDetectEl) gpDetectEl.textContent = "Manette non d\xE9tect\xE9e";
  });
  const PROFILES_KEY = "aura4k_gp_profiles";
  let currentProfile = null;
  function getProfiles() {
    try {
      return JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]");
    } catch {
      return [];
    }
  }
  function saveProfiles(profiles) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }
  function renderProfiles() {
    const list = document.getElementById("aura-gp-profile-list");
    if (!list) return;
    const profiles = getProfiles();
    if (profiles.length === 0) {
      list.innerHTML = '<div class="aura-gp-no-profiles">Aucun profil enregistr\xE9</div>';
      return;
    }
    list.innerHTML = profiles.map((p, idx) => `
      <div class="aura-gp-profile-item ${currentProfile === p.name ? "active" : ""}" data-idx="${idx}">
        <span class="aura-gp-profile-name">${p.name}</span>
        <button class="aura-gp-profile-delete" data-delete="${idx}">\xD7</button>
      </div>
    `).join("");
    list.querySelectorAll(".aura-gp-profile-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const target = e.target;
        if (target instanceof Element && target.classList.contains("aura-gp-profile-delete")) return;
        const idx = parseInt(item.dataset.idx || "0");
        loadProfile(profiles[idx]);
      });
    });
    list.querySelectorAll(".aura-gp-profile-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.delete || "0");
        profiles.splice(idx, 1);
        saveProfiles(profiles);
        if (currentProfile === profiles[idx]?.name) currentProfile = null;
        renderProfiles();
      });
    });
  }
  function loadProfile(profile) {
    if (!profile) return;
    currentProfile = profile.name;
    Object.keys(profile.mapping).forEach((key) => {
      if (key.startsWith("gp_")) {
        settings[key] = profile.mapping[key];
        localStorage.setItem(LS_PREFIX + key, String(profile.mapping[key]));
      }
    });
    buildGpActions();
    _exportGpMapping();
    renderProfiles();
    showSavedIndicator();
  }
  document.getElementById("aura-gp-profile-new")?.addEventListener("click", () => {
    const name = prompt("Nom du profil:");
    if (!name) return;
    const profiles = getProfiles();
    const mapping = {};
    ["gp_left", "gp_right", "gp_up", "gp_down", "gp_play", "gp_quit", "gp_shots", "gp_favorite", "gp_addFav", "gp_options", "gp_deadzone"].forEach((k) => {
      mapping[k] = Number(settings[k] ?? DEFAULTS[k]);
    });
    profiles.push({ name, mapping });
    saveProfiles(profiles);
    currentProfile = name;
    renderProfiles();
    showSavedIndicator();
  });
  renderProfiles();
  (function initCalibration() {
    const calBtns = document.querySelectorAll(".aura-gp-cal-btn");
    const calAxis0 = document.getElementById("aura-gp-cal-axis0");
    const calAxis1 = document.getElementById("aura-gp-cal-axis1");
    const calStatus = document.getElementById("aura-gp-cal-status");
    let pollId = null;
    function poll() {
      const gps = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = [...gps].find((g) => g?.connected);
      if (gp) {
        if (calStatus) calStatus.textContent = "Manette connect\xE9e - Testez les boutons";
        gp.buttons.forEach((btn, idx) => {
          const el = calBtns[idx];
          if (el) {
            const isPressed = btn.pressed || btn.value > 0.5;
            el.classList.toggle("active", isPressed);
          }
        });
        if (calAxis0) calAxis0.textContent = "X:" + (gp.axes[0]?.toFixed(1) || 0) + " Y:" + (gp.axes[1]?.toFixed(1) || 0);
        if (calAxis1) calAxis1.textContent = "X:" + (gp.axes[2]?.toFixed(1) || 0) + " Y:" + (gp.axes[3]?.toFixed(1) || 0);
      } else {
        if (calStatus) calStatus.textContent = "Branchez votre manette";
      }
      pollId = requestAnimationFrame(poll);
    }
    const gpTab = document.getElementById("aura-tab-gamepad");
    if (gpTab?.classList.contains("active")) {
      pollId = requestAnimationFrame(poll);
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === "class") {
          const target = m.target;
          if (target && target.id === "aura-tab-gamepad") {
            if (target.classList.contains("active") && !pollId) {
              pollId = requestAnimationFrame(poll);
            } else if (!target.classList.contains("active") && pollId) {
              cancelAnimationFrame(pollId);
              pollId = null;
            }
          }
        }
      });
    });
    document.querySelectorAll(".aura-opt-tab").forEach((tab) => {
      observer.observe(tab, { attributes: true });
    });
  })();
  buildGpActions();
  _exportGpMapping();
  document.getElementById("aura-btn-reset")?.addEventListener("click", () => {
    if (confirm(t("about.reset.confirm"))) resetAllSettings();
  });
  document.getElementById("aura-btn-cache")?.addEventListener("click", async () => {
    const { clearCache } = await import("./gameCache.js");
    const { clearCache: clearImageCache } = await import("./imageCache.js");
    const { clearOptimizedCache } = await import("./imageOptimizer.js");
    await clearCache();
    clearImageCache();
    clearOptimizedCache();
    showSavedIndicator();
  });
  initDataTab();
  applyDataTabI18n();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
      toggleOptions();
      return;
    }
    if (!isOpen) return;
    e.stopPropagation();
    if (e.key === "Escape") {
      e.preventDefault();
      closeOptions();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveTab(-1);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveTab(1);
    }
  }, true);
}
function bindSlider(sliderId, valId, callback) {
  const slider = document.getElementById(sliderId);
  const valEl = document.getElementById(valId);
  if (!slider) return;
  slider.addEventListener("input", () => {
    const v = Number(slider.value);
    const pct = (v - Number(slider.min)) / (Number(slider.max) - Number(slider.min)) * 100;
    slider.style.setProperty("--pct", `${pct}%`);
    if (valEl) valEl.textContent = String(v);
    callback(v);
  });
}
function bindToggle(toggleId, callback) {
  const el = document.getElementById(toggleId);
  if (!el) return;
  el.addEventListener("click", () => {
    el.classList.toggle("on");
    callback(el.classList.contains("on"));
  });
}
function bindStepper(valId, decId, incId, options, callback) {
  const valEl = document.getElementById(valId);
  if (!valEl) return;
  document.getElementById(decId)?.addEventListener("click", () => {
    const current = parseInt(valEl.textContent || "0");
    const idx = options.indexOf(current);
    if (idx > 0) {
      const nextValue = options[idx - 1];
      valEl.textContent = String(nextValue);
      callback(nextValue);
    }
  });
  document.getElementById(incId)?.addEventListener("click", () => {
    const current = parseInt(valEl.textContent || "0");
    const idx = options.indexOf(current);
    if (idx >= 0 && idx < options.length - 1) {
      const nextValue = options[idx + 1];
      valEl.textContent = String(nextValue);
      callback(nextValue);
    }
  });
}
function injectCSS() {
  if (document.getElementById("aura-opt-css")) return;
  const style = document.createElement("style");
  style.id = "aura-opt-css";
  style.textContent = `
    :root {
      --aura-accent: #5eb8ff;
      --cursor-size: 14px;
      --cursor-big:  38px;
    }

    /* Curseur dynamique */
    #cur {
      width:  var(--cursor-size) !important;
      height: var(--cursor-size) !important;
    }
    #cur.big {
      width:  var(--cursor-big) !important;
      height: var(--cursor-big) !important;
    }

    /* Fond flout\xE9 quand le menu est ouvert */
    #scaler {
      transition: filter 0.45s ease;
    }
    #scaler.aura-opt-blurred {
      filter: blur(20px) brightness(0.38) saturate(0.6);
      pointer-events: none;
    }

    /* Overlay sombre */
    #aura-opt-overlay {
      position: fixed; inset: 0; z-index: 500;
      background: rgba(0,0,0,0);
      pointer-events: none;
      transition: background 0.4s ease;
    }
    #aura-opt-overlay.open {
      background: rgba(0,0,0,0.55);
      pointer-events: auto;
    }

    /* Panel */
    #aura-opt-panel {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -46%) scale(0.96);
      opacity: 0;
      pointer-events: none;
      z-index: 600;
      width: 860px;
      transition: transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.32s ease;
      display: flex;
      flex-direction: column;
      font-family: 'Barlow Condensed', sans-serif;
    }
    #aura-opt-panel.open {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    .aura-opt-header {
      background: linear-gradient(135deg, rgba(10,15,32,0.99), rgba(6,10,22,0.99));
      border: 1px solid rgba(94,184,255,0.22);
      border-bottom: none;
      border-radius: 10px 10px 0 0;
      padding: 18px 26px 14px;
      display: flex; align-items: center; justify-content: space-between;
      position: relative; overflow: hidden;
    }
    .aura-opt-header::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--aura-accent), transparent);
      opacity: 0.55;
    }
    .aura-opt-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 26px; letter-spacing: 6px; color: #fff;
    }
    .aura-opt-title span { color: var(--aura-accent); }
    #aura-opt-close {
      display: flex; align-items: center; gap: 7px;
      font-size: 11px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(255,255,255,0.35);
      cursor: pointer; transition: color 0.2s;
    }
    #aura-opt-close:hover { color: #fff; }
    #aura-opt-close .esc {
      height: 20px; padding: 0 7px; border-radius: 3px;
      border: 1px solid rgba(255,255,255,0.18);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 9px;
    }

    .aura-opt-body {
      display: flex;
      background: rgba(8,12,22,0.92);
      border: 1px solid rgba(255,255,255,0.07);
      border-top: none;
      min-height: 420px;
      backdrop-filter: blur(32px);
    }

    /* Nav gauche */
    .aura-opt-nav {
      width: 200px; flex-shrink: 0;
      border-right: 1px solid rgba(255,255,255,0.07);
      padding: 12px 0;
    }
    .aura-opt-nav-item {
      display: flex; align-items: center; gap: 11px;
      padding: 13px 20px; cursor: pointer;
      font-size: 13px; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; color: rgba(255,255,255,0.32);
      transition: background 0.18s, color 0.18s;
      position: relative; user-select: none;
    }
    .aura-opt-nav-item:hover {
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.7);
    }
    .aura-opt-nav-item.active {
      color: #fff;
      background: rgba(94,184,255,0.07);
    }
    .aura-opt-nav-item.active::before {
      content: '';
      position: absolute; left: 0; top: 22%; bottom: 22%;
      width: 2px; border-radius: 2px;
      background: var(--aura-accent);
    }
    .aura-nav-ico { font-size: 14px; width: 20px; text-align: center; }

    /* Contenu */
    .aura-opt-content {
      flex: 1; padding: 22px 26px;
      overflow-y: auto;
    }
    .aura-opt-content::-webkit-scrollbar { width: 3px; }
    .aura-opt-content::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.08); border-radius: 2px;
    }

    .aura-opt-tab { display: none; flex-direction: column; gap: 6px; }
    .aura-opt-tab.active { display: flex; }

    .aura-sec-title {
      font-size: 10px; font-weight: 700; letter-spacing: 4px;
      text-transform: uppercase; color: var(--aura-accent);
      margin-bottom: 2px; margin-top: 12px;
    }
    .aura-opt-tab > .aura-sec-title:first-child { margin-top: 0; }
    .aura-sec-line {
      height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 4px;
    }

    .aura-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 16px;
    }
    .aura-row:last-child { border-bottom: none; }
    .aura-row-label {
      font-size: 14px; font-weight: 600; letter-spacing: 0.4px;
      color: rgba(255,255,255,0.88);
    }
    .aura-row-desc {
      font-size: 11px; font-weight: 300; letter-spacing: 0.3px;
      color: rgba(255,255,255,0.35); margin-top: 1px;
    }
    .aura-row-ctrl { flex-shrink: 0; }

    /* Slider */
    .aura-slider-wrap { display: flex; align-items: center; gap: 10px; }
    .aura-slider-val {
      font-family: 'Bebas Neue', sans-serif; font-size: 20px;
      letter-spacing: 1px; color: var(--aura-accent);
      min-width: 36px; text-align: right;
    }
    input.aura-slider {
      -webkit-appearance: none; appearance: none;
      width: 155px; height: 20px;
      background: transparent;
      outline: none; cursor: pointer;
    }
    input.aura-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      margin-top: -5px;
      width: 13px; height: 13px; border-radius: 50%;
      background: var(--aura-accent);
      box-shadow: 0 0 8px rgba(94,184,255,0.5);
      cursor: pointer; transition: transform 0.15s;
    }
    input.aura-slider::-webkit-slider-thumb:hover { transform: scale(1.25); }
    input.aura-slider::-webkit-slider-runnable-track {
      height: 3px; border-radius: 2px;
      background: linear-gradient(
        to right,
        var(--aura-accent) 0%,
        var(--aura-accent) var(--pct, 72%),
        rgba(255,255,255,0.1) var(--pct, 72%)
      );
    }

    /* Toggle */
    .aura-toggle {
      width: 46px; height: 24px; border-radius: 12px;
      background: rgba(255,255,255,0.09); cursor: pointer;
      position: relative; border: 1px solid rgba(255,255,255,0.1);
      transition: background 0.25s, border-color 0.25s; flex-shrink: 0;
    }
    .aura-toggle.on {
      background: rgba(94,184,255,0.3);
      border-color: rgba(94,184,255,0.45);
    }
    .aura-toggle::after {
      content: '';
      position: absolute; top: 3px; left: 3px;
      width: 16px; height: 16px; border-radius: 50%;
      background: rgba(255,255,255,0.45);
      transition: left 0.25s, background 0.25s;
    }
    .aura-toggle.on::after { left: 24px; background: var(--aura-accent); }

    /* Radio */
    .aura-radio-group { display: flex; gap: 6px; flex-wrap: wrap; }
    .aura-radio-btn {
      font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; padding: 5px 12px;
      border: 1px solid rgba(255,255,255,0.13); border-radius: 4px;
      color: rgba(255,255,255,0.38);
      background: rgba(255,255,255,0.03); cursor: pointer;
      transition: all 0.18s; user-select: none;
    }
    .aura-radio-btn:hover { border-color: rgba(255,255,255,0.28); color: rgba(255,255,255,0.75); }
    .aura-radio-btn.active {
      border-color: var(--aura-accent); color: var(--aura-accent);
      background: rgba(94,184,255,0.09);
    }

    /* Stepper */
    .aura-stepper {
      display: flex; align-items: center;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden;
    }
    .aura-stepper-val {
      font-family: 'Bebas Neue', sans-serif; font-size: 19px; letter-spacing: 1px;
      color: #fff; padding: 0 16px; min-width: 72px; text-align: center;
      background: rgba(255,255,255,0.03);
    }
    .aura-stepper-btn {
      width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.05); cursor: pointer;
      color: rgba(255,255,255,0.4); font-size: 18px;
      transition: background 0.15s, color 0.15s; user-select: none;
    }
    .aura-stepper-btn:hover { background: rgba(94,184,255,0.14); color: var(--aura-accent); }

    /* Accent dots */
    .aura-accent-picker { display: flex; gap: 8px; align-items: center; }
    .aura-accent-dot {
      width: 22px; height: 22px; border-radius: 50%; cursor: pointer;
      border: 2px solid transparent; transition: transform 0.15s, border-color 0.15s;
    }
    .aura-accent-dot:hover { transform: scale(1.18); }
    .aura-accent-dot.active { border-color: #fff; transform: scale(1.18); }

    /* Lang */
    .aura-lang-grid { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
    .aura-lang-card {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 8px 14px; border: 1px solid rgba(255,255,255,0.09);
      border-radius: 6px; cursor: pointer; background: rgba(255,255,255,0.02);
      transition: all 0.18s; user-select: none;
    }
    .aura-lang-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.22); }
    .aura-lang-card.active { border-color: var(--aura-accent); background: rgba(94,184,255,0.08); }
    .aura-lang-name {
      font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; color: rgba(255,255,255,0.4);
    }
    .aura-lang-card.active .aura-lang-name { color: var(--aura-accent); }

    /* Data / Tools */
    .aura-data-section { margin-top: 12px; }
    .aura-data-creds { display: grid; gap: 10px; margin-top: 10px; }
    .aura-data-row { display: flex; gap: 10px; align-items: center; }
    .aura-data-label { min-width: 100px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.4); letter-spacing: 1px; }
    .aura-data-input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; padding: 8px 12px; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; }
    .aura-data-input:focus { outline: none; border-color: var(--aura-accent); }
    .aura-data-select { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; padding: 8px 12px; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; cursor: pointer; }
    .aura-data-select option { background: #1a1a2e; }
    .aura-data-btn { background: var(--aura-accent); border: none; border-radius: 4px; padding: 10px 24px; color: #000; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
    .aura-data-btn:hover { transform: scale(1.03); filter: brightness(1.1); }
    .aura-data-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .aura-data-btn.secondary { background: rgba(255,255,255,0.1); color: #fff; }
    .aura-progress-wrap { margin-top: 12px; display: none; }
    .aura-progress-wrap.active { display: block; }
    .aura-progress-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
    .aura-progress-fill { height: 100%; background: var(--aura-accent); transition: width 0.3s; width: 0%; }
    .aura-progress-text { display: flex; justify-content: space-between; margin-top: 6px; font-size: 10px; color: rgba(255,255,255,0.4); }
    .aura-progress-name { font-weight: 600; color: rgba(255,255,255,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60%; }
    .aura-progress-count { font-weight: 700 !important; color: #fbbf24 !important; }
    .aura-data-result { margin-top: 10px; padding: 10px; border-radius: 4px; font-size: 11px; display: none; }
    .aura-data-result.success { display: block; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3); color: #34d399; }
    .aura-data-result.error { display: block; background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.3); color: #f87171; }

    /* About */
    .aura-about-block {
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 7px; padding: 14px 18px; margin-top: 8px;
    }
    .aura-kv {
      display: flex; justify-content: space-between;
      padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .aura-kv:last-child { border-bottom: none; }
    .aura-kv-key { font-size: 11px; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.38); letter-spacing: 2px; }
    .aura-kv-val { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); }

    .aura-ver-badge {
      display: inline-flex; align-items: center; gap: 8px; margin-bottom: 10px;
      background: rgba(94,184,255,0.07); border: 1px solid rgba(94,184,255,0.22);
      border-radius: 5px; padding: 6px 14px;
      font-size: 11px; font-weight: 700; letter-spacing: 2px;
      color: var(--aura-accent); text-transform: uppercase;
    }
    .aura-ver-dot {
      width: 5px; height: 5px; border-radius: 50%; background: var(--aura-accent);
      animation: aura-blink 1.3s ease-in-out infinite;
    }
    @keyframes aura-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

    .aura-action-btn {
      font-size: 11px; font-weight: 700; padding: 6px 14px;
      border: 1px solid rgba(255,255,255,0.13); border-radius: 4px;
      background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5);
      cursor: pointer; text-transform: uppercase; letter-spacing: 1px;
      transition: all 0.18s;
    }
    .aura-action-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
    .aura-action-btn.danger { border-color: rgba(248,113,113,0.3); color: rgba(248,113,113,0.6); }
    .aura-action-btn.danger:hover { border-color: rgba(248,113,113,0.6); color: rgba(248,113,113,0.9); }

    /* Footer */
    .aura-opt-footer {
      background: rgba(6,9,18,0.8);
      border: 1px solid rgba(255,255,255,0.07); border-top: none;
      border-radius: 0 0 10px 10px;
      padding: 10px 24px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .aura-foot-hints {
      display: flex; align-items: center; gap: 10px;
      font-size: 10px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(255,255,255,0.28);
    }
    .aura-key {
      display: inline-flex; align-items: center; justify-content: center;
      height: 18px; padding: 0 6px; border-radius: 3px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.13);
      font-size: 9px; color: rgba(255,255,255,0.4);
    }
    #aura-opt-saved {
      display: flex; align-items: center; gap: 6px;
      font-size: 10px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(100,220,150,0.7);
      opacity: 0; transition: opacity 0.3s;
    }
    #aura-opt-saved.show { opacity: 1; }
    .aura-saved-dot {
      width: 5px; height: 5px; border-radius: 50%; background: rgba(100,220,150,0.8);
    }

    /* \u2500\u2500 Manette \u2500\u2500 */
    .aura-gp-layout {
      display: flex; gap: 20px; align-items: flex-start;
    }
    /* Sch\xE9ma visuel de la manette */
    .aura-gp-visual {
      flex-shrink: 0; width: 220px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .aura-gp-visual-title {
      font-size: 9px; font-weight: 700; letter-spacing: 3px;
      text-transform: uppercase; color: rgba(255,255,255,0.25);
      text-align: center;
    }
    .aura-gp-svg { width: 100%; opacity: 0.7; }

    /* Liste des actions */
    .aura-gp-actions { flex: 1; display: flex; flex-direction: column; gap: 3px; }
    .aura-gp-action {
      display: flex; align-items: center; justify-content: space-between;
      padding: 9px 12px; border-radius: 5px;
      border: 1px solid transparent;
      background: rgba(255,255,255,0.02);
      cursor: pointer; transition: all 0.18s; gap: 10px;
    }
    .aura-gp-action:hover {
      background: rgba(255,255,255,0.05);
      border-color: rgba(255,255,255,0.08);
    }
    .aura-gp-action.listening {
      background: rgba(94,184,255,0.08);
      border-color: rgba(94,184,255,0.35);
      animation: aura-pulse-border 1s ease-in-out infinite;
    }
    @keyframes aura-pulse-border {
      0%,100% { border-color: rgba(94,184,255,0.35); }
      50%      { border-color: rgba(94,184,255,0.7); }
    }
    .aura-gp-action-name {
      font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
      color: rgba(255,255,255,0.7); flex: 1;
    }
    .aura-gp-action-hint {
      font-size: 10px; font-weight: 300; letter-spacing: 0.3px;
      color: rgba(255,255,255,0.25);
    }
    .aura-gp-badge {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 44px; height: 24px; border-radius: 4px; padding: 0 8px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      font-family: 'Bebas Neue', sans-serif; font-size: 14px;
      letter-spacing: 1px; color: rgba(255,255,255,0.6);
      transition: all 0.2s; flex-shrink: 0;
    }
    .aura-gp-action.listening .aura-gp-badge {
      background: rgba(94,184,255,0.15);
      border-color: var(--aura-accent);
      color: var(--aura-accent);
    }
    .aura-gp-listen-hint {
      font-size: 10px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: var(--aura-accent);
      text-align: center; padding: 6px 0;
      opacity: 0; transition: opacity 0.2s;
    }
    .aura-gp-listen-hint.show { opacity: 1; }

    /* Deadzone */
    .aura-gp-deadzone {
      margin-top: 6px; padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .aura-gp-reset-btn {
      margin-top: 8px;
      font-size: 10px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; padding: 5px 14px;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;
      color: rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.03); cursor: pointer;
      transition: all 0.18s; display: inline-block;
    }
    .aura-gp-reset-btn:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.6); }
    
    /* Calibration */
    .aura-gp-calibration {
      margin-top: 20px;
      padding: 16px;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
    }
    .aura-gp-cal-status {
      font-family: 'Barlow', sans-serif;
      font-size: 11px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 12px;
      text-align: center;
    }
    .aura-gp-cal-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 6px;
      margin-bottom: 12px;
    }
    .aura-gp-cal-btn {
      padding: 8px 4px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 4px;
      text-align: center;
      font-size: 10px;
      color: rgba(255,255,255,0.3);
      transition: all 0.1s;
    }
    .aura-gp-cal-btn.active {
      background: rgba(94,184,255,0.3);
      border-color: #5eb8ff;
      color: #fff;
    }
    .aura-gp-cal-axes {
      display: flex;
      gap: 16px;
    }
    .aura-gp-cal-axis {
      flex: 1;
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(0,0,0,0.3);
      border-radius: 4px;
      font-family: 'Barlow', sans-serif;
      font-size: 11px;
      color: rgba(255,255,255,0.4);
    }
    .aura-gp-cal-axis span:last-child {
      font-family: monospace;
      color: rgba(94,184,255,0.6);
    }
    
    /* Presets */
    .aura-gp-presets {
      margin-top: 20px;
      padding: 16px;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
    }
    .aura-gp-preset-btns {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .aura-gp-preset-btn {
      padding: 8px 16px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 6px;
      font-family: 'Barlow', sans-serif;
      font-size: 12px;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      transition: all 0.15s;
    }
    .aura-gp-preset-btn:hover {
      background: rgba(94,184,255,0.2);
      border-color: #5eb8ff;
    }
    .aura-gp-preset-btn.active {
      background: rgba(94,184,255,0.3);
      border-color: #5eb8ff;
      color: #fff;
    }
    .aura-gp-preset-detect {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      text-align: center;
      padding: 8px;
      background: rgba(0,0,0,0.2);
      border-radius: 4px;
    }
    
    /* Custom Profiles */
    .aura-gp-custom-profiles {
      margin-top: 16px;
      padding: 14px;
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
    }
    .aura-gp-profile-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
      min-height: 40px;
    }
    .aura-gp-profile-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .aura-gp-profile-item:hover {
      background: rgba(94,184,255,0.1);
      border-color: rgba(94,184,255,0.3);
    }
    .aura-gp-profile-item.active {
      background: rgba(94,184,255,0.2);
      border-color: #5eb8ff;
    }
    .aura-gp-profile-name {
      font-size: 13px;
      color: rgba(255,255,255,0.8);
    }
    .aura-gp-profile-delete {
      padding: 4px 8px;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.3);
      cursor: pointer;
      font-size: 14px;
    }
    .aura-gp-profile-delete:hover { color: #f87171; }
    .aura-gp-profile-new {
      padding: 10px 20px;
      background: rgba(94,184,255,0.15);
      border: 1px dashed rgba(94,184,255,0.4);
      border-radius: 6px;
      color: rgba(94,184,255,0.8);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      width: 100%;
    }
    .aura-gp-profile-new:hover {
      background: rgba(94,184,255,0.25);
      border-style: solid;
    }
    .aura-gp-no-profiles {
      font-size: 11px;
      color: rgba(255,255,255,0.3);
      text-align: center;
      padding: 10px;
    }
  `;
  document.head.appendChild(style);
}
function injectHTML() {
  if (document.getElementById("aura-opt-overlay")) return;
  document.body.insertAdjacentHTML("beforeend", `
  <div id="aura-opt-overlay"></div>
  <div id="aura-opt-panel">
    <div class="aura-opt-header">
      <div class="aura-opt-title">
        <span data-i18n="opt.title">OPTIONS</span>
        <span style="color:var(--aura-accent)" data-i18n="opt.title.amp">&amp;</span>
        <span data-i18n="opt.title.sub">PARAM\xC8TRES</span>
      </div>
      <div id="aura-opt-close"><span class="esc">ESC</span> <span data-i18n="opt.close">Fermer</span></div>
    </div>
    <div class="aura-opt-body">
      <div class="aura-opt-nav">
        <div class="aura-opt-nav-item active" data-tab="audio"><span class="aura-nav-ico">\u{1F50A}</span> <span data-i18n="tab.audio">Audio</span></div>
        <div class="aura-opt-nav-item" data-tab="display"><span class="aura-nav-ico">\u{1F5A5}</span> <span data-i18n="tab.display">Affichage</span></div>
        <div class="aura-opt-nav-item" data-tab="interface"><span class="aura-nav-ico">\u{1F3AE}</span> <span data-i18n="tab.interface">Interface</span></div>
        <div class="aura-opt-nav-item" data-tab="gamepad"><span class="aura-nav-ico">\u{1F579}</span> <span data-i18n="tab.gamepad">Manette</span></div>
        <div class="aura-opt-nav-item" data-tab="calibration"><span class="aura-nav-ico">\u{1F3AF}</span> <span>Test</span></div>
        <div class="aura-opt-nav-item" data-tab="language"><span class="aura-nav-ico">\u{1F310}</span> <span data-i18n="tab.language">Langue</span></div>
        <div class="aura-opt-nav-item" data-tab="data"><span class="aura-nav-ico">\u{1F4BE}</span> <span data-i18n="tab.data">Donn\xE9es</span></div>
        <div class="aura-opt-nav-item" data-tab="about"><span class="aura-nav-ico">\u2139</span> <span data-i18n="tab.about">\xC0 propos</span></div>
      </div>
      <div class="aura-opt-content">

        <!-- AUDIO -->
        <div class="aura-opt-tab active" id="aura-tab-audio">
          <div class="aura-sec-title" data-i18n="audio.mix">Mixage</div>
          <div class="aura-sec-line"></div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="audio.music.label">Volume musique</div>
              <div class="aura-row-desc"  data-i18n="audio.music.desc">Niveau de la bande-son du menu</div>
            </div>
            <div class="aura-row-ctrl">
              <div class="aura-slider-wrap">
                <input id="aura-sl-music" class="aura-slider" type="range" min="0" max="100" value="72">
                <div class="aura-slider-val" id="aura-val-music">72</div>
              </div>
            </div>
          </div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="audio.sfx.label">Volume effets</div>
              <div class="aura-row-desc"  data-i18n="audio.sfx.desc">Clics, transitions, navigation</div>
            </div>
            <div class="aura-row-ctrl">
              <div class="aura-slider-wrap">
                <input id="aura-sl-sfx" class="aura-slider" type="range" min="0" max="100" value="60">
                <div class="aura-slider-val" id="aura-val-sfx">60</div>
              </div>
            </div>
          </div>
          <div class="aura-sec-title" data-i18n="audio.behavior">Comportement</div>
          <div class="aura-sec-line"></div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="audio.mute.label">Muet global</div>
              <div class="aura-row-desc"  data-i18n="audio.mute.desc">D\xE9sactive tout le son de l'interface</div>
            </div>
            <div class="aura-row-ctrl"><div class="aura-toggle" id="aura-tg-mute"></div></div>
          </div>
        </div>

        <!-- AFFICHAGE -->
        <div class="aura-opt-tab" id="aura-tab-display">
          <div class="aura-sec-title" data-i18n="display.mode">Mode d'affichage</div>
          <div class="aura-sec-line"></div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="display.fs.label">Fullscreen</div>
              <div class="aura-row-desc"  data-i18n="display.fs.desc">Occupe toute la surface de l'\xE9cran</div>
            </div>
            <div class="aura-row-ctrl"><div class="aura-toggle on" id="aura-tg-fs"></div></div>
          </div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="display.clock.label">Afficher l'horloge</div>
              <div class="aura-row-desc"  data-i18n="display.clock.desc">Horloge dans le panneau de droite</div>
            </div>
            <div class="aura-row-ctrl"><div class="aura-toggle on" id="aura-tg-clock"></div></div>
          </div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="display.hideempty.label">Masquer consoles vides</div>
              <div class="aura-row-desc"  data-i18n="display.hideempty.desc">N'affiche que les consoles avec des jeux</div>
            </div>
            <div class="aura-row-ctrl"><div class="aura-toggle" id="aura-tg-hideempty"></div></div>
          </div>
          <div class="aura-sec-title" data-i18n="display.perf">Performances</div>
          <div class="aura-sec-line"></div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="display.fps.label">Limite FPS</div>
              <div class="aura-row-desc"  data-i18n="display.fps.desc">30 / 60 / 120 / 144 / 240 fps</div>
            </div>
            <div class="aura-row-ctrl">
              <div class="aura-stepper">
                <div class="aura-stepper-btn" id="aura-st-fps-dec">\u2212</div>
                <div class="aura-stepper-val" id="aura-st-fps">60</div>
                <div class="aura-stepper-btn" id="aura-st-fps-inc">+</div>
              </div>
            </div>
          </div>
        </div>

        <!-- INTERFACE -->
        <div class="aura-opt-tab" id="aura-tab-interface">
          <div class="aura-sec-title" data-i18n="ui.anim">Navigation &amp; Animations</div>
          <div class="aura-sec-line"></div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="ui.speed.label">Vitesse de transition</div>
              <div class="aura-row-desc"  data-i18n="ui.speed.desc">Dur\xE9e des animations entre les jeux</div>
            </div>
            <div class="aura-row-ctrl">
              <div class="aura-radio-group">
                <div class="aura-radio-btn" data-group="speed" data-value="fast"   data-i18n="ui.speed.fast">Rapide</div>
                <div class="aura-radio-btn" data-group="speed" data-value="normal" data-i18n="ui.speed.normal">Normal</div>
                <div class="aura-radio-btn" data-group="speed" data-value="slow"   data-i18n="ui.speed.slow">Lent</div>
              </div>
            </div>
          </div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="ui.grain.label">Intensit\xE9 du grain</div>
              <div class="aura-row-desc"  data-i18n="ui.grain.desc">Texture de grain cin\xE9matique sur le fond</div>
            </div>
            <div class="aura-row-ctrl">
              <div class="aura-slider-wrap">
                <input id="aura-sl-grain" class="aura-slider" type="range" min="0" max="100" value="35">
                <div class="aura-slider-val" id="aura-val-grain">35</div>
              </div>
            </div>
          </div>
          <div class="aura-sec-title" data-i18n="ui.cursor">Curseur &amp; Couleur</div>
          <div class="aura-sec-line"></div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="ui.cursize.label">Taille du curseur</div>
              <div class="aura-row-desc"  data-i18n="ui.cursize.desc">Diam\xE8tre du pointeur personnalis\xE9</div>
            </div>
            <div class="aura-row-ctrl">
              <div class="aura-stepper">
                <div class="aura-stepper-btn" id="aura-st-cur-dec">\u2212</div>
                <div class="aura-stepper-val" id="aura-st-cursor">12</div>
                <div class="aura-stepper-btn" id="aura-st-cur-inc">+</div>
              </div>
            </div>
          </div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="ui.accent.label">Couleur d'accentuation</div>
              <div class="aura-row-desc"  data-i18n="ui.accent.desc">Teinte principale de l'interface</div>
            </div>
            <div class="aura-row-ctrl">
              <div class="aura-accent-picker">
                <div class="aura-accent-dot active" style="background:#5eb8ff" data-color="#5eb8ff"></div>
                <div class="aura-accent-dot" style="background:#ff6b9d" data-color="#ff6b9d"></div>
                <div class="aura-accent-dot" style="background:#a78bfa" data-color="#a78bfa"></div>
                <div class="aura-accent-dot" style="background:#34d399" data-color="#34d399"></div>
                <div class="aura-accent-dot" style="background:#fbbf24" data-color="#fbbf24"></div>
                <div class="aura-accent-dot" style="background:#f87171" data-color="#f87171"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- MANETTE -->
        <div class="aura-opt-tab" id="aura-tab-gamepad">
          <div class="aura-sec-title" data-i18n="gp.mapping">Assignation des boutons</div>
          <div class="aura-sec-line"></div>
          <div id="aura-gp-listen-hint" class="aura-gp-listen-hint">Appuie sur un bouton de la manette\u2026</div>
          <div class="aura-gp-layout">

            <!-- Sch\xE9ma visuel -->
            <div class="aura-gp-visual">
              <div class="aura-gp-visual-title">Standard Layout</div>
              <svg class="aura-gp-svg" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Corps -->
                <path d="M55 40 Q40 35 30 55 L18 95 Q14 115 35 118 L50 115 Q65 108 75 95 L125 95 Q135 108 150 115 L165 118 Q186 115 182 95 L170 55 Q160 35 145 40 L120 38 Q100 32 80 38 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                <!-- D-pad -->
                <rect x="48" y="62" width="10" height="28" rx="2" fill="rgba(255,255,255,0.15)"/>
                <rect x="40" y="70" width="26" height="12" rx="2" fill="rgba(255,255,255,0.15)"/>
                <!-- Stick gauche -->
                <circle cx="72" cy="88" r="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <circle cx="72" cy="88" r="5" fill="rgba(255,255,255,0.2)"/>
                <!-- Stick droit -->
                <circle cx="118" cy="88" r="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <circle cx="118" cy="88" r="5" fill="rgba(255,255,255,0.2)"/>
                <!-- Boutons ABXY -->
                <circle cx="152" cy="62" r="7" fill="rgba(248,113,113,0.3)" stroke="rgba(248,113,113,0.5)" stroke-width="1"/>
                <text x="152" y="66" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="7" font-family="sans-serif" font-weight="bold">B</text>
                <circle cx="164" cy="75" r="7" fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.5)" stroke-width="1"/>
                <text x="164" y="79" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="7" font-family="sans-serif" font-weight="bold">A</text>
                <circle cx="140" cy="75" r="7" fill="rgba(94,184,255,0.3)" stroke="rgba(94,184,255,0.5)" stroke-width="1"/>
                <text x="140" y="79" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="7" font-family="sans-serif" font-weight="bold">X</text>
                <circle cx="152" cy="88" r="7" fill="rgba(52,211,153,0.3)" stroke="rgba(52,211,153,0.5)" stroke-width="1"/>
                <text x="152" y="92" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="7" font-family="sans-serif" font-weight="bold">Y</text>
                <!-- LB / RB -->
                <rect x="38" y="36" width="28" height="8" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <text x="52" y="42" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="5" font-family="sans-serif" font-weight="bold">LB</text>
                <rect x="134" y="36" width="28" height="8" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <text x="148" y="42" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="5" font-family="sans-serif" font-weight="bold">RB</text>
                <!-- Select / Start -->
                <rect x="87" y="70" width="12" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
                <rect x="101" y="70" width="12" height="6" rx="3" fill="rgba(255,255,255,0.15)"/>
                <text x="93" y="75" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="4" font-family="sans-serif">SEL</text>
                <text x="107" y="75" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="4" font-family="sans-serif">STA</text>
              </svg>
              <div id="aura-gp-status" style="font-size:9px;font-weight:700;letter-spacing:2px;text-align:center;color:rgba(255,255,255,0.2);text-transform:uppercase;">Aucune manette</div>
            </div>

            <!-- Actions remappables -->
            <div class="aura-gp-actions" id="aura-gp-actions">
              <!-- Inject\xE9 par JS -->
            </div>
          </div>

          <!-- Deadzone -->
          <div class="aura-gp-deadzone">
            <div class="aura-sec-title" data-i18n="gp.deadzone">Zone morte des joysticks</div>
            <div class="aura-sec-line"></div>
            <div class="aura-row">
              <div class="aura-row-info">
                <div class="aura-row-label" data-i18n="gp.dz.label">Zone morte</div>
                <div class="aura-row-desc"  data-i18n="gp.dz.desc">Seuil minimum de d\xE9placement du joystick</div>
              </div>
              <div class="aura-row-ctrl">
                <div class="aura-slider-wrap">
                  <input id="aura-sl-deadzone" class="aura-slider" type="range" min="0" max="50" value="15">
                  <div class="aura-slider-val" id="aura-val-deadzone">15%</div>
                </div>
              </div>
            </div>
            <div style="text-align:right">
              <div class="aura-gp-reset-btn" id="aura-gp-reset" data-i18n="gp.reset">R\xE9initialiser le mapping</div>
            </div>

            <!-- Presets -->
            <div class="aura-gp-presets">
              <div class="aura-sec-title">Profil automatique</div>
              <div class="aura-sec-line"></div>
              <div class="aura-gp-preset-btns">
                <div class="aura-gp-preset-btn" data-preset="Xbox">Xbox</div>
                <div class="aura-gp-preset-btn" data-preset="PlayStation">PS4/PS5</div>
                <div class="aura-gp-preset-btn" data-preset="Nintendo">Nintendo</div>
                <div class="aura-gp-preset-btn" data-preset="PowerA">PowerA</div>
                <div class="aura-gp-preset-btn" data-preset="8BitDo">8BitDo</div>
                <div class="aura-gp-preset-btn" data-preset="Generic">G\xE9n\xE9rique</div>
              </div>
              <div class="aura-gp-preset-detect" id="aura-gp-detected">Manette non d\xE9tect\xE9e</div>
            </div>

            <!-- Custom Profiles -->
            <div class="aura-gp-custom-profiles">
              <div class="aura-sec-title">Profils personnalis\xE9s</div>
              <div class="aura-sec-line"></div>
              <div class="aura-gp-profile-list" id="aura-gp-profile-list">
                <!-- Dynamique -->
              </div>
              <div class="aura-gp-profile-actions">
                <button class="aura-gp-profile-new" id="aura-gp-profile-new">+ Nouveau profil</button>
              </div>
            </div>

            <!-- Calibration -->
            <div class="aura-gp-calibration">
              <div class="aura-sec-title">Calibration - Test Manette</div>
              <div class="aura-sec-line"></div>
              <div class="aura-gp-cal-status" id="aura-gp-cal-status">
                Branchez votre manette et appuyez sur les boutons
              </div>
              <div class="aura-gp-cal-grid" id="aura-gp-cal-grid">
                <!-- 16 boutons possibles -->
                <div class="aura-gp-cal-btn" data-idx="0">A</div>
                <div class="aura-gp-cal-btn" data-idx="1">B</div>
                <div class="aura-gp-cal-btn" data-idx="2">X</div>
                <div class="aura-gp-cal-btn" data-idx="3">Y</div>
                <div class="aura-gp-cal-btn" data-idx="4">LB</div>
                <div class="aura-gp-cal-btn" data-idx="5">RB</div>
                <div class="aura-gp-cal-btn" data-idx="6">LT</div>
                <div class="aura-gp-cal-btn" data-idx="7">RT</div>
                <div class="aura-gp-cal-btn" data-idx="8">SEL</div>
                <div class="aura-gp-cal-btn" data-idx="9">START</div>
                <div class="aura-gp-cal-btn" data-idx="10">L3</div>
                <div class="aura-gp-cal-btn" data-idx="11">R3</div>
                <div class="aura-gp-cal-btn" data-idx="12">\u2191</div>
                <div class="aura-gp-cal-btn" data-idx="13">\u2193</div>
                <div class="aura-gp-cal-btn" data-idx="14">\u2190</div>
                <div class="aura-gp-cal-btn" data-idx="15">\u2192</div>
              </div>
              <div class="aura-gp-cal-axes">
                <div class="aura-gp-cal-axis">
                  <span>Stick G:</span>
                  <span id="aura-gp-cal-axis0">X: 0.00 Y: 0.00</span>
                </div>
                <div class="aura-gp-cal-axis">
                  <span>Stick D:</span>
                  <span id="aura-gp-cal-axis1">X: 0.00 Y: 0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LANGUE -->
        <div class="aura-opt-tab" id="aura-tab-language">
          <div class="aura-sec-title" data-i18n="lang.select">S\xE9lectionner la langue</div>
          <div class="aura-sec-line"></div>
          <div class="aura-lang-grid">
            <div class="aura-lang-card active" data-lang="fr"><span>\u{1F1EB}\u{1F1F7}</span><span class="aura-lang-name">Fran\xE7ais</span></div>
            <div class="aura-lang-card" data-lang="en"><span>\u{1F1EC}\u{1F1E7}</span><span class="aura-lang-name">English</span></div>
            <div class="aura-lang-card" data-lang="de"><span>\u{1F1E9}\u{1F1EA}</span><span class="aura-lang-name">Deutsch</span></div>
            <div class="aura-lang-card" data-lang="es"><span>\u{1F1EA}\u{1F1F8}</span><span class="aura-lang-name">Espa\xF1ol</span></div>
            <div class="aura-lang-card" data-lang="it"><span>\u{1F1EE}\u{1F1F9}</span><span class="aura-lang-name">Italiano</span></div>
            <div class="aura-lang-card" data-lang="ja"><span>\u{1F1EF}\u{1F1F5}</span><span class="aura-lang-name">\u65E5\u672C\u8A9E</span></div>
          </div>
          <div class="aura-sec-title" data-i18n="lang.subs">Sous-titres</div>
          <div class="aura-sec-line"></div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="lang.subs.show.label">Afficher les sous-titres</div>
              <div class="aura-row-desc"  data-i18n="lang.subs.show.desc">Dans les bandes-annonces int\xE9gr\xE9es</div>
            </div>
            <div class="aura-row-ctrl"><div class="aura-toggle on" id="aura-tg-subs"></div></div>
          </div>
        </div>

        <!-- DONN\xC9ES -->
        <div class="aura-opt-tab" id="aura-tab-data">
          <div class="aura-sec-title" data-i18n="data.title">ScreenScraper</div>
          <div class="aura-sec-line"></div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="data.user">Utilisateur ScreenScraper</div>
            </div>
            <div class="aura-row-ctrl">
              <input type="text" id="aura-ss-user" class="aura-data-input" style="width:150px" placeholder="bactino">
            </div>
          </div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="data.password">Mot de passe</div>
            </div>
            <div class="aura-row-ctrl">
              <input type="password" id="aura-ss-pass" class="aura-data-input" style="width:150px" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
            </div>
          </div>
          <div class="aura-row">
            <div class="aura-row-info"></div>
            <div class="aura-row-ctrl">
              <button class="aura-action-btn" id="aura-btn-ss-save" data-i18n="data.save">Enregistrer</button>
            </div>
          </div>

          <div class="aura-sec-title" data-i18n="data.xmltitle">G\xE9n\xE9rer HyperList XML</div>
          <div class="aura-sec-line"></div>

          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="data.step1">1. Choisir dossier ROMs</div>
              <div class="aura-row-desc" data-i18n="data.step1desc">Dossier contenant les jeux</div>
            </div>
            <div class="aura-row-ctrl">
              <button class="aura-action-btn" id="aura-btn-select-folder" data-i18n="data.browse">Parcourir...</button>
            </div>
          </div>

          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="data.selected">Dossier s\xE9lectionn\xE9</div>
              <div class="aura-row-desc" id="aura-selected-folder" data-i18n="data.nofolder">Aucun dossier choisi</div>
            </div>
            <div class="aura-row-ctrl">
              <span id="aura-roms-count" style="color:var(--aura-accent)">0 <span data-i18n="data.games">jeux</span></span>
            </div>
          </div>

          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="data.step2">2. Nom de la console (pour le XML)</div>
              <div class="aura-row-desc" data-i18n="data.step2desc">Le XML sera: data/[nom].xml</div>
            </div>
            <div class="aura-row-ctrl">
              <select id="aura-console-select" class="aura-data-select" style="width:280px">
                <option value="" data-i18n="data.choose">-- Choisir une console --</option>
              </select>
            </div>
          </div>

          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="data.step3">3. Cr\xE9er le fichier XML</div>
              <div class="aura-row-desc" data-i18n="data.step3desc">Cr\xE9e data/[nom].xml avec tous les jeux</div>
            </div>
            <div class="aura-row-ctrl">
              <button class="aura-action-btn" id="aura-btn-create-xml" data-i18n="data.createxml">Cr\xE9er XML</button>
            </div>
          </div>

          <div id="aura-scan-progress" style="display:none; margin-top:15px;">
            <div class="aura-row">
              <div class="aura-row-info">
                <div class="aura-row-label" data-i18n="data.progress">Progression</div>
                <div class="aura-row-desc" id="aura-progress-game">\u2014</div>
              </div>
              <div class="aura-row-ctrl">
                <span id="aura-progress-count" style="color:#fbbf24;font-weight:700;">0/0</span>
              </div>
            </div>
            <div style="background:rgba(255,255,255,0.1);border-radius:4px;height:8px;margin-top:8px;overflow:hidden;">
              <div id="aura-progress-bar" style="height:100%;background:var(--aura-accent);width:0%;transition:width 0.1s;"></div>
            </div>
          </div>

          <div id="aura-data-result" style="margin-top:12px;display:none"></div>
        </div>

        <!-- CALIBRATION -->
        <div class="aura-opt-tab" id="aura-tab-calibration">
          <div class="aura-sec-title">Test Manette - Calibration</div>
          <div class="aura-sec-line"></div>
          <div style="text-align:center;margin-bottom:16px;color:rgba(255,255,255,0.5);font-size:12px;">
            Appuyez sur les boutons pour voir leur r\xE9ponse
          </div>
          
          <div class="aura-gp-calibration" style="margin-top:0">
            <div class="aura-gp-cal-status" id="aura-gp-cal-status">
              Branchez votre manette
            </div>
            <div class="aura-gp-cal-grid">
              <div class="aura-gp-cal-btn" data-idx="0">A</div>
              <div class="aura-gp-cal-btn" data-idx="1">B</div>
              <div class="aura-gp-cal-btn" data-idx="2">X</div>
              <div class="aura-gp-cal-btn" data-idx="3">Y</div>
              <div class="aura-gp-cal-btn" data-idx="4">LB</div>
              <div class="aura-gp-cal-btn" data-idx="5">RB</div>
              <div class="aura-gp-cal-btn" data-idx="6">LT</div>
              <div class="aura-gp-cal-btn" data-idx="7">RT</div>
              <div class="aura-gp-cal-btn" data-idx="8">SEL</div>
              <div class="aura-gp-cal-btn" data-idx="9">START</div>
              <div class="aura-gp-cal-btn" data-idx="10">L3</div>
              <div class="aura-gp-cal-btn" data-idx="11">R3</div>
              <div class="aura-gp-cal-btn" data-idx="12">\u2191</div>
              <div class="aura-gp-cal-btn" data-idx="13">\u2193</div>
              <div class="aura-gp-cal-btn" data-idx="14">\u2190</div>
              <div class="aura-gp-cal-btn" data-idx="15">\u2192</div>
            </div>
            <div class="aura-gp-cal-axes">
              <div class="aura-gp-cal-axis">
                <span>Stick G:</span>
                <span id="aura-gp-cal-axis0">X:0 Y:0</span>
              </div>
              <div class="aura-gp-cal-axis">
                <span>Stick D:</span>
                <span id="aura-gp-cal-axis1">X:0 Y:0</span>
              </div>
            </div>
          </div>
          
          <div class="aura-gp-preset-detect" id="aura-gp-detected" style="margin-top:16px">
            Manette non d\xE9tect\xE9e
          </div>
        </div>

        <!-- \xC0 PROPOS -->
        <div class="aura-opt-tab" id="aura-tab-about">
          <div class="aura-ver-badge"><div class="aura-ver-dot"></div>AURA 4K v2.4.1</div>
          <div class="aura-about-block">
            <div class="aura-kv"><span class="aura-kv-key" data-i18n="about.version">Version</span><span class="aura-kv-val">2.4.1</span></div>
            <div class="aura-kv"><span class="aura-kv-key" data-i18n="about.build">Build</span><span class="aura-kv-val">20250401-stable</span></div>
            <div class="aura-kv"><span class="aura-kv-key" data-i18n="about.engine">Moteur</span><span class="aura-kv-val">AURA Render Engine 3.1</span></div>
            <div class="aura-kv"><span class="aura-kv-key" data-i18n="about.platform">Plateforme</span><span class="aura-kv-val">Windows \xB7 macOS \xB7 Linux</span></div>
            <div class="aura-kv"><span class="aura-kv-key" data-i18n="about.maxres">R\xE9solution max</span><span class="aura-kv-val">3840 \xD7 2160 (4K UHD)</span></div>
          </div>
          <div class="aura-sec-title" data-i18n="about.maintenance">Maintenance</div>
          <div class="aura-sec-line"></div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="about.cache.label">Vider le cache</div>
              <div class="aura-row-desc"  data-i18n="about.cache.desc">Supprime miniatures et donn\xE9es temporaires</div>
            </div>
            <div class="aura-row-ctrl"><button class="aura-action-btn" id="aura-btn-cache" data-i18n="about.cache.btn">Vider</button></div>
          </div>
          <div class="aura-row">
            <div class="aura-row-info">
              <div class="aura-row-label" data-i18n="about.reset.label">R\xE9initialiser les param\xE8tres</div>
              <div class="aura-row-desc"  data-i18n="about.reset.desc">Restaure tous les r\xE9glages par d\xE9faut</div>
            </div>
            <div class="aura-row-ctrl"><button class="aura-action-btn danger" id="aura-btn-reset" data-i18n="about.reset.btn">Reset</button></div>
          </div>
        </div>

      </div>
    </div>
    <div class="aura-opt-footer">
      <div class="aura-foot-hints">
        <span class="aura-key">\u2191\u2193</span> <span data-i18n="footer.tab">Onglet</span>
        <span class="aura-key">ESC</span> <span data-i18n="footer.close">Fermer</span>
        <span class="aura-key">\u232B SELECT</span> <span data-i18n="footer.toggle">Ouvrir/Fermer</span>
      </div>
      <div id="aura-opt-saved"><div class="aura-saved-dot"></div> <span data-i18n="footer.saved">Sauvegard\xE9</span></div>
    </div>
  </div>`);
}
export {
  closeOptions,
  getFPSLimit,
  getFrameInterval,
  getSetting,
  getTransitionDuration,
  initOptions,
  isInGamepadTab,
  isOptionsOpen,
  openOptions,
  toggleOptions
};
