import { setIdle, getCurrentIndex, getGames, isFavorite, getFavorites } from "./state.js";
import { imgPath, setShot, preloadGameImages } from "./games.js";
import { t, tGenre } from "./i18n.js";
import { batchUpdate } from "./batchUpdate.js";
const AL = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let filterFav = false;
let filterLetter = null;
const MAX_DISPLAYED_GAMES = 500;
const _domCache = {};
let _filteredCache = null;
let _lastFilterKey = "";
let _letterIndex = null;
function _buildLetterIndex(games) {
  const index = /* @__PURE__ */ new Map();
  for (const g of games) {
    const letter = g.title?.charAt(0).toUpperCase() || "#";
    const key = /^[0-9]/.test(letter) ? "#" : letter;
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(g);
  }
  _letterIndex = index;
}
function _getGamesByLetter(letter, games) {
  if (!_letterIndex || _letterIndex.size === 0) {
    _buildLetterIndex(games);
  }
  return _letterIndex?.get(letter) || [];
}
function _cacheDom() {
  _domCache.snL = document.getElementById("snL");
  _domCache.snR = document.getElementById("snR");
  _domCache.pub = document.getElementById("pub");
  _domCache.gtitle = document.getElementById("gtitle");
  _domCache.gtags = document.getElementById("gtags");
  _domCache.alpha = document.getElementById("alpha");
  _domCache.s0 = document.getElementById("s0");
  _domCache.s1 = document.getElementById("s1");
  _domCache.s2 = document.getElementById("s2");
  _domCache.favIndicator = document.getElementById("fav-indicator");
  _domCache.screen = document.getElementById("screen");
}
function setFilterLetter(letter) {
  filterLetter = letter;
  filterFav = false;
  updateAlpha();
}
function setFilterFav(on) {
  if (typeof on === "boolean") {
    filterFav = on;
  } else {
    filterFav = !filterFav;
  }
  if (filterFav) filterLetter = null;
  updateAlpha();
  updateFavIndicator();
}
function getFilteredGames() {
  const games = getGames();
  const key = `${filterFav}:${filterLetter}:${games.length}`;
  if (key === _lastFilterKey && _filteredCache) {
    return _filteredCache;
  }
  let filtered;
  if (filterFav) {
    const favs = getFavorites();
    const favSet = new Set(favs);
    filtered = games.filter((g) => favSet.has(g.rom)).slice(0, MAX_DISPLAYED_GAMES);
  } else if (filterLetter) {
    const letter = filterLetter;
    if (letter === "#") {
      filtered = _getGamesByLetter("#", games);
    } else {
      filtered = _getGamesByLetter(letter, games);
    }
    filtered = filtered.slice(0, MAX_DISPLAYED_GAMES);
  } else {
    filtered = games.slice(0, MAX_DISPLAYED_GAMES);
  }
  _filteredCache = filtered;
  _lastFilterKey = key;
  return filtered;
}
function invalidateFilterCache() {
  _filteredCache = null;
  _lastFilterKey = "";
  _letterIndex = null;
}
if (typeof window !== "undefined") {
  window.addEventListener("aura-loading-complete", () => {
    invalidateFilterCache();
  });
}
const ix = (d) => {
  const filtered = getFilteredGames();
  if (!filtered.length) return 0;
  const currentGame = getGames()[getCurrentIndex()];
  const currentFiltered = currentGame ? filtered.indexOf(currentGame) : -1;
  if (currentFiltered === -1) return d;
  const result = (currentFiltered + d + filtered.length) % filtered.length;
  return result < 0 ? 0 : result;
};
function updateUI(g, gL, gR) {
  if (!g || !gL || !gR) return;
  batchUpdate(() => {
    const snLSpan = _domCache.snL?.querySelector("span");
    const snRSpan = _domCache.snR?.querySelector("span");
    if (snLSpan) snLSpan.textContent = gL.short ?? "";
    if (snRSpan) snRSpan.textContent = gR.short ?? "";
    if (_domCache.pub) _domCache.pub.textContent = g.pub;
    if (_domCache.gtitle) _domCache.gtitle.textContent = g.title;
    let playersLabel;
    if (g.playersRange) {
      playersLabel = `${g.playersRange} ${t("player.range")}`;
    } else if (g.playersNum !== null && g.playersNum !== void 0) {
      playersLabel = `${g.playersNum} ${t(g.playersNum > 1 ? "player.many" : "player.one")}`;
    } else {
      playersLabel = `1 ${t("player.one")}`;
    }
    const genreLabel = tGenre(g.genre) || g.genre;
    if (_domCache.gtags) {
      _domCache.gtags.innerHTML = `<span class="tag">${g.year}</span><span class="tag">${playersLabel}</span><span class="tag">${genreLabel}</span>` + (isFavorite(g.rom) ? '<span class="tag" style="color:#fbbf24;">FAV</span>' : "");
    }
    let displayLetter = "A";
    if (g && g.title && typeof g.title === "string" && g.title.length > 0) {
      const gameLetter = g.title.charAt(0).toUpperCase();
      displayLetter = /[0-9]/.test(gameLetter) ? "#" : gameLetter;
    }
    let html = `<span class="ac${filterFav ? " fav on" : ""}" data-filter="fav" style="cursor:pointer;">FAV&nbsp;</span>`;
    for (let i = 0; i < AL.length; i++) {
      const l = AL[i];
      const isActive = filterLetter === l || l === displayLetter && !filterFav;
      html += `<span class="ac${isActive ? " on" : ""}" data-letter="${l}" style="cursor:pointer;">${l}&nbsp;&nbsp;</span>`;
    }
    if (_domCache.alpha) {
      _domCache.alpha.innerHTML = html;
    }
  });
  if (_domCache.s0) setShot(_domCache.s0, g, 1);
  if (_domCache.s1) setShot(_domCache.s1, g, 2);
  if (_domCache.s2) setShot(_domCache.s2, g, 3);
  _domCache.alpha?.querySelectorAll("[data-letter]").forEach((el) => {
    el.addEventListener("click", () => {
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
  _domCache.alpha?.querySelector('[data-filter="fav"]')?.addEventListener("click", () => {
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
    displayLetter = /[0-9]/.test(gameLetter) ? "#" : gameLetter;
  }
  const alphaEl = _domCache.alpha;
  if (alphaEl) {
    alphaEl.innerHTML = `<span class="ac${filterFav ? " fav on" : ""}" data-filter="fav" style="cursor:pointer;">FAV&nbsp;</span>` + AL.map((l) => {
      const isActive = filterLetter === l || displayLetter && l === displayLetter && !filterFav;
      return `<span class="ac${isActive ? " on" : ""}" data-letter="${l}" style="cursor:pointer;">${l}&nbsp;&nbsp;</span>`;
    }).join("");
    const newAlphaEl = alphaEl.cloneNode(true);
    alphaEl.parentNode?.replaceChild(newAlphaEl, alphaEl);
    _domCache.alpha = newAlphaEl;
    newAlphaEl.querySelectorAll("[data-letter]").forEach((el) => {
      el.addEventListener("click", () => {
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
    newAlphaEl.querySelector('[data-filter="fav"]')?.addEventListener("click", () => {
      filterFav = !filterFav;
      if (filterFav) filterLetter = null;
      updateAlpha();
      updateFavIndicator();
    });
  }
}
function updateFavIndicator() {
  if (_domCache.favIndicator) {
    _domCache.favIndicator.style.display = filterFav ? "block" : "none";
  }
}
window.setFilterFav = setFilterFav;
function initDisplay() {
  _cacheDom();
  const games = getGames();
  if (!games.length) return;
  filterFav = false;
  filterLetter = null;
  updateFavIndicator();
  const g = games[0];
  const gL = games[ix(-1)] || games[0];
  const gR = games[ix(1)] || games[0];
  if (!g) return;
  const bgCa = document.getElementById("bgCa");
  const bgLa = document.getElementById("bgLa");
  const bgRa = document.getElementById("bgRa");
  const defaultImg = "assets/no-image.svg";
  if (bgCa) {
    bgCa.style.backgroundImage = imgPath(g) ? `url('${imgPath(g)}')` : `url('${defaultImg}')`;
    bgCa.style.backgroundSize = "cover";
  }
  if (bgLa) {
    bgLa.style.backgroundImage = imgPath(gL) ? `url('${imgPath(gL)}')` : `url('${defaultImg}')`;
    bgLa.style.backgroundSize = "cover";
  }
  if (bgRa) {
    bgRa.style.backgroundImage = imgPath(gR) ? `url('${imgPath(gR)}')` : `url('${defaultImg}')`;
    bgRa.style.backgroundSize = "cover";
  }
  updateUI(g, gL, gR);
  preloadGameImages(g);
}
function setIdleUI(on) {
  setIdle(on);
  if (_domCache.screen) _domCache.screen.classList.toggle("idle", on);
}
function shotsAppear() {
  const shots = document.querySelectorAll(".shot");
  shots.forEach((s, i) => {
    s.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    s.style.opacity = "1";
    s.style.transform = "translateY(0px) scale(1)";
  });
}
function shotsDisappear(cb) {
  const shots = document.querySelectorAll(".shot");
  shots.forEach((s) => {
    s.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    s.style.opacity = "0";
    s.style.transform = "translateY(30px) scale(0.97)";
  });
  setTimeout(() => {
    if (cb) cb();
  }, 300);
}
function btnsHide() {
  const btns = document.querySelector(".btns");
  if (btns) {
    btns.style.opacity = "0";
    btns.style.pointerEvents = "none";
  }
}
function btnsShow() {
  const btns = document.querySelector(".btns");
  if (!btns) return;
  btns.style.opacity = "1";
  btns.style.pointerEvents = "auto";
}
export {
  AL,
  MAX_DISPLAYED_GAMES,
  btnsHide,
  btnsShow,
  filterFav,
  filterLetter,
  getFilteredGames,
  initDisplay,
  invalidateFilterCache,
  ix,
  setFilterFav,
  setFilterLetter,
  setIdleUI,
  shotsAppear,
  shotsDisappear,
  updateUI
};
