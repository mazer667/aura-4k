import { idle, toggleFavorite } from "./state.js";
import { btnsHide, setIdleUI, shotsAppear, shotsDisappear, btnsShow } from "./ui.js";
import { navigate as navGame } from "./navigation.js";
import { isOptionsOpen, isInGamepadTab, toggleOptions } from "./options.js";
import { AURA, setGameRunning as setAuraGameRunning } from "./aura.js";
import { GAMEPAD } from "./constants.js";
const { INITIAL_DELAY, REPEAT_INTERVAL, DEBOUNCE_INTERVAL, DEFAULT_DEADZONE } = GAMEPAD;
const prev = {};
const holding = {};
const paused = false;
let btn8Prev = false;
let isGameRunning = false;
let lastNavigateTime = 0;
const NAVIGATE_DEBOUNCE = DEBOUNCE_INTERVAL;
function setGameRunning(running) {
  isGameRunning = running;
  setAuraGameRunning(running);
  if (running) {
    stopAllHolds();
  }
}
function getDeadzone() {
  return AURA.gpDeadzone ?? DEFAULT_DEADZONE;
}
function getBtn(key) {
  if (AURA.gpMapping && AURA.gpMapping[key] !== void 0) {
    return AURA.gpMapping[key];
  }
  return DEFAULT_BTN[key];
}
const DEFAULT_BTN = {
  left: 4,
  right: 5,
  up: 12,
  down: 13,
  play: 1,
  quit: 2,
  shots: 3,
  favorite: 0,
  addFav: 7,
  options: 8
};
function startHold(key, fn) {
  if (holding[key]) return;
  fn();
  holding[key] = setTimeout(() => {
    holding[key] = setInterval(fn, REPEAT_INTERVAL);
  }, INITIAL_DELAY);
}
function stopHold(key) {
  if (!holding[key]) return;
  clearTimeout(holding[key]);
  clearInterval(holding[key]);
  delete holding[key];
}
function stopAllHolds() {
  Object.keys(holding).forEach((k) => stopHold(k));
}
function pressed(gp, idx) {
  const cur = gp.buttons[idx]?.pressed ?? false;
  const was = prev[idx] ?? false;
  prev[idx] = cur;
  return cur && !was;
}
function syncState(gp) {
  if (gp) gp.buttons.forEach((b, i) => {
    prev[i] = b.pressed;
  });
}
function toggleShots() {
  if (!idle) {
    btnsHide();
    setTimeout(() => {
      setIdleUI(true);
      shotsAppear();
    }, 280);
  } else {
    shotsDisappear(() => {
      setIdleUI(false);
      setTimeout(() => btnsShow(), 200);
    });
  }
}
function toggleFav() {
  if (window.toggleFav) {
    window.toggleFav();
    return;
  }
  const game = window.getCurrentGame?.();
  if (game?.rom) {
    toggleFavorite(game.rom);
  }
}
function toggleFavFilter() {
  if (window.setFilterFav) {
    window.setFilterFav();
  }
}
function navigate(dir) {
  const now = Date.now();
  if (now - lastNavigateTime < NAVIGATE_DEBOUNCE) return;
  lastNavigateTime = now;
  if (AURA.navigate) {
    AURA.navigate(dir);
  } else {
    navGame(dir);
  }
}
function navigateToLetter(dir) {
  const now = Date.now();
  if (now - lastNavigateTime < NAVIGATE_DEBOUNCE) return;
  lastNavigateTime = now;
  if (AURA.goToLetter) {
    AURA.goToLetter(dir);
  }
}
function launchCurrentGame() {
  if (AURA.launchGame) {
    AURA.launchGame();
  }
}
function exitWithFade() {
  if (AURA.exitWithFade) {
    AURA.exitWithFade();
    return;
  }
  const d = document.createElement("div");
  Object.assign(d.style, {
    position: "fixed",
    inset: "0",
    backgroundColor: "black",
    zIndex: "9999",
    pointerEvents: "none",
    opacity: "0",
    transition: "opacity 0.8s ease"
  });
  document.body.appendChild(d);
  requestAnimationFrame(() => {
    d.style.opacity = "1";
  });
  setTimeout(() => window.electronAPI.quitApp(), 800);
}
function poll() {
  const gp = [...navigator.getGamepads()].find((g) => g?.connected);
  const DEADZONE = getDeadzone();
  if (!gp || paused || isGameRunning) {
    if (gp && paused) syncState(gp);
    requestAnimationFrame(poll);
    return;
  }
  const selectIdx = getBtn("options");
  const selectPressed = gp.buttons[selectIdx]?.pressed ?? false;
  if (selectPressed && !btn8Prev) {
    toggleOptions();
  }
  btn8Prev = selectPressed;
  if (isInGamepadTab()) {
    requestAnimationFrame(poll);
    return;
  }
  if (isOptionsOpen()) {
    const ly2 = gp.axes[1] ?? 0;
    if (ly2 < -DEADZONE) {
      startHold("opt_up", () => {
        const event = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true });
        document.dispatchEvent(event);
      });
    } else {
      stopHold("opt_up");
    }
    if (ly2 > DEADZONE) {
      startHold("opt_down", () => {
        const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
        document.dispatchEvent(event);
      });
    } else {
      stopHold("opt_down");
    }
    if (pressed(gp, getBtn("play"))) {
      const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
      document.dispatchEvent(event);
    }
    if (pressed(gp, getBtn("quit"))) {
      const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
      document.dispatchEvent(event);
    }
    requestAnimationFrame(poll);
    return;
  }
  const lx = gp.axes[0] ?? 0;
  const ly = gp.axes[1] ?? 0;
  if (lx < -DEADZONE) {
    startHold("lx_l", () => navigate(-1));
  } else {
    stopHold("lx_l");
  }
  if (lx > DEADZONE) {
    startHold("lx_r", () => navigate(1));
  } else {
    stopHold("lx_r");
  }
  if (ly < -DEADZONE) {
    startHold("ly_u", () => navigateToLetter(1));
  } else {
    stopHold("ly_u");
  }
  if (ly > DEADZONE) {
    startHold("ly_d", () => navigateToLetter(-1));
  } else {
    stopHold("ly_d");
  }
  if (pressed(gp, getBtn("left"))) navigate(-1);
  if (pressed(gp, getBtn("right"))) navigate(1);
  if (pressed(gp, getBtn("up"))) navigateToLetter(-1);
  if (pressed(gp, getBtn("down"))) navigateToLetter(1);
  if (pressed(gp, getBtn("favorite"))) toggleFavFilter();
  if (pressed(gp, getBtn("addFav"))) toggleFav();
  if (pressed(gp, getBtn("play"))) launchCurrentGame();
  if (pressed(gp, getBtn("quit"))) exitWithFade();
  if (pressed(gp, getBtn("shots"))) toggleShots();
  requestAnimationFrame(poll);
}
function initGamepad() {
  requestAnimationFrame(poll);
}
export {
  initGamepad,
  setGameRunning
};
